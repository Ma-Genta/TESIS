const MongoLib = require("../BD/mongo");

class PostService {
  constructor() {
    this.collection = "posts";
    this.mongoDB = new MongoLib();
  }

  async getPosts({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const posts = await this.mongoDB.getAll(this.collection, query);
    return posts || [];
  }

  async getPost({ postId }) {
    const post = await this.mongoDB.get(this.collection, postId);
    return post || {};
  }

  async createPost(post) {
    const createdPost = await this.mongoDB.create(this.collection, post);
    return createdPost;
  }

  async updatePost({ postId, post }) {
    const updatedPost = await this.mongoDB.update(
      this.collection,
      postId,
      post
    );
    return updatedPost;
  }

  async deletePost({ postId }) {
    const deletedPost = await this.mongoDB.delete(this.collection, postId);
    return deletedPost;
  }
}

module.exports = PostService;
