const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ObjectId = require("mongodb").ObjectId;
const getUserOrders = async (req, res, next) => {
    try {
      const query = req.user.isAdmin ? {} : { user: ObjectId(req.user._id) };
      const orders = await Order.find(query);
      res.send(orders);
    } catch (error) {
        next(error)
    }
}
const getOrder = async (req, res, next) => {
    try {
       const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -_id -_v -createdAt -updatedAt").orFail();
       res.send(order);
    } catch (err) {

    }
}
const createOrder = async ( req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!cartItems || !orderTotal || !paymentMethod) {
            return res.status(400).send("All inputs are required");
        }
        let ids = cartItems.map((item) => {
            return item.productID;
        })
        let qty = cartItems.map((item) => {
            return Number(item.quantity);
        })
        await Product.find({_id: { $in: ids }}).then((products) => {
            products.forEach(function (product, idx) {
                product.sales += qty[idx];
                product.save();
            })
        })
        const order = new Order({
            user: ObjectId(req.user._id),
            orderTotal: orderTotal,
            cartItems: cartItems,
            paymentMethod: paymentMethod,
        })
        const createOrder = await order.save();
        res.status(201).send(createOrder);
    } catch (err) {
        next(err)
    }
}
const updateOrderToPaid = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Invalid order ID");
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { isPaid: true, paidAt: new Date() } },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.send(order);
    } catch (err) {
        next (err);
    }
}
const updateOrderToDelivered = async (req, res, next) => {
    try {
         if (!ObjectId.isValid(req.params.id)) {
             return res.status(400).send("Invalid order ID");
         }

         const order = await Order.findByIdAndUpdate(
             req.params.id,
             { $set: { isDelivered: true, deliveredAt: new Date() } },
             { new: true, runValidators: true }
         );
         if (!order) {
             return res.status(404).send("Order not found");
         }

         res.send(order);
    } catch (err) {
       next(err);
    }
}
const getOrders = async (req, res, next) => {
    try {
        const orders = (await Order.find({}).populate("user", "-password")).toSorted({
            paymentMethod: "desc" });
            res.send(orders);

    } catch (err) {
        next(err)
    }
}
const getOrderForAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(0,0,0,0);
        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);
        const order = await Order.find({
            createdAt: {
                $gte: start,
                $lte: end,
            }
        }).sort({ createdAt: "asc" });
        res.send(order);
    } catch (err) {
        next(err)
    }
}
module.exports = {getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDelivered, getOrders, getOrderForAnalysis}