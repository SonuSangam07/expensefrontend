const express = require('express')

const bodyParser = require('body-parser');
const dotenv=require('dotenv')
dotenv.config();
const path = require('path');
const app = express()

const cors =  require('cors')

app.use(cors())

const sequelize = require('./util/database');

app.use(bodyParser.json());
//require("dotenv").config();

const User = require('./models/user')
const Order = require('./models/orders');
const Expense = require('./models/expense')

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

const userRoute = require('./routes/user')
const expenseRoute=require('./routes/expense')
const purchaseRoutes = require('./routes/purchase');
const { start } = require('pm2');
app.use('/purchase',purchaseRoutes)
app.use('/users',userRoute)
app.use('/expense',expenseRoute)
app.use((req,res)=>{
    console.log(req.url)
    res.sendFile(path.join(__dirname,`${req.url}`));
})
sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>console.log(err))