const express = require('express')
const server = express()
const fs = require('fs')

// 跨域
server.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //     //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    //     res.header('Access-Control-Allow-Headers', 'Content-Type');
    //     res.header('Access-Control-Allow-Methods', '*');
    //     res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

server.engine('.html', require('express-art-template'));
server.set('view engine', '.html');
let router = express.Router();

server.use('/', express.static('./views/ceshi'));

router.get('/index', (req, res) => {
    res.render('index');
});

formidable = require("formidable");
// 获取本地局域网
const interfaces = require('os').networkInterfaces();
let url = interfaces['以太网'][1].address

// 生成文件上传二维码
console.log("文件上传！")
const qrcode = require('qrcode-terminal')
qrcode.generate(url + ':9599/index', {
    small: false // 多显示2个小二维码
})

// 文件上传
server.post("/upload", (req, res) => {
    var form = new formidable.IncomingForm()
    form.uploadDir = "./public" // 上传目录
    form.keepExtensions = true
    form.parse(req, function(err, fields, files) {
        if (err) return res.redirect(303, '/error')
        let response = {
            fields,
            files,
            msg: `成功上传至${form.uploadDir}`
        }
        res.send(response)
    })
})

// 测试项目
fs.readdir("./views/ceshi", (err, files) => {
    if (err) { console.log(err) }
    for (let i = 0; i < files.length; i++) {
        if (/\.html/.exec(files[i].toLowerCase())) {
            console.log("测试文件:" + files[i])
            qrcode.generate(url + ':9599/' + files[i], {
                small: false
            })
        }
    }
})

server.use(router);
server.listen(9599, () => { "服务器端口为:9599" })