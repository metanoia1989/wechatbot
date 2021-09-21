
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { promisify } = require('util')
const fs = require('fs');
const path = require('path');

/**
 * 测试chart生成
 */
var data = [
  { "date": "2021-07-03", "num": "195" },
  { "date": "2021-07-04", "num": "30" },
  { "date": "2021-07-10", "num": "104" },
  { "date": "2021-07-17", "num": "98" },
  { "date": "2021-07-24", "num": "139" },
  { "date": "2021-07-31", "num": "194" },
  { "date": "2021-08-01", "num": "47" },
  { "date": "2021-08-04", "num": "25" }
]

const width = 400; //px
const height = 400; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


async function main(){
  // See https://www.chartjs.org/docs/latest/configuration
// Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
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
      type: 'bar',
      data: {
        datasets: [{
          label: '广州14馆',
          backgroundColor: "rgba(255,10,13,255)",
          borderColor: 'rgb(255, 99, 132)',
          data: data,
          fill: true,
        }]
      },
      options: {
        parsing: {
          xAxisKey: 'date',
          yAxisKey: 'num',
        }
      },
      plugins: [plugin]
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const filePath = path.join(path.dirname(__dirname), 'public/uploads')
    await promisify(fs.writeFile)(path.join(filePath, `chart.png`), image)
}

main().catch(error => console.error(error))
