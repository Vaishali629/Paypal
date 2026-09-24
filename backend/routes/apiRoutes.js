const express = require("express")
const app = express()
const productRoutes = require("./productRoutes")
const userRoutes = require("./userRoutes")

app.use("/products", productRoutes)
app.use("/users", userRoutes)

module.exports = app
