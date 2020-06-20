const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");

const indexRouter = require("./server/routes/index");
const usersRouter = require("./server/routes/users");

import passport from "passport";

import "./dotenv";
import "./mongoose";
import "./middleware";
import { githubStrategy } from "./passport";

passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => {
    // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(githubStrategy);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "server/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 24000 * 60 * 60, // 쿠키 유효기간 24시간
        },
    })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error/error");
});

app.set("port", process.env.PORT || process.env.PORT);
const server = app.listen(app.get("port"), function () {
    console.log(`SERVER START WITH http://localhost:${server.address().port}/`);
});

module.exports = app;
