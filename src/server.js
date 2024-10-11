// psql -U postgres
// CREATE DATABASE hh;
// npm i sequelize
// npm i sequelize-cli
// npm i pg
// yarn sequelize-cli init
const {Sequelize, where} = require("sequelize");
const express = require('express');
const PORT = 3456;
const app = express();
const cors = require("cors");
const path = require('path');
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const {User, Product, Order, Cart, ProductCart} = require('../models/index');


// Middleware для обработки CORS и префлайт запросов
app.use(cors({
    origin: 'http://localhost:3000', // Укажите источник вашего клиента
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Добавьте 'OPTIONS' для префлайт
}));

app.options('*', cors());
// app.use(cors());
app.use(express.json());
// app.set('view engine', 'hbs')
app.use(express.static('public'))

const sequelize = new Sequelize("market", "postgres", "21082001", {
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5432,
});

app.use(session({
    secret: "alisa",
    resave: false,
    saveUnititialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
    },
    store: new FileStore()
}))

// const isAuth = (req, res, next) => {
//     if (req.session.userid) {
//         next();
//     } else {
//         res.redirect("/login");
//     }
// }

sequelize.authenticate()
    .then(() => {
        console.log('Успешное подключение к базе данных');
    })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
    });

User.sync();
Order.sync();
Product.sync();



sequelize.sync()
    .then(() => {
        console.log('Модели синхронизированы с базой данных');
    })
    .catch(err => {
        console.error('Ошибка синхронизации моделей:', err);
    });

sequelize.getQueryInterface().showAllTables().then(tableNames => {
    console.log("Список таблиц в базе данных:", tableNames);
});


app.post("/signup", async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

app.post("/login", async (req, res) => {
    let user = await User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password,
        }
    });
    if (user) {
        req.session.userid = user.id;
        req.session.username = user.username;
        res.json(user);
    } else {
        res.status(403).json({message: "неверно"});
    }
});

app.get("/logout", async (req, res) => {
    req.session.destroy();
    res.status(200).json({message: "произведён выход"});
});


app.post("/products", async (req, res) => {
    const newProduct = await Product.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
    });
    res.json(newProduct);
})

app.put("/products/:id", async (req, res) => {
    const id = req.params.id;
    const newProduct = await Product.update(req.body, {where: {id}});
    res.json(newProduct);
})

app.get("/products", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
})

app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({where: {id}});
    res.json(product);
})




app.post("/my-orders", async (req, res) => {
    const newOrder = await Order.create({
        userId: req.body.userId,
        cart: req.body.cart,
    });
    res.json(newOrder);
})


app.get("/my-orders/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const userOrders = await Order.findAll({
            where: {userId: userId},
        });

        if (userOrders.length === 0) {
            return res.status(404).json({error: 'User has no orders'});
        }

        res.json(userOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
})
