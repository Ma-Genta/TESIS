const MongoLib = require("../BD/mongo");
const bcrypt = require("bcrypt");
let date = new Date();
date.toString();
class UserService {
  constructor() {
    this.collection = "users";
    this.MongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.MongoDB.getAll(this.collection, { email });
    return user;
  }

  async getUsers({ email }) {
    const query = email && { email: { $in: email } };
    const [user] = await this.MongoDB.getAll(this.collection, query);
    return user;
  }

  async createUser({ user }) {
    const { name, email, tel, password } = user;
    const hashedPassword = await bcrypt.hash(password, 5);

    const createUserId = await this.MongoDB.create(this.collection, {
      name,
      email,
      tel,
      password: hashedPassword,
      admin: false,
      date,
    });

    return createUserId;
  }

  async getOrCreateUser({ user }) {
    const queriedUser = await this.getUser({ email: user.email });
    if (queriedUser) {
      return queriedUser;
    }
    await this.createUser({ user });
    return await this.getUser({ email: user.email });
  }
}

module.exports = UserService;
