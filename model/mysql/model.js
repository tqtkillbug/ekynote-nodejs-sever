const sequelize = require("sequelize");

const Space  = sequelize.define('spaces', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
   },
   code:{
    type:sequelize.STRING,
    allowNull: false
   },
   name:{
    type:sequelize.STRING,
    allowNull : false
   },
   isDelete:{
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
   },
   keywords:{
    type: sequelize.STRING,
    allowNull : false
   },
   idOwner:{
    type: sequelize.STRING,
    allowNull: false
   }
}, {
    timestamps: true,
})

sequelize.sync().then(() => {
    console.log('Table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });

 