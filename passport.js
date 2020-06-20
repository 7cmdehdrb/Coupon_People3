var GitHubStrategy = require("passport-github").Strategy;
import { userModel } from "./server/models/users";

export const githubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GIT_ID,
        clientSecret: process.env.GIT_SECRET,
        callbackURL: "http://localhost:3000/users/login/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
        const { username: email, displayName: nickname, photos: profileImage, provider: loginMethod } = profile;
        try {
            const query = userModel.findOne({
                email,
                loginMethod,
            });

            query.exec((err, data) => {
                if (err) {
                    console.log(err);
                    throw Error("Error on Github Login");
                }
                if (data == null) {
                    const user = userModel.create({
                        email,
                        nickname,
                        profileImage: profileImage[0].value,
                        isAdmin: false,
                        emailValid: true,
                        isActivated: true,
                        loginMethod,
                        money: 10000,
                    });
                    return cb(err, user);
                } else {
                    return cb(err, data);
                }
            });
        } catch (error) {
            console.log(error);
            return cb(err, null);
        }
    }
);
