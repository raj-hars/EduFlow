const {Router} = require("express");
const adminRouter = Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const {adminModel, courseModel} = require("../db");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

adminRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(4).max(30),
        firstName: z.string().max(100),
        lastName: z.string().max(100),
    });
 
    const parsedData = requiredBody.safeParse(req.body);

    if (!parsedData.success) {
        res.json({
            message: "Incorrect format",
            error: parsedData.error,
        });

        return;
    }

    const {email, password, firstName, lastName} = parsedData.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.json({
            message: "Signup successful",
        })

    } catch (error) {
        res.json({
            message: error
        });
    }
});

adminRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await adminModel.findOne({
        email
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
        const token = jwt.sign({
            id: user._id,
        }, JWT_ADMIN_SECRET, {expiresIn: "7d"});

        res.json({token});
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }    
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.id;

    const { title, description, price, imageUrl} = req.body;

    try {
        const course = await courseModel.create({
            title, description, price, imageUrl, adminId
        }); 

        res.json({
            message: "Course created",
            courseId: course._id,
        });
    } catch (err) {
        res.json({
            message: "Error creating course",
            error: err.message
        });
    }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
    const adminId = req.id;

    const { title, description, price, imageUrl, courseId} = req.body;

    try {
        const result = await courseModel.updateOne({
            courseId,
            adminId
        },
        {
            title, description, price, imageUrl
        }); 

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course updated",
            courseId,
        });
    } catch (err) {
        res.json({
            message: "Error editing course",
            error: err
        });
    }    
});

adminRouter.get("/course", adminMiddleware, async (req, res) => {
    const adminId = req.id;

    try {
        const courses = await courseModel.find({
            adminId
        }); 

        res.json({
            courses
        });
    } catch (err) {
        res.json({
            message: "Error getting courses",
            error: err
        });
    }    
});

module.exports = {adminRouter};