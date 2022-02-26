/* โหลด Express มาใช้งาน */
//import connection from "../db/config";
var app = require('express')();
//var mysql = require('mysql2');
const config = require('./db/config');
var bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio')
//const { alluser, login, createuser,userlistByChannel,userDetailById } = require('./service/user');
const { createticket, updateticket, ticketDetailById, buyall, countbuy } = require('./service/ticket');






var listdata;
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'Dduan@it3',
//     database : 'gold'
//   });


/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */

var port = process.env.PORT || 7778;
const url = 'https://xn--42cah7d0cxcvbbb9x.com/'


/* Routing */
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.all('*', function (req, res, next) {
    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": '*',
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});

app.get("/loginform", (req, res) => {
    tk = ""
    res.sendFile(path.join(__dirname + '/login.html'));

});

app.post('/ticket/buy', function (req, res) {
    console.log('req.bodylllllllllllllllllllllllllllllllllll');
    // let reqbody = {
    //     ticket_number : ["010100010700"],
    //     code_buy : "0001",
    //     code_scan_door : "0002"

    // };

    let reqbody = req.body;
    const hrtime = process.hrtime();
    let milliSeconds = parseInt(((hrtime[0] * 1e3) + (hrtime[1]) * 1e-6));
    console.log('milliSeconds: ' + milliSeconds);
    var todayDate = reqbody.date_match;
    //console.log(todayDate);

    reqbody.ticket_number.forEach(ticketNumber => {
        let ticketAround = ticketNumber.substring(0, 2);
        let ticketType = ticketNumber.substring(2, 4);
        let ticketTransaction = 'SFB' + milliSeconds;
        let ticketPrice = 0;
        if (ticketNumber.substring(8) != '0000') {
            ticketPrice = ticketNumber.substring(8);
        }

        let dataBuy = {
            ticket_number: ticketNumber,
            ticket_transaction: ticketTransaction,
            ticket_around: ticketAround,
            ticket_type: ticketType,
            ticket_price: ticketPrice,
            ticket_expire: '0',
            status: '0',
            stage: '1',
            code_buy: reqbody.code_buy,
            code_scan_door: reqbody.code_scan_door,
            date_match:todayDate
        };

        createticket(dataBuy).then(function () {
            console.log("ok........");
            res.json({ 'message': 'ok', 'result': '00' });


            //response.render('index', {data: data});
        });

        console.log(dataBuy);
    });
    console.log(req.body);
});



app.get('/ticket/scan/:id', function (req, res) {

    let id = req.params.id;
    let status = "";
    let stage = "";

    ticketDetailById(id, status, stage).then(function (data) {

        if (data == "") {
            res.json({ 'message': 'ไม่พบข้อมูลในระบบ', 'result': '01', 'payload': data });
        } else {

            status = "0";
            stage = 1;

            ticketDetailById(id, status, stage).then(function (data1) {

                if (data1 == "") {
                    res.json({ 'message': 'บัตรนี้ถูกใช้งานไปแล้ว', 'result': '02', 'payload': data1 });
                } else {

                    updateticket(2, id).then(function (data2) {
                        //res.json({ 'message': 'ok','result':'00' });
                        if (data1 == "") {
                            res.json({ 'message': 'ไม่สำเร็จ', 'result': '03', 'payload': '' });
                        } else {
                            res.json({ 'message': 'ok', 'result': '00', 'payload': data2 });
                        }
                    });
                }
            });
        }

        //console.log(data);
        //console.log(data[0].code);
        // response.render('index', {data: data});
    });

});
///////////////ตัวอย่างการเรียกจากโปรเจคทอง ของสนามวัวยังไม่มี table เก็บ user ////////////////
// app.get('/user', function (req, res) {
//     console.log(req.body);
//     alluser.then(function (data) {
//         res.json({ 'message': 'ok','result':'00', 'payload': data });
//         // response.render('index', {data: data});
//     });


// });

// app.post('/login', function (req, res) {

//     //connection.connect();
//     //config.db.connect();
//     //  config.db.query('SELECT * from admin', function (error, results, fields) {
//     //         if (error) throw error;
//     //         // console.log('The solution is: ', results);
//     //         listdata = results
//     console.log(req.body);
//     //         return listdata;
//     //     });
//     // config.db.end();
//     //connection.end();
//     //res.send('<h1>Hello Node.js</h1>');

//     // listdata = user.getuserlist();
//     // user.login(test);

//     login(req.body.username,req.body.password).then(function (data) {
//         res.json({ 'message': 'ok','result':'00', 'listdata': data });
//         // response.render('index', {data: data});
//     });



// });

// app.post('/user/store', function (req, res) {
//     console.log(req.body);

//     createuser(req.body).then(function (data) {
//         res.json({ 'message': 'ok','result':'00', 'listdata': data });
//         // response.render('index', {data: data});
//     });

// });

// app.post('/user/channel', function (req, res) {
//     console.log(req.body.channel);

//     userlistByChannel(req.body.channel).then(function (data) {
//         //res.json({ 'message': 'ok','result':'00', 'listdata': data });
//         res.json({ 'message': 'ok','result':'00', 'payload': data });
//         // response.render('index', {data: data});
//     });

// });

// app.get('/user/:id/show', function (req, res) {
//     console.log('user id ' + req.params.id);

//     userDetailById(req.params.id).then(function (data) {
//         //res.json({ 'message': 'ok','result':'00', 'listdata': data });
//         res.json({ 'message': 'ok','result':'00', 'payload': data });
//         // response.render('index', {data: data});
//     });

// });
app.get('/ticket/buyall/:id', function (req, res) {
//app.get('/ticket/buyall/:id:', function (req, res) {
    console.log(".......................");
    console.log('date_match  ' + req.params.id);

    //     buyall().then(function (data) {
    // res.json({ 'message': 'ok','result':'00', 'payload': data.length});
    countbuy(req.params.id.toString()).then(function (data) {
        res.json({ 'message': 'ok', 'result': '00', 'payload': data });
        // res.json(data);
        // response.render('index', {data: data});
    });
});

app.get('/ticket/buyall', function (req, res) {
    console.log(".......................");
    console.log('date_match  ' + req.params.id);
    res.send('<h1>This is index page</h1>');

});

app.get('/', function (req, res) {

    res.send('<h1>This is index page</h1>');

});





/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */

app.listen(port, function () {

    console.log('Starting node.js on port ' + port);

});