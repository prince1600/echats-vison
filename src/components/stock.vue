<template>
  <div class="com-container">
    <div class="com-chart" ref="stock"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: [],
      chartInstance: null,
      currentIndex: 0, // 0或1 （10个圆环图分2页）
      intervalId : 0
    };
  },
 created() {
    this.$socket.register('stockData', this.getData)
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
        action: 'getData',
        socketType: 'stockData',
        chartName: 'stock',
        value: ''
      })
    this.adaptScreen();
    this.startInterval()
    window.addEventListener("resize", this.adaptScreen);
  },
  destroyed() {
    window.removeEventListener("resize", this.adaptScreen);
    clearInterval(this.intervalId)
    this.$socket.unregister('stockData')
  },
  methods: {
    getData(data) {
      // const { data } = await this.$http.get("stock");
      
      this.allData = data;
      console.log(this.allData);
      this.updataChart();
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["stock"], "chalk");
      const option = {
        title: {
          text: "▎库存和销量分析",
          top: 20,
          left: 20,
        },
      };
      this.chartInstance.setOption(option);
      this.chartInstance.on('mouseover', () => {
          clearInterval(this.intervalId)
      })
      this.chartInstance.on('mouseout', () => {
          this.startInterval()
      })
    },
    updataChart() {
      const centerPoints = [
        //圆心
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colors = [
          //各圆环渐变色
          ['#4FF778', '#0BA82C'],
          ['#E5DD45', '#E8B11C'],
          ['#E8821C', '#E55445'],
          ['#5052EE', '#AB6EE5'],
          ['#23E5E5', '#2E72BF'],
      ]
      const start = this.currentIndex * 5
      const end = this.currentIndex * 5 + 5
      const showData = this.allData.slice(start, end);
      const seriesLs = showData.map((item, index) => {
        return {
          type: "pie",
          // [外径， 内径] 显示圆环
        //   radius: [110, 100], 
          center: centerPoints[index],
          hoverAnimation: false, // 鼠标移入的动画
          labelLine: {
            //指示线条
            show: false,
          },
          label: {
            position: "center",
            color: colors[index][0]
          },
          data: [
            {
              value: item.sales,
              name: item.name + '\n' + item.sales,
              itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                       {
                           offset: 0,
                           color: colors[index][0]
                       },
                       {
                           offset: 1,
                           color: colors[index][1]
                       },
                  ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                  color: '#333843'
              }
            },
          ],
        };
      });
      const updateOption = {
        series: seriesLs,
      };
      this.chartInstance.setOption(updateOption);
    },
    adaptScreen() {
      const titleFontSize = this.$refs['stock'].offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2
      const outerRadius = innerRadius * 1.125
      const adaptOption = {
          title: {
              textStyle: {
                  fontSize: titleFontSize
              }
          },
          series: [
              {   
                  type: 'pie',
                  radius: [outerRadius, innerRadius],
                  label: {
                      fontSize: titleFontSize / 2
                  }
              },
              {   
                  type: 'pie',
                  radius: [outerRadius, innerRadius],
                  label: {
                      fontSize: titleFontSize / 2
                  }
              },
              {   
                  type: 'pie',
                  radius: [outerRadius, innerRadius],
                  label: {
                      fontSize: titleFontSize / 2
                  }
              },
              {   
                  type: 'pie',
                  radius: [outerRadius, innerRadius],
                  label: {
                      fontSize: titleFontSize / 2
                  }
              },
              {   
                  type: 'pie',
                  radius: [outerRadius, innerRadius],
                  label: {
                      fontSize: titleFontSize / 2
                  }
              },
              
          ]
      };
      this.chartInstance.setOption(adaptOption);
      this.chartInstance.resize();
    },
    startInterval(){
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = setInterval(() => {
            this.currentIndex = Math.abs(this.currentIndex - 1)
            this.updataChart()
        }, 2000)
    }
  },
};
</script>
<style lang="">
</style>