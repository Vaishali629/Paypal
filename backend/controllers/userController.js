const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;

        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ message: "Name, last name, email and password are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.exists({ email: normalizedEmail });
        if (userExists) {
            return res.status(409).json({ message: "User with that email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User created successfully.",
            user: { id: user._id, name: user.name, lastName: user.lastName, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser };
