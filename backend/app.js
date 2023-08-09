const express = require("express")
const app = express()
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json())
app.use(cookieParser())

//Routes Import
const product = require("./routes/productRoutes");
const user = require("./routes/userRoute");
app.use("/api/v1",product)
app.use("/api/v1",user)

//middleware for errors
app.use(errorMiddleware)

module.exports = app
