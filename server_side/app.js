const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const crypto = require('crypto');
const hash = crypto.createHash('sha256');



//生成express实例
let app = express()

//环境变量
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


const rooms = {} //房间列表

const users = {} //用户列表

//如果直接访问服务器api重定向到spa首页
app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/index.html')
})

//登录
app.post('/login', (req, res) => {

})



var server = http.createServer(app).listen(3000);
var io = socketio.listen(server)

//socket建立连接
io.sockets.on('connection', (socket) => {
    socket.on('online', (data) => {
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        socket.name = data.user;
        if (!users[data.user]) {
            users[data.user] = {
                id: data.user,
                position: {
                    log: data.log,
                    lat: data.lat
                }
            }
        }
    })
    socket.on('emit_method', (data) => {
        console.log(data)
    })
    socket.on('update', (data) => {

    })

    socket.on('logout', (data) => {

    })
})