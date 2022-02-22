const express = require('express');
const controller = require('../controllers/postController');
const protect = require('../middleware/auth');
const route = express.Router();
route
  .route('/')
  .get(protect, controller.getAllPosts)
  .post(protect, controller.createPost);
route
  .route('/:id')
  .get(protect, controller.getOnePost)
  .delete(protect, controller.deletePost)
  .patch(protect, controller.updatePost);
module.exports = route;
