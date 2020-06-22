var express = require("express");
var router = express.Router();
import passport from "passport";
import { userModel } from "../models/users";
import { upload } from "../../multer";
import { hashFuction, createUUID, sendMail, sendResetMail } from "../../utils";
import createHttpError from "http-errors";

/* GET users listing. */
router.get("/", async (req, res, next) => {
    // await userModel.deleteMany({
    //     isAdmin: false,
    // });

    userModel
        .find()
        .exec()
        .then((users) => {
            console.log(users.length);
            users.forEach((element) => {
                console.log(element);
            });
        });

    next(createHttpError(200));
});

router.get("/login", (req, res, next) => {
    const { session } = req;

    // if logged in, redirect

    if (session.passport) {
        res.redirect("/");
    } else {
        const data = {
            kakaoAPI: process.env.KAKAO_API,
        };
        res.render("users/login", { session: session, data: data });
    }
});

router.post("/login", async (req, res, next) => {
    const { session } = req;
    const { userId, userPw } = req.body;

    const existUser = await userModel
        .findOne({
            $and: [
                {
                    email: userId,
                },
                {
                    password: hashFuction(userPw),
                },
                {
                    loginMethod: "local",
                },
                {
                    isAdmin: false,
                },
            ],
        })
        .exec();

    if (existUser === null) {
        res.send(`
        <script>
            alert(\"비밀번호가 다르거나, 계정이 존재하지 않습니다\");
            location.href = \"/users/login\";
        </script>
        `);
    } else if (existUser.loginMethod == "local") {
        session.passport = {
            user: data,
        };
        session.save(() => {
            res.redirect("/");
        });
    } else {
        console.log(existUser);
        next(createHttpError(200));
    }
});

router.get("/signup", (req, res, next) => {
    const { session } = req;

    // if logged in, redirect

    if (session.passport) {
        res.redirect("/");
    } else {
        res.render("users/signup", { session: session });
    }
});

router.post("/signup", upload.single("profileImage"), (req, res, next) => {
    const { originalname: profileImage } = req.file;

    const {
        body: { email, nickname, password, interest1, interest2, interest3, interest4, interest5, interest6 },
    } = req;

    const interests = [interest1, interest2, interest3, interest4, interest5, interest6].filter((interest) => interest !== undefined);

    const existUser = userModel.findOne({ email: email }).exec();

    if (existUser === null) {
        userModel
            .create({
                email,
                nickname,
                profileImage,
                password: hashFuction(password),
                isAdmin: false,
                isActivated: true,
                emailSecret: createUUID(),
                emailValid: false,
                interests: interests,
                loginMethod: "local",
                money: 10000,
            })
            .then((self) => {
                sendMail(self.email, self.emailSecret);
                res.send(`
                    <script>
                        alert(\"Successfully signed up!\nPlease check your email to verify your email\");
                        location.href = \"/\";
                    </script>
                `);
            })
            .catch((err) => {
                console.log(err);
                next(createHttpError(200));
            });
    } else if (existUser.loginMethod != "local") {
        res.send(`
            <script>
                alert(\"This email is already signed up with ${existUser.loginMethod}\");
                location.href = \"/users/login\";
            </script>
                `);
    } else {
        res.send(`
            <script>
                alert(\"This email is already signed up!\");
                location.href = \"/users/login\";
            </script>
    `);
    }
});

router.get("/verifyemail", (req, res, next) => {
    const {
        query: { key },
    } = req;

    console.log(key);

    if (key === null || key == "") {
        next(createHttpError(200));
        return;
    }

    userModel
        .findOneAndUpdate(
            {
                emailSecret: key,
            },
            {
                $set: {
                    emailValid: true,
                    emailSecret: null,
                },
            }
        )
        .then((user) => {
            if (user === null) {
                res.send(`
                    <script>
                        alert(\"CAN NOT FIND USER\");
                    </script>
                `);
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

router.get("/emailCheck", (req, res, next) => {
    const {
        query: { id },
    } = req;

    const emailValid = userModel
        .find({
            email: id,
        })
        .count()
        .exec();

    res.json({
        result: emailValid,
    });
});

router.post("/login/kakao", (req, res, next) => {
    const { session } = req;

    const { kakao_email, kakao_username, kakao_userImage } = req.body;

    // if not logged in, redirect

    if (session.passport) {
        res.redirect("/users/logout");
    } else {
        const existUser = userModel
            .findOne({
                email: kakao_email,
            })
            .exec();

        if (existUser === null) {
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
                    session = {
                        passport: user,
                    };
                    session.save(() => {
                        res.redirect("/");
                    });
                })
                .catch((err) => {
                    console.log(err);
                    next(createHttpError(200));
                });
        } else if (existUser.loginMethod == "kakao") {
            session = {
                passport: existUser,
            };
            session.save(() => {
                res.redirect("/");
            });
        } else {
            next(createHttpError(200));
        }
    }
});

router.get("/login/github", passport.authenticate("github"));

router.get("/login/github/callback", passport.authenticate("github", { failureRedirect: "/users/login" }), (req, res, next) => {
    res.redirect("/");
});

router.get("/login/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/login/google/callback", passport.authenticate("google", { failureRedirect: "/users/login" }), function (req, res) {
    res.redirect("/");
});

router.get("/logout", (req, res, next) => {
    const { session } = req;

    session.passport = null;
    session.save(() => {
        res.redirect("/");
    });
});

router.get("/findpw", (req, res, next) => {
    const { session } = req;

    if (session.passport) {
        res.redirect("/");
    } else {
        res.render("users/findpw", { session: session });
    }
});

router.post("/findpw", (req, res, next) => {
    const {
        body: { email },
    } = req;

    const uuid = createUUID();

    userModel
        .findOneAndUpdate(
            {
                $and: [
                    {
                        email: email,
                    },
                    {
                        emailValid: true,
                    },
                    {
                        loginMethod: "local",
                    },
                ],
            },
            {
                $set: {
                    emailSecret: uuid,
                },
            }
        )
        .then((user) => {
            if (user === null) {
                res.send(`
                    <script>
                        alert(\"CAN NOT FIND USER\");
                    </script>
                `);
            } else {
                sendResetMail(email, uuid);
                res.send(`
                    <script>
                        alert(\"Please check your email!\");
                        location.href = \"/\";
                    </script>
                `);
            }
        })
        .catch((err) => {
            console.log(err);
            next(createHttpError(200));
        });
});

router.get("/resetPassword", (req, res, next) => {
    const {
        query: { key },
    } = req;

    if (key === null || key == "") {
        next(createHttpError(200));
        return;
    }

    userModel
        .findOneAndUpdate(
            {
                $and: [
                    {
                        emailSecret: key,
                    },
                    {
                        emailValid: true,
                    },
                ],
            },
            {
                $set: {
                    emailSecret: null,
                    password: hashFuction("0000"),
                },
            }
        )
        .then((user) => {
            if (user === null) {
                res.send(`
                    <script>
                        alert(\"CAN NOT FIND USER\");
                    </script>
                `);
            } else {
                res.send(`
                    <script>
                        alert(\"Your password is reseted in 0000\");
                        location.href = \"/\";
                    </script>
                `);
            }
        })
        .catch((err) => {
            console.log(err);
            next(createHttpError(200));
        });
});

module.exports = router;
