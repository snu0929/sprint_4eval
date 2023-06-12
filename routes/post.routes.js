const express = require("express");
const { PostModel } = require("../models/post.model");
const { auth } = require("../middleware/auth.middleware");

const postRouter = express.Router();

postRouter.use(auth);

postRouter.post("/add", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).json({ msg: "New Note has beed added", post: req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const minComments = req.query.min_comments;
    const maxComments = req.query.max_comments;
    const filters = {};
    if (userId) {
      filters.userID = userId;
    }

    if (minComments && maxComments) {
      filters.no_of_comments = { $gte: minComments, $lte: maxComments };
    } else if (minComments) {
      filters.no_of_comments = { $gte: minComments };
    } else if (maxComments) {
      filters.no_of_comments = { $lte: maxComments };
    }
    const posts = await PostModel.find({ userID: req.body.userID });
    res.send(posts);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

postRouter.patch("/update/:postID", async (req, res) => {
  //userId in the user doc===userID is the post doc
  const userIDinUserDoc = req.body.userID;
  const { postID } = req.params;
  try {
    const post = await PostModel.findOne({ _id: postID });
    const userIDinNoteDoc = post.userID;
    if (userIDinUserDoc === userIDinNoteDoc) {
      //update
      await NoteModel.findByIdAndUpdate({ _id: postID }, req.body);
      res.status(200).json({ msg: `${post.title} is updated` });
    } else {
      res.status(200).json({ msg: "Not authorized" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

postRouter.delete("/delete/:postID", async (req, res) => {
  const userIDinUserDoc = req.body.userID;
  const { postID } = req.params;
  try {
    const post = await PostModel.findOne({ _id: postID });
    const userIDinNoteDoc = post.userID;
    if (userIDinUserDoc === userIDinNoteDoc) {
      //update
      await NoteModel.findByIdAndDelete({ _id: postID });
      res.status(200).json({ msg: `${post.title} is been deleted` });
    } else {
      res.status(200).json({ msg: "Not authorized" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = {
  postRouter,
};
