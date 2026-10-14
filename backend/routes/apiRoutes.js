const express = require("express")
const app = express()
const productRoutes = require("./productRoutes")
const userRoutes = require("./userRoutes")
const categoryRoutes = require("./categoryRoutes")
const orderRoutes = require("./orderRoutes")

app.use("/products", productRoutes)
app.use("/users", userRoutes)
app.use("/categories", categoryRoutes)
app.use("/orders", orderRoutes)
module.exports = app
