<template>
    <div class="com-container" @dblclick="backWhole">
        <div class="com-chart" ref="map">
            
        </div>
    </div>
</template>
<script>
import ChinaMap from '../../public/static/map/china.json'
import {getProvinceMapInfo} from '../utils/map_utils'
import axios from 'axios'

export default {
    data() {
        return {
            chartInstance: null,
            allData: null,
            provinceData: {}
        }
    },
    created(){
        this.$socket.register('mapData', this.getData)
    },
    mounted(){
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'mapData',
            chartName: 'map',
            value: ''
        })
        window.addEventListener('resize', this.adaptScreen)
        this.adaptScreen()
    },
    destroyed(){
        window.removeEventListener('resize', this.adaptScreen)
        this.$socket.unregister('mapData')
    },
    methods: {
        async getData(data){
            //请求数据
            // const {data} = await this.$http.get('map')
            this.allData = data
            this.updataChart()
        },
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs['map'], 'chalk')
            this.$echarts.registerMap('china', ChinaMap)
            const option = {
                geo: {
                    type: 'map',
                    map: 'china',
                    top: '5%',
                    buttom: '5%',
                    itemStyle: {
                       areaColor: '#2E72BF',
                       borderColor: '#333'
                    }
                },
                title: {
                    text: '▎商家分布',
                    left: 20,
                    top: 20,
                },
                legend: {
                    left: '5%',
                    bottom: '5%',
                    orient: 'vertical'
                }
            }
            this.chartInstance.setOption(option)
            this.chartInstance.on('click', async arg => {
                const provinceInfo = getProvinceMapInfo(arg.name)
                if (!this.provinceData[provinceInfo.key]) {
                    const res = await axios.get('http://localhost:8080' + provinceInfo.path)
                    this.provinceData[provinceInfo.key] = res.data

                }
                this.$echarts.registerMap(provinceInfo.key, this.provinceData[provinceInfo.key])
                const changeOption = {
                    geo: {
                        map: provinceInfo.key
                    }
                }
                this.chartInstance.setOption(changeOption)
            })
        },
        updataChart() {
            const seriesList = this.allData.map(item => {
                return {
                    type: 'effectScatter',
                    name: item.name,
                    data: item.children,
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        scale: 5,
                        brushType: 'stroke'
                    }
                }
            })
            const legendList = this.allData.map(item => item.name)
            const updataOption = {
                series: seriesList,
                legend: {
                    data: legendList
                }
            }
            this.chartInstance.setOption(updataOption)
        },
        adaptScreen() {
            const titleFontSize = this.$refs['map'].offsetWidth / 100 * 3.6
            const adaptOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                legend: {
                    itemWidth: titleFontSize / 2,
                    itemHeight: titleFontSize / 2,
                    itemGap: titleFontSize / 2,
                    textStyle: {
                        fontSize: titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adaptOption)
            this.chartInstance.resize()
        },
        backWhole(){
            const option = {
                geo: {
                    map: 'china'
                }
            }
            this.chartInstance.setOption(option)
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>