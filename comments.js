// create web server
// npm install express
// npm install body-parser
// npm install nodemon
// npm install mongoose
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

// create a new schema
const Comment = mongoose.model("Comment", {
  username: String,
  content: String,
  timestamp: Number
});

// create a new comment
app.post("/comments", async (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    content: req.body.content,
    timestamp: new Date().getTime()
  });
  await comment.save();
  res.send(comment);
});

// get all comments
app.get("/comments", async (req, res) => {
  const comments = await Comment.find();
  res.send(comments);
});

// get specific comment
app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    res.send(comment);
  } catch (error) {
    res.status(404).send({ error: "Comment doesn't exist!" });
  }
});

// delete specific comment
app.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(404).send({ error: "Comment doesn't exist!" });
  }
});

// update specific comment
app.put("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    comment.content = req.body.content;
    await comment.save();
    res.send(comment);
  } catch (error) {
    res.status(404).send({ error: "Comment doesn't exist!" });
  }
});

// connect to the database
const connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/comments", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connected to database!");
  app.listen(4001, () => {
    console.log("API started!");
  });
};

connect();