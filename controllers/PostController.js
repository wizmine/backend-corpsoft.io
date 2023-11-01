import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: "user" }).exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve post",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findByIdAndDelete({
      _id: postId,
    });

    if (!doc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to remove post",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await UserModel.findById(req.userId);

    const newComment = {
      text: req.body.text,
      user: user,
    };

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};
