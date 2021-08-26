# 高德地图生成 geojson

基于[阿里云 geojson](http://datav.aliyun.com/tools/atlas/index.html) 脚本来生成 json

### 执行

拉下包后执行 `npm run start`

### 参数

| 参数   | 说明       | 类型    | 可选值 | 默认值  |
| ------ | ---------- | ------- | ------ | ------- |
| name   | 地方名     | string  | —      | '中国'  |
| adcode | 地理编码   | number  | —      | 100000  |
| backup | 是否备份   | boolean | —      | true    |
| dist   | 生成目录名 | string  | —      | geoJson |
