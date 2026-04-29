const express = require("express");
const { courseModel, userModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = express.Router();

courseRouter.get("/", async (req, res) => {
    const userId = req.id;

    const courses = await courseModel.find({});

    res.json({courses})
});

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
    const userId = req.id;
    const courseId = req.body.courseId;

    await userModel.updateOne(
        { _id: userId },
        {   // $addToSet: Only adds the ID if it doesn't already exist in the array (automatic uniqueness)
            $addToSet: { courses: courseId }
        }
    );

    res.json({
        message: "Course purchase successful"
    });
});

module.exports = { courseRouter };