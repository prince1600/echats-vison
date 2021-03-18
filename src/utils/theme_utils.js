const theme = {
    chalk: {
        backgroundColor: '#161522',
        titleColor: '#ffffff',
        //切换按钮图片路径
        themeSrc: 'qiehuan_dark.png',
        //页面顶部边框图片
        headerBorderSrc: 'header_border_dark.png',
    },
    vintage: {
        backgroundColor: '#c0c0c0',
        titleColor: '#000000',
        //切换按钮图片路径
        themeSrc: 'qiehuan_light.png',
        //页面顶部边框图片
        headerBorderSrc: 'header_border_light.png',
    }
}

export function getThemeValue(themeName){
    return theme[themeName]
}