var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
import { userModel } from "./server/models/users";

export const githubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GIT_ID,
        clientSecret: process.env.GIT_SECRET,
        callbackURL: "http://localhost:3000/users/login/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
        const { username: email, displayName: nickname, photos: profileImage, provider: loginMethod } = profile;

        const existUser = userModel.findOne({ email });

        existUser.exec((err, data) => {
            if (err) return err, null;

            if (data === null) {
                userModel
                    .create({
                        email,
                        nickname,
                        profileImage: profileImage[0].value,
                        isAdmin: false,
                        emailValid: true,
                        isActivated: true,
                        loginMethod,
                        money: 10000,
                    })
                    .then((user) => {
                        return cb(null, user);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (data.loginMethod == "github") {
                return cb(null, data);
            } else {
                return cb(null, null);
            }
        });
    }
);

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/users/login/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
        const { id: email, displayName: nickname, photos: profileImage, provider: loginMethod } = profile;

        const existUser = userModel.findOne({ email });

        existUser.exec((err, data) => {
            if (err) return err, null;

            if (data === null) {
                userModel
                    .create({
                        email,
                        nickname,
                        profileImage: profileImage[0].value,
                        isAdmin: false,
                        emailValid: true,
                        isActivated: true,
                        loginMethod,
                        money: 10000,
                    })
                    .then((user) => {
                        return cb(err, user);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (data.loginMethod == "google") {
                return cb(err, data);
            } else {
                return cb(err, null);
            }
        });
    }
);
