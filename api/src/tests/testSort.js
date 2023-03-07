let data = [
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
];
data.sort(function (a, b) {
    let [_1, a_name, a_num] = a.groupname.match(/(.*?)(\d+)/);
    let [_2, b_name, b_num] = b.groupname.match(/(.*?)(\d+)/);
    if (a_name == b_name) {
        return a_num < b_num;
    }
    return a_name.localeCompare(b_name, "zh");
});
console.log(data);
