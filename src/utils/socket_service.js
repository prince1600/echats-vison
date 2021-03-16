export default class SocketService {
    /* 
     * 单例
     */
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }
    callbackMapping = {}
    ws = null
    connected = false
    sendRetryCount = 0
    connectRetryCount = 0
    connect() {
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持WebSocket！')
        }
        this.ws = new WebSocket('ws://localhost:3030')

        this.ws.onopen = () => {
            this.connected = true
            console.log('WebSocket: 连接成功')
            this.connectRetryCount = 0
        }

        this.ws.onclose = () => {
            this.connected = false
            console.log('WebSocket: 断开连接')
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, this.connectRetryCount * 500);
        }

        this.ws.onmessage = msg => {
            const recvData = JSON.parse(msg.data)
            console.log('WebSocket: 收到server端数据', recvData)
            const { data, action, socketType } = recvData
            if (action === 'getData') {
                this.callbackMapping[socketType].call(this, JSON.parse(data))
            } else if (action === 'fullScreen') {

            } else if (action === 'themeChange') {

            }
        }
    }
    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500);
        }
    }

    register(socketType, callback) {
        this.callbackMapping[socketType] = callback
    }

    unregister(socketType) {
        this.callbackMapping[socketType] = null
    }
}