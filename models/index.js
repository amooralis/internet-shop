// psql -U postgres
// CREATE DATABASE hh;
// npm i sequelize
// npm i sequelize-cli
// npm i pg
// # yarn sequelize-cli init

const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("market", "postgres", "21082001", {
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5432,
});

const User = sequelize.define(
    "User",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


const Product = sequelize.define(
    "Product",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        cartId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

const Cart = sequelize.define(
    "Cart",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        products: {
            type: Sequelize.ARRAY(Sequelize.JSON),
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


const ProductCart = sequelize.define(
    "ProductCart",
    {
        cartId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Product.belongsToMany(Cart, { through: ProductCart, as: 'Carts' });
Cart.belongsToMany(Product, { through: ProductCart, as: 'Products' });

User.hasMany(Order, { foreignKey: 'userId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Связь Cart и Order (один к одному):
Cart.hasOne(Order, { foreignKey: 'cartId', as: 'order' });
Order.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Product,
    Order,
    Cart,
    ProductCart,
};

