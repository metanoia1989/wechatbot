
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { promisify } = require('util')
const fs = require('fs');
const path = require('path');

/**
 * 测试chart生成
 */
var data = [
   { groupname: '北京2馆', num: '72' },
  { groupname: '北京9馆', num: '3' },
  { groupname: '北京3馆', num: '83' },
  { groupname: '北京6馆', num: '28' },
  { groupname: '北京4馆', num: '69' },
  { groupname: '北京5馆', num: '80' },
  { groupname: '北京11馆', num: '88' },
  { groupname: '北京13馆', num: '191' },
  { groupname: '北京15馆', num: '81' },
  { groupname: '北京18馆', num: '55' },
  { groupname: '北京20馆', num: '179' },
  { groupname: '北京21馆', num: '63' },
  { groupname: '广州1馆', num: '186' },
  { groupname: '北京28馆', num: '179' },
  { groupname: '广州16馆', num: '193' },
  { groupname: '广州7馆', num: '115' },
  { groupname: '广州8馆', num: '318' },
  { groupname: '广州11馆', num: '2' },
  { groupname: '广州15馆', num: '22' },
  { groupname: '佛山1馆', num: '3' },
  { groupname: '北京29馆', num: '140' },
  { groupname: '深圳1馆', num: '47' },
  { groupname: '上海1馆', num: '48' },
  { groupname: '上海2馆', num: '500' },
  { groupname: '上海3馆', num: '33' },
  { groupname: '北京30馆', num: '63' },
  { groupname: '广州20馆', num: '173' }
]
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
  for(let i=0; i<data.length; i++) {
    let j = i % 7;
    selected_bgs.push(bgSets[j]);
    selected_bds.push(bdSets[j]);
  }

  let labels = data.map(item => item.groupname)
  data = data.map(item => item.num)

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
  const filePath = path.join(path.dirname(__dirname), 'public/uploads')
  const fileName = path.join(filePath, `${name}.png`)
  await promisify(fs.writeFile)(fileName, image)
  return fileName
}

async function main(){
  await generateTheDayRentChart('test', data)
}

main().catch(error => console.error(error))
