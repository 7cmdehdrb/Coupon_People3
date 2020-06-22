var express = require("express");
var router = express.Router();
import { userModel, interestModel } from "../models/users";
import { couponModel } from "../models/coupons";
import { tradeModel } from "../models/trades";

/* GET home page. */
router.get("/", async (req, res, next) => {
    const { session } = req;

    // console.log(session);

    const userQuery = await userModel.find().count().exec();
    const couponQuery = await couponModel.find().count().exec();
    const tradeQuery = await tradeModel.find().count().exec();

    res.render("core/index", {
        session: session,
        data: {
            userCnt: userQuery,
            couponCnt: couponQuery,
            tradeCnt: tradeQuery,
        },
    });
});

module.exports = router;
