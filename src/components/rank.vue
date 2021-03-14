<template>
  <div class="com-container">
    <div class="com-chart" ref="rank"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: null,
      chartInstance: null,
      startValue: 0, // zoomData显示 起点
      endValue: 9,   // zoomData显示 终点
      intervalId: 0,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.adaptScreen);
    this.adaptScreen();
  },
  destroyed() {
    window.removeEventListener("resize", this.adaptScreen);
    clearInterval(this.intervalId)
  },
  methods: {
    async getData() {
      // ...
      const { data } = await this.$http.get("rank");
      this.allData = data.sort((x, y) => y.value - x.value);
      this.updataChart();
      this.startInterval()
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["rank"], "chalk");
      const option = {
        title: {
            text: '▎地区销售排行',
            left: 20,
            top: 20,
        },
        grid: {
            top: "40%",
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            show: true
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
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
      const colors = [
        ["#0BA82C", "#4FF778"],
        ["#2E73BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const provinceList = this.allData.map((item) => item.name);
      const valueList = this.allData.map((item) => item.value);
      const updataOption = {
        dataZoom: {
            show: false,
            startValue: this.startValue,
            endValue: this.endValue
        },
        xAxis: {
          data: provinceList,
        },
        series: {
          data: valueList,
          itemStyle: {
            color: (arg) => {
              let colorPair
              if (arg.value > 300) {
                colorPair = colors[0];
              } else if (arg.value > 200) {
                colorPair = colors[1];
              } else {
                colorPair = colors[2];
              }
              return this.getLinearGradient(colorPair[0], colorPair[1])
            },
          },
        },
      };
      this.chartInstance.setOption(updataOption);
    },
    adaptScreen() {
      const titleFontSize = this.$refs['rank'].offsetWidth / 100 * 3.6
      const adaptOption = {
          title: {
              textStyle: {
                  fontSize: titleFontSize
              }
          },
          series: [
              {
                  barWidth: titleFontSize * 1.2,
                  itemStyle: {
                      barBorderRadius: [titleFontSize / 2,titleFontSize / 2, 0, 0]
                  }
              }
          ]
      };
      this.chartInstance.setOption(adaptOption);
      this.chartInstance.resize();
    },
    getLinearGradient(color1, color2) {
      return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: color1,
        },
        {
          offset: 1,
          color: color2,
        },
      ]);
    },
    startInterval(){
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        this.intervalId = setInterval(() => {
            if (this.endValue === this.allData.length - 1) {
                this.startValue = 0
                this.endValue = 9
            } else {
                this.startValue++
                this.endValue++
            }
            this.updataChart()
        },2000)
    }
  },
};
</script>
<style lang="">
</style>