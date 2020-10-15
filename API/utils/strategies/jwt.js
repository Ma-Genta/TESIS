const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');
const UserService = require('../../services/user');

const dotenv = require('dotenv');
dotenv.config();
const { SECRET } = process.env;

passport.use(
  new Strategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, cb) => {
      const userService = new UserService();
      try {
        const user = await userService.getUser({ email: tokenPayload.email });
        if (!user) {
          return cb(boom.unauthorized(), false);
        }
        delete user.password;
        cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        return cb(error);
      }
    }
  )
);