<template>
  <div class="com-container">
    <div class="com-chart" ref="hot"></div>
    <span :style="comStyle" class="iconfont arrow-l" @click="toLeft"
      >&#xe6ef;</span
    >
    <span :style="comStyle" class="iconfont arrow-r" @click="toRight"
      >&#xe6ed;</span
    >
    <h1 class="title" :style="{ fontSize: titleFontSize + 'px' }">
      {{ activeTitle }}
    </h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: null,
      chartInstance: null,
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  created(){
    this.$socket.register('hotData', this.getData)
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hotproduct",
      value: "",
    });
    this.adaptScreen();
    window.addEventListener("resize", this.adaptScreen);
  },
  destroyed() {
    window.removeEventListener("resize", this.adaptScreen);
    this.$socket.unregister('hotData')
  },
  computed: {
    activeTitle() {
      if (!this.allData) return "";
      return this.allData[this.currentIndex].name;
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize * 2 + "px",
      };
    },
  },
  methods: {
    async getData(data) {
      // ...
      // const { data } = await this.$http.get("hotproduct");
      this.allData = data;
      console.log(this.allData);
      this.updataChart();
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["hot"], "chalk");
      const option = {
        title: {
          text: "▎热销商品占比",
          left: 20,
          top: 10,
        },
        legend: {
          top: "10%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (tag) => {
            const details = this.allData[this.currentIndex].children[
              tag.dataIndex
            ].children;
            let text = ``;
            let total = 0;
            details.forEach((item) => (total += item.value));
            details.forEach((item) => {
              let percent = (item.value / total) * 100;
              text += `${item.name}: ${percent.toFixed(1)}%<br>`;
            });
            return text;
          },
        },
        series: {
          type: "pie",
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
            },
            labelLine: {
              show: false,
            },
          },
        },
      };
      this.chartInstance.setOption(option);
    },
    updataChart() {
      const seriesList = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
          };
        }
      );
      const legendLsit = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const updateOption = {
        series: [
          {
            data: seriesList,
          },
        ],
        legend: {
          data: legendLsit,
        },
      };
      this.chartInstance.setOption(updateOption);
    },
    adaptScreen() {
      this.titleFontSize = (this.$refs["hot"].offsetWidth / 100) * 3.6;
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 6,
            center: ["50%", "57%"],
          },
        ],
      };
      this.chartInstance.setOption(adaptOption);
      this.chartInstance.resize();
    },
    toLeft() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.allData.length - 1;
      } else {
        this.currentIndex--;
      }
      this.updataChart();
    },
    toRight() {
      if (this.currentIndex === this.allData.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updataChart();
    },
  },
};
</script>
<style lang="less" scoped>
.arrow-l {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.arrow-r {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.title {
  position: absolute;
  right: 10%;
  bottom: 10%;
  color: #fff;
}
</style>