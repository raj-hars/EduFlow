const express = require("express");
const userRouter = express.Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const JWT_USER_SECRET = process.env.JWT_USER_SECRET; 


userRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(4).max(30),
        firstName: z.string().max(100),
        lastName: z.string().max(100),
    });
 console.log(req.body);
    const parsedData = requiredBody.safeParse(req.body);
                  
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect format",
            error: parsedData.error,
        });

        return;
    }

    const {email, password, firstName, lastName} = parsedData.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.json({
            message: "Signup successful",
        })

    } catch (error) {
        console.log("Signup failed", error);
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_SECRET, {expiresIn: "7d"});

        res.json({token});
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

userRouter.get("/courses", userMiddleware, async (req, res) => {
    const userId = req.id;

    const courses = await purchaseModel.find({
        userId
    })

    res.json({
        courses
    });
});

module.exports = {userRouter};