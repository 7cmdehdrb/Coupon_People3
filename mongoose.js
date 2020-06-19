const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/coupon_people", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("MongoDB Connect!");
});
