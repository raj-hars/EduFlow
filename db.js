const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Uses Cloudflare or Google DNS
const mongoose = require("mongoose");
const mongoURI = process.env.mongoURI; 

mongoose.connect(mongoURI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    AdminId: ObjectId,
});

const purchaseSchema = new mongoose.Schema({
    courseId: ObjectId,
    userId: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
};