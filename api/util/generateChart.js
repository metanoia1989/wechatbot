const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { promisify } = require('util')
const fs = require('fs');
const path = require('path');

/**
 * 生成图表base64数据
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
  const filePath = path.join(path.dirname(__dirname), 'public/uploads')
  const fileName = path.join(filePath, `${name}.png`)
  await promisify(fs.writeFile)(fileName, image)
  return fileName
}

module.exports = {
  generateChart
}

