const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookiePaser = require('cookie-parser');
const userRoute = require("./routes/user");
const keywordRoute = require("./routes/keyword");
const authRoute = require("./routes/auth");
const viewRoute = require("./routes/view");
// const passport = require('passport');
const spaceRoute = require("./routes/space");

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const Sequelize = require("sequelize");

// require('./securitys/passport')(passport)
const uploadRoute = require("./routes/upload");
const scheduledTask = require('./service/common/schedule-task');

const server = require("http").createServer(app);
server.listen(process.env.PORT || 3000);
// const io = require('socket.io')(server, {
//     cors: {
//       origin: 'http://localhost:3000',
//     }
//   });
//   io.on("connection",(socket)=>{
//     // console.log("Socket connected");    
//   })
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("common"));
app.use(cookiePaser());
app.set("views","views");
app.set("view engine","ejs");
app.use(express.static("public"));
dotenv.config();
// Config DB


// const sequelize = new Sequelize(
//    'etanotestaging',
//    'root',
//    '01470258tqt',
//     {
//       host: '127.0.0.1',
//       dialect: 'mysql'
//     }
//   );

// sequelize.authenticate().then(() => {
//   console.log("<---------------------------------------Connected MYSQL DB------------------------------>");
// }).catch((error) => {
//    console.error('Unable to connect to the database: ', error);
// });

mongoose.connect(process.env.mongodb_url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
}, () => {
  console.log("<---------------------------------------Connected Mongo DB------------------------------>");
})



dotenv.config();

app.use(
    session({
      secret: 'Eta_note',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )


// app.use(passport.initialize())
// app.use(passport.session())


app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/space", spaceRoute)

app.use("/api/auth",authRoute);

app.use("/",viewRoute);

app.use('/auth', require('./routes/auths'))

app.use("/api/upload",uploadRoute);


scheduledTask.initScheduledJobs();




