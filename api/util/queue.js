//**************************************************************
// 简单的队列结构+事件订阅模式 实现多生产者单消费者的消息队列
//**************************************************************
const { EventEmitter }= require('events')
const { delay, isAsync } = require('./server')

class Queue {
    constructor() {
        this.callbacks = []
    }

    enqueue(callback) {
        this.callbacks.push(callback)
    }

    dequeue() {
        return this.callbacks.shift()
    }

    isEmpty() {
        return this.callbacks.legnth == 0
    }

    get length() {
        return this.callbacks.length
    }
}

const queue = new Queue()
const emitter = new EventEmitter
emitter.on("newJob", async () => {
    // 根据队列长度来设定延时时间，来控制出列速度
    let size = queue.length > 0 ? queue.length : 1
    await delay(size * 1000)
    if (!queue.isEmpty()) {
        var cb = queue.dequeue()
        if (isAsync(cb)) {
            await cb()
        } else {
            cb()
        }
    }
})

module.exports = {
    pushJob: async (job) => {
        queue.enqueue(job)
        emitter.emit("newJob")
    },
}

