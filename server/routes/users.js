var express = require("express");
var router = express.Router();
import passport from "passport";
import { userModel } from "../models/users";
import session from "express-session";

/* GET users listing. */
router.get("/", function (req, res, next) {
    next(createError(404));
});

router.get("/login", (req, res, next) => {
    const { session } = req;

    if (session.passport) {
        res.redirect("/");
    } else {
        const data = {
            kakaoAPI: process.env.KAKAO_API,
        };
        res.render("users/login", { session: session, data: data });
    }
});

router.post("/login/kakao", (req, res, next) => {
    const { session } = req;

    const { kakao_email, kakao_username, kakao_userImage } = req.body;

    if (!session.passport) {
        try {
            const query = userModel.findOne({
                email: kakao_email,
                loginMethod: "kakao",
            });

            query.exec((err, data) => {
                if (err) {
                    console.log(err);
                    next(createError(404));
                    return;
                }
                if (data == null) {
                    userModel
                        .create({
                            email: kakao_email,
                            nickname: kakao_username,
                            profileImage: kakao_userImage,
                            isAdmin: false,
                            emailValid: true,
                            isActivated: true,
                            loginMethod: "kakao",
                            money: 10000,
                        })
                        .then((user) => {
                            const result = {
                                user: user,
                            };
                            session.passport = result;
                            session.save(() => {
                                res.redirect("/");
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            next(createError(404));
                            return;
                        });
                } else {
                    const result = {
                        user: data,
                    };
                    session.passport = result;
                    session.save(() => {
                        res.redirect("/");
                    });
                }
            });
        } catch (error) {
            console.log(error);
            next(createError(404));
            return;
        }
    } else {
        // 로그인 되어 있는 상태
        res.redirect("/users/logout");
    }
});

router.get("/login/github", passport.authenticate("github"));

router.get("/login/github/callback", passport.authenticate("github", { failureRedirect: "/users/login" }), (req, res, next) => {
    res.redirect("/");
});

router.get("/logout", (req, res, next) => {
    const { session } = req;

    session.passport = null;
    session.save(() => {
        res.redirect("/");
    });
});

module.exports = router;
