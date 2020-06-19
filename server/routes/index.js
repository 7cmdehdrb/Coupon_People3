var express = require("express");
var router = express.Router();
import { userModel } from "../models/users";
import { couponModel } from "../models/coupons";
import { tradeModel } from "../models/trades";

/* GET home page. */
router.get("/", async (req, res, next) => {
    const session = req.session;

    const userQuery = userModel.find().count();
    const couponQuery = couponModel.find().count();
    const tradeQuery = tradeModel.find().count();

    let userCnt = 0;
    let couponCnt = 0;
    let tradeCnt = 0;

    try {
        await userQuery.exec((err, data) => {
            if (err) {
                console.log("ERROR ON INDEX");
                console.log(err);
            }

            userCnt = data;
        });

        await couponQuery.exec((err, data) => {
            if (err) {
                console.log("ERROR ON INDEX");
                console.log(err);
            }

            couponCnt = data;
        });

        await tradeQuery.exec((err, data) => {
            if (err) {
                console.log("ERROR ON INDEX");
                console.log(err);
            }

            tradeCnt = data;
        });
    } catch (error) {
        console.log(error);
        next(createError(404));
    }

    res.render("core/index", {
        session: session,
        data: {
            userCnt,
            couponCnt,
            tradeCnt,
        },
    });
});

module.exports = router;
