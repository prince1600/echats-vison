<template>
  <div class="com-container">
    <div class="com-chart" ref="hot"></div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            allData: null,
            chartInstance: null,
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        this.adaptScreen()
        window.addEventListener('resize', this.adaptScreen)
    },
    destroyed(){
        window.removeEventListener('resize', this.adaptScreen)
    },
    methods: {
        async getData(){
            // ... 
            this.updataChart()
        },
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs['hot'], 'chalk')
            const option = {}
            this.chartInstance.setOption(option)
        },
        updataChart(){
            const updateOption = {}
            this.chartInstance.setOption(updateOption)
        },
        adaptScreen(){
            const adaptOption = {}
            this.chartInstance.setOption(adaptOption)
            this.chartInstance.resize()
        }

    }
}
</script>
<style lang="">
    
</style>