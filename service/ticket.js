//var db = require('mysql');
const db = require('../db/config');


const ticketDetailById = async function (id, status, stage) {
    //console.log('test ............ ' + id);
    // return new Promise(function (resolve, reject) {
    var sql = 'SELECT * FROM sti_ticket_transaction WHERE id = ?';

    if (status != "") {
        sql += ' AND status = ' + status;
    }

    if (stage != "") {
        sql += ' AND stage = ' + stage;
    }
    console.log('test ............ ' + sql)
    //     config.db.query(sql, [id], function (err, result) {
    //         if (err) throw err;
    //         resolve(result);
    //     });
    // });
    const [rows, fields] = await db.promisePool.query(sql, [id]);
    console.log(rows);
    return rows;
}

// module.exports = {
//     getuserlist
// };


const buyall = async function () {
    const [rows, fields] = await db.promisePool.query("SELECT * from sti_ticket_transaction order by id desc LIMIT 0,10 ");
    console.log(rows);
    return rows;
    // return new Promise(async function (resolve, reject) {
    //     // config.db.connect(function(err) {
    //     //if (err) throw err;
    //     //await  config.db.connect();
    //     await config.db.query("SELECT * from sti_ticket_transaction order by id desc LIMIT 0,10 ", function (err, result) {
    //         if (err) throw err;
    //         resolve(result);
    //     });
    //     //  await config.db.end();

    //     //});

    //     //  })
    // });
}

const countbuy = async function (date_match) {


    // return new Promise(function (resolve, reject) {
    // config.db.connect(function(err) {
    //if (err) throw err;
    //await  config.db.connect();
    var sql = "SELECT COUNT(DISTINCT(ticket_number)) as ticketnum,sum(ticket_price) as total_price,t.ticket_type, a.desc as ticket_around,DATE_FORMAT(t.date_match, '%Y%m%d') as date_match " +
            " FROM sti_ticket_transaction t , sti_around a "+
            " WHERE t.ticket_around = a.code and DATE_FORMAT(t.date_match, '%Y%m%d') = ? "+
            " GROUP BY t.ticket_around,t.ticket_type,t.date_match ";
    //config.db.query("SELECT COUNT(DISTINCT(ticket_number)) as ticketnum,ticket_around,DATE_FORMAT(date_match, '%Y%m%d') as date_match FROM sti_ticket_transaction GROUP BY ticket_around,date_match", function (err, result) {
    //     console.log(result);
    //     if (err) throw err;
    //     resolve(result);
    //     //config.db.end();
    // });
    // await config.db.end();

    // });

    // })

    // return await config.db.query("SELECT COUNT(DISTINCT(ticket_number)) as ticketnum,ticket_around,DATE_FORMAT(date_match, '%Y%m%d') as date_match FROM sti_ticket_transaction GROUP BY ticket_around,date_match", []).then((results) => {

    //     console.log(results);

    // }).catch(function(err){

    //     console.log("Error:" + String(err));

    // });
    //});
    const [rows, fields] = await db.promisePool.query(sql, [date_match]);
    console.log(rows);
    return rows;
}


// var buyall1 = new Promise(function (resolve, reject) {
//     // config.db.connect(function(err) {
//     //if (err) throw err;
//     config.db.query("SELECT * from sti_ticket_transaction", function (err, result) {
//         if (err) throw err;
//         resolve(result);
//     });
//     //});

// });


// const userlistByChannel = function (channel) {
//     console.log('test ............ ' + channel);
//     return new Promise(function (resolve, reject) {
//         // config.db.connect(function(err) {
//         //if (err) throw err;
//         var sql = 'SELECT * FROM user WHERE channel = ? ';
//         config.db.query(sql,[channel], function (err, result) {
//             if (err) throw err;
//             resolve(result);
//         });


//         // });
//         // config.db.end()
//     });
// }
// const userDetailById = function (id) {
//     console.log('test ............ ' + id);
//     return new Promise(function (resolve, reject) {
//         // config.db.connect(function(err) {
//         //if (err) throw err;
//         var sql = 'SELECT * FROM user WHERE id = ? ';
//         config.db.query(sql,[id], function (err, result) {
//             if (err) throw err;
//             resolve(result);
//         });


//         // });
//         // config.db.end()
//     });
// }



// // var login = new Promise(function(resolve, reject){
// //     config.db.connect(function(err) {
// //       if (err) throw err;
// //       config.db.query("SELECT * from admin", function (err, result, fields) {
// //         if (err) throw err;
// //           resolve(result);
// //       });
// //     });
// //     config.db.end()
// // });
// // exports.method = function() {};
// // exports.otherMethod = function() {};
// const login = function (user, pass) {
//     console.log('test ............ ' + user);
//     return new Promise(function (resolve, reject) {
//         // config.db.connect(function(err) {
//         //if (err) throw err;
//         var sql = 'SELECT * FROM admin WHERE username = ? and password = ?';
//         config.db.query(sql,[user,pass], function (err, result, fields) {
//             if (err) throw err;
//             resolve(result);
//         });


//         // });
//         // config.db.end()
//     });
// }

const createticket = async function (data) {
    console.log('test ............ ' + data);
    // return new Promise(async function (resolve, reject) {
    //config.db.connect(function(err) {
    //  if (err) throw err;
    var sql = "INSERT INTO sti_ticket_transaction (ticket_number,ticket_transaction,ticket_around,ticket_type,ticket_price,ticket_expire,status,stage,code_buy,code_scan_door,date_match) VALUES (?)";

    var values = [
        data.ticket_number,
        data.ticket_transaction,
        data.ticket_around,
        data.ticket_type,
        data.ticket_price,
        data.ticket_expire,
        data.status,
        data.stage,
        data.code_buy,
        data.code_scan_door,
        data.date_match
    ];
    //  config.db.connect();
    // config.db.query(sql, [values], function (err, result) {
    //     console.log(err);
    //     if (err) throw err;
    //     resolve(result);
    //     //  config.db.end();
    // }
    // );

    //    config.db.end();
    //  return;
    // }
    //   );
    // config.db.end();
    //  });

    const [rows, fields] = await db.promisePool.query(sql, [values]);
    console.log(rows);
    return rows;

}

const updateticket = async function (stage, id) {
    //console.log('test ............ ' + data);
    //return new Promise(function (resolve, reject) {

    var sql = "UPDATE sti_ticket_transaction SET stage = ? Where id = ?";

    //     config.db.query(sql, [stage, id], function (err, row, result) {
    //         if (err) throw err;
    //         resolve(result);
    //     });
    // });

    const [rows, fields] = await db.promisePool.query(sql, [stage, id]);
    console.log(rows);
    return rows;
}

module.exports = {
    createticket,
    updateticket,
    ticketDetailById,
    buyall,
    countbuy
};