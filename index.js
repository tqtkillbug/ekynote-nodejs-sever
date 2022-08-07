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
const uploadRoute = require("./routes/upload");
const scheduledTask = require('./service/schedule-task');
const server = require("http").createServer(app);
server.listen(process.env.PORT || 8000);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
    }
  });
  io.on("connection",(socket)=>{
    // console.log("Socket connected");    
  })
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("common"));
app.use(cookiePaser());

const corsOptions = {
    origin:'*', 
    credentials:true,          
    optionSuccessStatus:200,
 
};
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
dotenv.config();

app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/auth",authRoute);

app.use("/api/upload",uploadRoute);

scheduledTask.initScheduledJobs();



mongoose.connect((process.env.mongodb_url), () => {
    console.log("Connected mongobd");
})


// app.listen(process.env.PORT || 8000);