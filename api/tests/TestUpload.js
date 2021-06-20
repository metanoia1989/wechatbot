var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('file', fs.createReadStream('D:/物料/书虫/微信图片_20210618214619.png'));
data.append('id', '1');

var config = {
  method: 'post',
  url: 'http://127.0.0.1:8999/file/updateFile',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTYyOTI5MTkyMSwiaWF0IjoxNjI0MTA3OTIxfQ.73jWjgvPcY9Yy6RInUENkJTzKmaYeS9MMWrHo7LmOa8', 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});