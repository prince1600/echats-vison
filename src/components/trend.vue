<template>
  <div class="com-container">
    <div class="title" >
      <select v-model="selectedType" :style="comStyle">
        <option v-for="item in types" :key="item.key" :value="item.key">
          {{ item.text }} 
        </option>
      </select>
      <span :style="{fontSize: titleFontSize/3 + 'px'}"> 🔽</span>
    </div>
    <div class="com-chart" ref="trend"></div>
  </div>
</template>
<script>
const colors1 = [
  "rgba(11, 168, 44, 0.5)",
  "rgba(44, 110, 255, 0.5)",
  "rgba(22, 242, 217, 0.5)",
  "rgba(254, 33, 30, 0.5)",
  "rgba(250, 105, 0, 0.5)",
];
const colors2 = [
  "rgba(11, 168, 44, 0)",
  "rgba(44, 110, 255, 0)",
  "rgba(22, 242, 217, 0)",
  "rgba(254, 33, 30, 0)",
  "rgba(250, 105, 0, 0)",
];

export default {
  data() {
    return {
      allData: [],
      chartInstance: null,
      selectedType: "",
      titleFontSize: 0
    };
  },
  created() {
    this.$socket.register('trendData', this.getData)
  },
  async mounted() {
    this.initChart();
    // await this.getData();
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener("resize", this.adaptScreen);
    this.adaptScreen();
  },
  destroyed() {
    removeEventListener("resize", this.adaptScreen);
    this.$socket.unregister('trendData')
  },
  computed: {
    types() {
      return this.allData.type ? this.allData.type : [];
    },
    comStyle(){
        return {
            fontSize: this.titleFontSize + 'px'
        }
    }
  },
  watch: {
    selectedType() {
      this.updateChart();
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["trend"], "chalk");
      const initOption = {
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 50,
          top: "15%",
          icon: "circle",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData(res) {
      // const { data } = await this.$http.get("trend");
      this.allData = res;
      this.selectedType = this.types[0].key;
      console.log(this.types);

      console.log(this.allData, this.selectedType);
      this.updateChart();
    },
    updateChart() {
      const mapData = this.allData[this.selectedType].data;
      const seriesList = mapData.map((item, index) => {
        return {
          type: "line",
          data: item.data,
          name: item.name,
          stack: "map",
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colors1[index],
              },
              {
                offset: 1,
                color: colors2[index],
              },
            ]),
          },
        };
      });
      const legendList = mapData.map((item) => item.name);
      const updateOption = {
        xAxis: {
          data: this.allData.common.month,
        },
        series: seriesList,
        legend: {
          data: legendList,
        },
      };
      this.chartInstance.setOption(updateOption);
    },
    adaptScreen() {
      this.titleFontSize = this.$refs['trend'].offsetWidth / 100 * 3.6
      const adapterOption = {
          legend: {
              itemWidth: this.titleFontSize,
              itemHeight: this.titleFontSize,
              itemGap: this.titleFontSize,
              textStyle: {
                  fontSize: this.titleFontSize / 1.5
              }
          }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  position: absolute;
  left: 8%;
  top: 6%;
  z-index: 1;
  select {
    border: none;
    outline: none;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: #222733;
    color: #fff;
    cursor: pointer;
    font-size: 30px;
  }
}
</style>