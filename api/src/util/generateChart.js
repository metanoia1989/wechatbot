import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import config from "../config.js";
/**
 * 生成图表图片文件
 * @param {Object} data
 *  date 日期
 *  num 数量
 */
async function generateChart(name, data) {
    const width = 600; //px
    const height = 600; //px
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    const configuration = {
        type: 'line',
        data: {
            datasets: [{
                    label: name,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: data,
                }]
        },
        options: {
            parsing: {
                xAxisKey: 'date',
                yAxisKey: 'num',
            },
            layout: {
                padding: 20
            }
        },
        plugins: [plugin]
    };
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const filePath = path.join(path.dirname(config.__dirname), 'public/uploads');
    const fileName = path.join(filePath, `${name}.png`);
    await promisify(fs.writeFile)(fileName, image);
    return fileName;
}
/**
 * 当日借阅统计图表生成
 *
 * @param {String} name
 * @param {Object} data
 *  date 日期
 *  num 数量
 */
async function generateTheDayRentChart(name, data) {
    const width = 600; //px
    const height = 600; //px
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    const bgSets = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ];
    const bdSets = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
    ];
    let selected_bgs = []; // 选中的背景色
    let selected_bds = []; // 选中的边框色
    for (let i = 0; i < data.length; i++) {
        let j = i % 7;
        selected_bgs.push(bgSets[j]);
        selected_bds.push(bdSets[j]);
    }
    let labels = data.map(item => item.groupname);
    data = data.map(item => item.num);
    const configuration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                    axis: 'y',
                    label: name,
                    data: data,
                    fill: false,
                    backgroundColor: selected_bgs,
                    borderColor: selected_bds,
                    borderWidth: 1,
                }]
        },
        options: {
            indexAxis: 'y',
            layout: {
                padding: 20
            },
            devicePixelRatio: 6,
        },
        plugins: [plugin]
    };
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const filePath = path.join(path.dirname(config.__dirname), 'public/uploads');
    const fileName = path.join(filePath, `${name}.png`);
    await promisify(fs.writeFile)(fileName, image);
    return fileName;
}
export { generateChart };
export { generateTheDayRentChart };
export default {
    generateChart,
    generateTheDayRentChart
};
