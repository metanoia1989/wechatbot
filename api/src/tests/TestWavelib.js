/**
 * 测试微澜图书馆的数据获取
 */
import { fetchYidiToken } from '../util/wavelib.js'

fetchYidiToken

async function main() {
    let token = await fetchYidiToken();
    console.log('token', token)
}


main();