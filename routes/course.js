const express = require("express");
const { courseModel, purchaseModel } = require("../db");
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

    await purchaseModel.create({
        userId,
        courseId,
    });

    res.json({
        message: "Course purchase successful"
    });
});

module.exports = { courseRouter };