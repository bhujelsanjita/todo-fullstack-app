const express = require("express");
const dotenv = require("dotenv");
const db = require("./dbconfig");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const ToDoList = require("./models/ToDoList");
const parser = require("body-parser");
// const ToDoList = require("./models/ToDoList");
dotenv.config();
var secret = process.env.SECRETKEY;
// const token ={
//   id: 100,
//   password:"hiiejfiae"
// };
// console.log(jwt.sign(token,secret))
// console.log(process.env.DBNAME);
const PORT = process.env.PORT || 3200;
const app = express();
app.use(parser.json());
// routes-
// sampleController
app.get("/", function (req, res) {
  console.log("homepage");
  res.send("<h1>This is homepage</h1>");
});
app.get("/groups", function (req, res) {
  res.send("<h1>Hi this is your group</h1>");
});

app.get("/task", function (req, res) {
  /*
  this /task is using GET HTTP method which will indicate to fetch data/task from database
  */
  if (
    req.headers.authorization == "" ||
    req.headers.authorization == null ||
    req.headers.authorization == undefined
  ) {
    res.status(403).send({
      success: true,
      message: "Unauthorised access",
    });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    try {
      let decodedToken = jwt.decode(token);
    } catch (err) {
      return res.status(403).send({
        message: "Invalid Token",
        success: false,
      });
    }
    ToDoList.findAll({
      raw: true,
    })
      .then((data) => {
        if (data == null || data == "") {
          return res.status(403).send({
            message: "Data not found",
            success: false,
          });
        }
        return res.status(200).send({
          success: true,
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(403).send({
          message: "something went wrong",
          success: false,
        });
      });
  }
});
// app.get("/groups/:Username") dynamic route
app.post("/task", function (req, res) {
  if (
    (req.headers.authorization == null,
    req.headers.authorization == "",
    req.headers.authorization == undefined)
  ) {
    return res.status(403).send({
      message: "unauthorised access",
      sucess: false,
    });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    try {
      let decodedToken = jwt.decode(token);
    } catch (err) {
      return res.status(403).send({
        message: "Invalid token",
      });
    }
    let id = Math.floor(Date.now() / 1000);
    // console.log(req.body);
    ToDoList.create({
      id: id,
      taskname: req.body.task,
      description: req.body.description,
      status: "pending",
      createddate: new Date().toISOString(),
    })
      .then((result) => {
        return res.status(200).send({
          message: "Task added successfully",
          success: true,
        });
      })
      .catch((err) => {
        return res.status(403).send({
          message: "Something went wrong",
          success: false,
        });
      });
  }
});
app.delete("/task", function (req, res) {
  if (
    req.headers.authorization == "" ||
    req.headers.authorization == undefined ||
    req.headers.authorization == null
  ) {
    return res.status(403).send({
      message: "unauthorised access",
      success: false,
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  try {
    let decodedToken = jwt.decode(token);
  } catch (err) {
    return res.status(403).send({
      message: "invalid token",
      success: false,
    });
  }
  ToDoList.destroy({
    where: {
      id: req.body.id,
    },
  })
    .then((result) => {
      if (result[0] == 0) {
        return res.status(200).send({
          message: "unable to delete",
        });
      }
      return res.status(200).send({
        message: "Task deleted successfully",
      });
    })
    .catch((err) => {
      return res.status(403).send({
        message: "something went wrong",
        success: false,
      });
    });
});
app.patch("/task", function (req, res) {
  if (
    req.headers.authorization == "" ||
    req.headers.authorization == null ||
    req.headers.authorization == undefined
  ) {
    return res.status(403).send({
      message: "Unauthorised access",
      success: false,
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  try {
    let decodedToken = jwt.decode(token);
  } catch (err) {
    return res.status(403).send({
      message: "Invalid token",
      success: false,
    });
  }
  ToDoList.update(
    {
      status: req.body.status,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  ).then((result)=>{
    if(
      result[0] == 0
    ){
      return res.status(403).send({
        message: "Couldn't update status",
        success: false
      })
    }
    return res.status(200).send({
      message: "Succesfully updated",
      sucess: true
    })
  }).catch((err)=>{
    return res.status(403).send({
      message: "Something went wrong",
      success: false
    })
  })
});

db.sync()
  .then((connection) => {
    console.log("Database connection established");
    app.listen(PORT, function () {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log("unable to connect database", err);
  });
