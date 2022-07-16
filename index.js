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
const passport = require('passport');

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

require('./securitys/passport')(passport)

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("common"));
app.use(cookiePaser());
app.set("views","views");
app.set("view engine","ejs");
app.use(express.static("public"));
dotenv.config();
// Config DB


mongoose.connect(process.env.mongodb_url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
}, () => {
  console.log("Connected Mongo DB------------------------------>");
})

dotenv.config();
// Config DB

app.use(
    session({
      secret: 'Eky Note',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )


app.use(passport.initialize())
app.use(passport.session())


app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/auth",authRoute);

app.use("/",viewRoute);

app.use('/auth', require('./routes/auths'))



app.listen(process.env.PORT || 8000);