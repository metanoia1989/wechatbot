const express = require('express')
const WechatyOpenApi = require('wechaty-openapi').WechatyOpenApi

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const grpcHost = process.env.GRPC_HOST ? process.env.GRPC_HOST : 'localhost'
const grpcPort = process.env.GRPC_PORT ? parseInt(process.env.GRPC_PORT) : 50051
const protoFileList = []
const openApi = new WechatyOpenApi({
    grpcHost,
    grpcPort,
    protoFileList
})
const mountpoint = '/openapi'
app.use(mountpoint, openApi.router())

const app_port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4545

app.listen(app_port, () => {
    console.info(`Listening on http://localhost:${app_port}${mountpoint}, proxying to gRPC on ${grpcHost}:${grpcPort}`)
});