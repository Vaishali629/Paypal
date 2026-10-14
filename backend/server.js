const express = require('express')
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const app = express()
const port = process.env.PORT || 5000

const apiRoutes = require("./routes/apiRoutes")
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.get('/', async (req, res, next) => {
    
    res.json({message: "API running..."})
});

// MongoDB connection
const connectDB = require("./config/db");

app.get('/a', (req,res,next) => {
    setTimeout(() => {
        try {
            console.log("asynchronouse code");
        } catch(er) {
            next(er);
        }
    }, 1000)
    //next(new Error("some error occured"));
   // res.send("Hello World!")
})

app.use('/api', apiRoutes)

 app.use((error, req, res, next) => {
       if (process.env.NODE_ENV === "development") { 
    console.error(error);
   }
    next(error)
})
 
app.use((error, req, res, next) => {
      if (process.env.NODE_ENV === "development") {
        res.status(500).json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    })
  } else {
      res.status(500).json ({
        message: error.message,
      })
  }
})
 

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`API listening on port ${port}`);
    });
};

startServer();
