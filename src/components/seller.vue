<template>
  <div class="com-container">
    <div class="com-chart" ref="seller"></div>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      allData: [],
      names: [],
      values: [],
      currentPage: 1,
      totalPage: 0,
      intervalId: -1,
    };
  },
  created() {
    this.$socket.register('sellerData', this.getData)
  },
  async mounted() {
    this.initChart();
    // await this.getData();
    this.$socket.send({
        action: 'getData',
        socketType: 'sellerData',
        chartName: 'seller',
        value: ''
      })
    this.adaptScreen()
    this.startInterval();
    window.addEventListener('resize', this.handleResize) 
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    removeEventListener('resize', this.handleResize)
    this.$socket.unregister('sellerData')
  },
  computed: {
    start() {
      return (this.currentPage - 1) * 5;
    },
    end() {
      return this.start + 5;
    },
    ...mapState(['theme'])
  },
  watch: {
    theme(){
      this.chartInstance.dispose()  // 销毁实例
      this.initChart()  // 重新初始化
      this.updateChart()
      this.adaptScreen()
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["seller"], this.theme);
      const option = {
        title: {
          text: "▎商家销售数据",
          textStyle: {
            fontSize: 50,
          },
          top: 20,
          left: 20,
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.names.slice(this.start, this.end),
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2d3443",
              width: 66,
            },
          },
        },
        series: [
          {
            type: "bar",
            data: this.values.slice(this.start, this.end),
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 30, 30, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052ee",
                },
                {
                  offset: 1,
                  color: "#ab6ee5",
                },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.intervalId);
      });
      this.chartInstance.on("mouseout", () => {
        this.intervalId = setInterval;
        this.startInterval();
      });
    },

    async getData(res) {
      // const { data: res } = await this.$http.get("seller");
      this.allData = res;
      this.totalPage = Math.ceil(this.allData.length / 5);
    this.updateChart();

    },

    processData() {
      this.names = [];
      this.values = [];
      this.allData.forEach((item) => {
        this.names.push(item.name);
        this.values.push(item.value);
      });
    },
    updateChart() {
      this.processData()
      const option = {
        yAxis: {
          data: this.names.slice(this.start, this.end),
        },

        series: [
          {
            data: this.values.slice(this.start, this.end),
          },
        ],
      };
      this.chartInstance.setOption(option)
    },
    adaptScreen() {
      const titleFontSize = this.$refs['seller'].offsetWidth / 100 * 3.6
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      this.intervalId = setInterval(() => {
        this.currentPage === this.totalPage
          ? (this.currentPage = 1)
          : this.currentPage++;
        this.processData();
        this.updateChart();
      }, 3000);
    },

    handleResize() {
      clearInterval(this.intervalId)
      this.adaptScreen()
      this.startInterval()
    }
  },
  
  
};
</script>
<style lang="less" scoped>
</style>