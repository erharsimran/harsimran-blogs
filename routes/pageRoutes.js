const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
router.get('/all', pageController.getAllPosts);
router.get('/create', pageController.createPost);
router.post('/create', pageController.createPostPost);
router.post('/update/:id', pageController.updatePostPost);
router.get('/delete', pageController.deletePost);

module.exports = router;
