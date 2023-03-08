import axios from "axios";

axios.get('https://www.baidu.com').then(res => {
    console.log('响应', res)
});