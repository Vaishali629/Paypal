const connectDB = require("../config/db")
connectDB()
const categoryData = require("./categories")
const productData = require("./products")
const reviewData = require("./reviews")
const userData = require("./users")
const orderData = require("./orders")
const Category = require("../models/CategoryModel")
const Product = require("../models/ProductModel")
const Review = require("../models/ReviewModel")
const User = require("../models/UserModel")
const Order = require("../models/OrderModel")


const importData = async () => {
    try {
         await Category.collection.dropIndexes()
         await Product.collection.dropIndexes()
         await Review.collection.deleteMany({})
         await User.collection.deleteMany({})
         await Order.collection.deleteMany({})
         
        await Category.collection.deleteMany({})
        await Product.collection.deleteMany({})
        if (process.argv[2] !== "-d") {
        const reviews = await Review.insertMany(reviewData)
        const sampleProducts = productData.map((product) => ({
            ...product,
            // Some seed products do not declare `reviews`, so always create it.
            reviews: reviews.map((review) => review._id),
        }))

        await Category.insertMany(categoryData)
        await Product.insertMany(sampleProducts)
        await User.insertMany(userData)
        await Order.insertMany(orderData)
        console.log("Seeder data imported successfully")
        process.exit()
        return
     }
     console.log("Seeder data deleted successfully");
     process.exit();
    } catch (error) {
          console.error("Error while proccessing sender data", error)
          process.exit(1);
    }
}
importData()
