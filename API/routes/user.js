const express = require("express");
const passport = require("passport");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user");
const { validationHandler } = require("../utils/middleware/validationHandler");
const { createUserSchema } = require("../utils/schemas/user");
const dotenv = require("dotenv");
const user = require("../utils/schemas/user");
dotenv.config();
const { SECRET } = process.env;

//Strategies
require("../utils/strategies/basic");

function authApi(app) {
  const router = express.Router();
  app.use("/api/auth", router);
  const userService = new UserService();
  //Login
  router.post("/sign-in", async (req, res, next) => {
    passport.authenticate("basic", (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            next(error);
          }

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            admin: false,
          };

          const token = jwt.sign(payload, SECRET, {
            expiresIn: "1h",
          });

          return res.status(200).json({
            token,
            user: { id, name, email },
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });
  //Registro
  router.post(
    "/sign-up",
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;
      try {
        if (user.password !== user.passwordRepeat) {
          res.status(201).json({
            message: "Contraseñas no coinciden!",
          });
        } else {
          const createdUserId = await userService.createUser({ user });
          res.status(201).json({
            data: createdUserId,
            message: "User created!",
          });
        }
      } catch (error) {
        next(error);
      }
    }
  );
  //Todos los users
  router.get("/", async (req, res, next) => {
    const { tags } = req.query;
    const users = await userService.getUsers({ tags });
    delete users.admin;
    delete users.password;
    res.status(200).json({
      data: users,
      message: "List!",
    });
  });
}

module.exports = authApi;
