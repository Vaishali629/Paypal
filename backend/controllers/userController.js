const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword")
const generateAuthToken = require("../utils/generateAuthToken")

const getUsers = async (req, res, next) => {
    try {
        // Do not return password hashes to the client.
        const users = await User.find({}).select("-password");
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;

        if (!name || !lastName || !email || !password) {
            return res.status(400).send({ message: "Name, last name, email and password are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.exists({ email: normalizedEmail });
        if (userExists) {
            return res.status(409).json({ message: "User with that email already exists." });
        }
        const hashedPassword = hashPassword(password)
        const user = await User.create({
            name: name.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });
        const token = generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        return res.status(201).json({
            message: "User created successfully.",
            token,
            user: { id: user._id, name: user.name, lastName: user.lastName, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};
const loginUser = async (req, res, next) => {
    try {
         const { email, password, doNotLogout } = req.body
         if(!(email && password)) {
            return res.status(400).send("All inputs are required")
         }
         const user = await User.findOne({email})
         if(user && comparePasswords(password, user.password)) { 
            const token = generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin);
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }
            if(doNotLogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }
                // 1000=1ms
            }
            return res.cookie("access_token", token, cookieParams)
            .json({
                success: "user logged in",
                token,
                userLoggedIn: {_id: user._id, name: user.name, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, doNotLogout}
            });

         } else {
            return res.status(401).send("wrong credentials")
         }
    } catch(err) {
        next(err)
    }
}
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).orFail();
        user.name = req.body.name || user.name;
        user.lastName =req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.zipCode = req.body.zipCode;
        user.city = req.body.city;
        user.state = req.body.state;
        // Only change the password when the client supplies a new one.
        if (req.body.password) {
            user.password = hashPassword(req.body.password);
        }
        await user.save();
        res.json({
            success: "user updated",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch(err) {
        next(err);
    }
}
const getUserProfile = async (req, res, next) => {
    try {
         const user = await User.findById(req.params.id).orFail();
         return res.send(user);
    } catch(err){
        next(err)
    }
}
const writeReview = async(req, res, next) => {
    let session;
    try {
        session = await Review.startSession();
        // get comment, rating from request.body:
        const { comment, rating } = req.body;
        // validate request:
        if(!(comment && rating)) {
            return res.status(400).send("All inputs are required");
        }
        // create review id manully because it is needed also for saving in product collection
        const ObjectId = require("mongodb").ObjectId;
        let reviewId = ObjectId();

        session.startTransaction();
        await Review.create([
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName},
            }
        ],{ session: session })

        const product = await Product.findById(req.params.productId).populate("reviews").session(session);
        if (!product) {
            await session.abortTransaction();
            return res.status(404).send("Product not found");
        }
        const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            await session.abortTransaction();
            return res.status(400).send("product already reviewed");
        }
       // res.send(product)
       let prc = [...product.reviews];
       prc.push({ rating: rating });
       product.reviews.push(reviewId);
       if (product.reviews.length === 1) {
          product.rating = Number(rating);
          product.reviewsNumber = 1;
       } else {
          product.reviewsNumber = product.reviews.length;
          product.rating = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;

       }
       await product.save();
       await session.commitTransaction();
      session.endSession();
        res.send('review created')
    } catch (err) {
        if (session) {
            await session.abortTransaction();
        }
        next(err)
    } finally {
        if (session) {
            session.endSession();
        }
    }
}
const getUser = async (req, res, next) => {
    try {
         const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
         return res.send(user);
    }  catch (err) {
         next(err);
    }
}
const updateUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        user.name = req.body.name ?? user.name;
        user.lastName = req.body.lastName ?? user.lastName;
        user.email = req.body.email ?? user.email;
        user.isAdmin = req.body.isAdmin ?? user.isAdmin;

        await user.save();

        res.send("user updated");
    }  catch (err) {
        next(err);
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        await user.remove();
         res.send("user removed");
    } catch (err) {
        next(err);
    }
}
module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser };
