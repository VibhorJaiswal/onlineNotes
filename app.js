const express = require('express');
const app = express();
const path = require('path');
const con = require(__dirname + '/dbcon');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { log } = require('console');
const saltRounds = 10;
let port = process.env.PORT || 3000;

app.set("view options", { layout: false });
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// process.on('uncaughtException', function (err) {
//     console.log(err);
// }); 

con.connect((err) => {
    if (err) throw err;
});


app.get('/', (req, res) => {
    // console.log('hello from app.js :D');
    res.render('index.html');

});

app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'Aft_Login.html'));
});
// console.log(port);       
app.listen(port, () => {
    console.log('listenig at port ',port);
});

//To create an account ..............
app.post('/signup', (req, res) => {

    let uname;
    let pass;

    bcrypt.hash(req.body.password, saltRounds, function (err, passhash) {
        if (err) throw err;

        pass = passhash;

        bcrypt.hash(req.body.username, saltRounds, function (err, namehash) {
            if (err) throw err;

            uname = namehash;

            con.query(`INSERT INTO users (name, pass, id) VALUES (? , ? , ?)`,[req.body.username, pass, uname], (err, result) => {

                if (err) {

                    if (err.code == 'ER_DUP_ENTRY') {
                        return res.send('false');

                    }
                    else {
                        throw err;
                    }
                }
                res.send(uname);

            });
        });
    });

});


//To login user.......
app.post('/', (req, res) => {

    const name = req.body.username;
    const upass = req.body.password;

        con.query(`select pass,id from users where name = ?`,[name], (err, resfromdb) => {

            if (err) throw err;

            // console.log(resfromdb);

            let resultFromDb = JSON.parse(JSON.stringify(resfromdb));
            // console.log(resultFromDb.length);
            if (resultFromDb.length == 0) {
                res.send('Not Registered');
            } else {
                bcrypt.compare(upass, resultFromDb[0].pass, (err, resultforpass) => {

                    if (err) throw err;

                    if (resultforpass) {

                        let userdata = {};
                        userdata.id = resultFromDb[0].id;

                            con.query(`select title, note, dateAndTime from messages where id = ?`,[resultFromDb[0].id], (err, msgAsRes) => {

                                if (err) throw err;

                                userdata.msg = (JSON.parse(JSON.stringify(msgAsRes)));

                                // console.log(userdata);
                                res.send(JSON.stringify(userdata));
                            });
                    } else {
                        res.send(resultforpass);
                    }

                });
            }
        });
});


//To add note............
app.post('/addnote', (req, res) => {

    let msgid = req.body.id;
    let msgtitle = req.body.userTitle;
    let msgnote = req.body.userNote;
    let msgtime = req.body.time;

    con.query(`insert into messages (id, title, note, dateAndTime) values (?, ?, ?, ?)`,[msgid, msgtitle, msgnote, msgtime], (err, resAftInsert) => {

        if (err) throw err;

        resAftInsert = JSON.parse(JSON.stringify(resAftInsert));
        if (resAftInsert.affectedRows == 1) {
            con.query(`select title, note, dateAndTime from messages where id = ?`,[msgid], (err, msgs) => {

                if (err) throw err;

                res.send(JSON.parse(JSON.stringify(msgs)));
            });
        } else {
            res.send(false);
        }
    });
});



//To delete a note............
app.post('/api/del', (req, res) => {

    const id = req.body.id;
    const note = req.body.note;
    const title = req.body.title;
    const time = req.body.time;

    con.query(`delete from messages where id = ? and title = ? and note = ? and dateAndTime = ?`,[id, title, note, time], (err, isDeleted) => {

        if (err) throw err;

        isDeleted = JSON.parse(JSON.stringify(isDeleted));

        if (isDeleted.affectedRows == 1) {

            con.query(`select title, note, dateAndTime from messages where id = ?`,[id], (err, msgs) => {

                if (err) throw err;

                res.send(JSON.parse(JSON.stringify(msgs)));
            });

        }
    });
});

// temp comment