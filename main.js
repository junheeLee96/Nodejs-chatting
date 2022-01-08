var express = require("express");
//make sure you keep this order
var app = express();
var http = require("http").createServer(app);
var fs = require("fs");
var ejs = require("ejs");
var bodyparser = require("body-parser");
var mysql = require("mysql");
var client = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cherrys6s~",
  database: "data",
});
var io = require("socket.io")(http);

http.listen(2000, () => {
  console.log("server is running");
});

var ios = require("express-socket.io-session");
var session = require("express-session");
var mysqlStore = require("express-mysql-session")(session);
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "cherrys6s~",
  database: "data",
};

var sessionStore = new mysqlStore(options);

var session = session({
  secret: "!CeCre@misS0d!!isious.",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
});

app.use(session);
io.use(ios(session, { autoSave: true }));

/*
server.listen(3000, () => {
  console.log("Server is running");
});*/

app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  /*if(req.session.owner){
    res.redirect('/joinpage');
  }else{
    res.redirect('/login');
  }*/
  res.redirect("/login");
});

app.get("/joinpage", (req, res) => {
  fs.readFile("mainjoinpage.html", "utf-8", (error, data) => {
    res.send(data);
  });
});

app.get("/login", (req, res) => {
  fs.readFile("mainlogin.html", "utf-8", (error, data) => {
    res.send(data);
  });
});

app.post("/joinpage", (req, res) => {
  var body = req.body;
  client.query(
    "insert into user (id,password,nickname,name,email,phonenumber value (?,?,?,?,?,?)",
    [
      body.id,
      body.password,
      body.nickname,
      body.name,
      body.email,
      body.phonenumber,
    ],
    (error, result) => {
      res.redirect("/login");
    }
  );
});

app.post("/login", (req, res) => {
  var body = req.body;
  client.query(
    "select number, id, password from user where id = ? and password = ?",
    [body.id, body.password],
    (error, result) => {
      if (error) {
        throw error;
      }
      if (result.length > 0) {
        req.session.number = result[0]["number"];
        res.redirect("/mainbook");
      } else {
        res.redirect("/login");
      }
    }
  );
});

app.get("/mainbook", (req, res) => {
  fs.readFile("mainbook.html", "utf-8", (error, data) => {
    client.query(
      "select number,nickname,phonenumber,email from user where number != ?",
      [req.session.number],
      function (error, result2) {
        client.query(
          "select nickname from user where number = ?",
          [req.session.number],
          function (error, result1) {
            console.log(result1);

            if (error) {
              throw error;
            }
            res.send(
              ejs.render(data, {
                data1: result1,
                data2: result2,
              })
            );
          }
        );
      }
    );
  });
});

var user;

app.get("/mainchat/:number", (req, res) => {
  fs.readFile("mainchat.html", "utf-8", (error, data) => {
    req.session.roomid = req.params.number;
    var roomi = req.session.number * req.session.roomid;

    client.query(
      "select message,date,nickname from room where roomid = ?",
      [roomi],
      function (error, result) {
        if (error) {
          throw error;
        }

        user = req.session.number;

      //  console.log(req.session.number);
      //  console.log(req.session.roomid);
        res.send(
          ejs.render(data, {
            data: result,
          })
        );
      }
    );
  });
});

io.on("connection", function (socket) {
  console.log("A user connected");
  console.log(socket.handshake.session.number);
  console.log(socket.handshake.session.roomid);
  var roomid =
    socket.handshake.session.number * socket.handshake.session.roomid;

  socket.on("chat message", (msg) => {
    console.log(user);
    socket.join(roomid);
    //client.query('insert into room value (?,?,?,?)',[roomid,msg.message,msg.date,socket.handshake.session.number])
    client.query(
      "select nickname from user where number = ?",
      [socket.handshake.session.number],
      function (error, result) {
        if (error) {
          throw error;
        }
        client.query("insert into room value (?,?,?,?,?)", [
          roomid,
          msg.message,
          msg.date,
          socket.handshake.session.number,
          result[0]["nickname"],
        ]);
      }
    );

    client.query(
      "select nickname from user where number = ?",
      [socket.handshake.session.number],
      function (error, result) {
        if (error) {
          throw error;
        }
        var name= result[0]["nickname"];
        var socketid = socket.id;
        io.sockets.in(roomid).emit("chat message", msg, name,socketid);

        //console.log(msg,roomid);
        // io.sockets.emit('chat message',msg);
      }
    );
  });

  socket.on("disconnect", () => {
    //console.log('user disconnected');
  });
});
