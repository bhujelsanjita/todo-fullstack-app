const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const dbhost = process.env.DBHOST;
const dbname = process.env.DBNAME;
const dbpassword = process.env.DBPASSWORD;
const dbusername = process.env.DBUSERNAME;
const db = new Sequelize(dbname,dbusername,dbpassword,{
    host:dbhost,
    dialect:"mysql"
});

module.exports = db;