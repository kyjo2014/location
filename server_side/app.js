const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const socketioJwt = require("socketio-jwt");
const jwt = require('jsonwebtoken');

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

let roomNum = 0;

const rooms = {} //房间列表

const users = {} //用户列表

//如果直接访问服务器api重定向到spa首页
app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/index.html')
})

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
});
//登录
app.post('/login', (req, res) => {
    let newPeople = true
    if (users[req.body.user]) {
        var now = Date.now()
        if (now - users[req.body.user].loginDate < 1500) {
            newPeople = false
            res.send({
                code: '401',
                message: '用户已存在，请稍后再登录'
            })
        } else {
            newPeople = true
        }

    }
    if (newPeople) {
        let room = null
        try {
            if (req.body.newRoom) {
                rooms[roomNum] = [req.body.user]
                room = roomNum
                roomNum++
            } else {
                if (!rooms[req.body.roomNum]) {
                    res.send({
                        code: '404',
                        message: '不存在此房间'
                    })
                    return
                }
                rooms[req.body.roomNum].push(req.body.user)
                room = req.body.roomNum
            }
            users[req.body.user] = {
                id: req.body.user,
                room: room,
                loginDate: Date.now()
            }
        } catch (e) {
            console.log(e)
            res.send({
                code: '404',
                message: e
            })
        }

        var token = jwt.sign(users[req.body.user], 'your secret or public key', {
            expiresIn: 6000 * 5
        });
        res.send({
            code: '200',
            message: '登录成功',
            data: {
                token: token,
                roomNum: room,
                id: req.body.user
            }
        })
    }

})



var server = http.createServer(app).listen(3000);
var io = socketio.listen(server)

//socket建立连接
io.sockets.on('connection', socketioJwt.authorize({
    secret: 'your secret or public key',
    timeout: 15000 // 15 seconds to send the authentication message
})).on('authenticated', (socket) => {
    socket.join(socket.decoded_token.room, () => {
        socket.broadcast.to(socket.decoded_token.room).emit('join', socket.decoded_token.id + '加入房间');
    })

    socket.on('online', (data) => {

        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        // socket.name = data.user;
        // if (!users[data.user]) {
        //     users[data.user] = {
        //         id: data.user,
        //         position: {
        //             log: data.log,
        //             lat: data.lat
        //         }
        //     }
        // }

    })
    socket.on('update', (data) => {

        socket.broadcast.to(socket.decoded_token.room).emit('reply', {
            user: socket.decoded_token.id,
            position: {
                log: data.pos.log,
                lat: data.pos.lat
            }
        })
    })


    socket.on('disconnect', (data) => {
        console.log(data)
    })
})