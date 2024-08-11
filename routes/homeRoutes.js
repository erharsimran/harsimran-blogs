const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
router.get('/', pageController.homePost);
router.get('/home', pageController.homePost);


module.exports = router;
