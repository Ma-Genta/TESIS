const path = require("path");
const express = require("express");
const PostService = require("../services/post");

const multer = require("multer");
let date = new Date();
let formatted_date =
  date.getDate() +
  "-" +
  (date.getMonth() + 1) +
  "-" +
  date.getFullYear() +
  date.getTime();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${formatted_date}` + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

function postApi(app) {
  const router = express.Router();
  app.use("/api/posts", router);
  const postService = new PostService();
  //Listar todas los post
  router.get("/", async (req, res, next) => {
    const { tags } = req.query;
    try {
      const posts = await postService.getPosts({ tags });
      res.status(200).json({
        data: posts,
        message: "Post listed!",
      });
    } catch (error) {
      next(error);
    }
  });
  //Listar un post
  router.get("/:postId", async (req, res, next) => {
    const { postId } = req.params;
    try {
      const post = await postService.getPost({ postId });
      res.status(200).json({
        data: post,
        message: "Post!",
      });
    } catch (error) {
      next(error);
    }
  });
  //Crear un post
  router.post("/", upload.single("file"), async (req, res, next) => {
    const { body, file } = req;
    let pathFile;
    if (!req.file) {
      pathFile = "";
    } else {
      pathFile = file.path;
    }
    const post = {
      ...body,
      pathFile,
    };
    try {
      const createPost = await postService.createPost(post);
      res.status(201).json({
        data: createPost,
        message: "Created !",
      });
    } catch (error) {
      next(error);
    }
  });
  //Actualizar un post
  router.put("/:postId", async (req, res, next) => {
    const { body: post } = req;
    const { postId } = req.params;
    try {
      const updatePostId = await postService.updatePost({ postId, post });
      res.status(200).json({
        data: updatePostId,
        message: "Post update!",
      });
    } catch (error) {
      next(error);
    }
  });
  //Borrar un post
  router.delete("/:postId", async (req, res, next) => {
    const { postId } = req.params;
    try {
      const deletedPost = await postService.deletePost({ postId });
      res.status(200).json({
        data: deletedPost,
        message: "Post delete!",
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = postApi;
