const Sequelize = require("sequelize");
const db= require("../dbconfig");

const ToDoList = db.define("todolist",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false
    },
    taskname:{
        type: Sequelize.STRING,
        allowNull:false
    },
    status:{
        type: Sequelize.STRING,
        allowNull:false

    },
    createddate:{
        type:Sequelize.DATE,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    
},
{
    timestamp: false
    
}
);
module.exports = ToDoList;

