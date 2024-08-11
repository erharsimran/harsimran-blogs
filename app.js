const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./configs/database.js');

dotenv.config();
connectDB();
const port = process.env.PORT || 3000;
console.log("--------" + process.env.PORT);
app.use(session({
    secret: 'harsimran-session-secret',
    resave: false,
    saveUninitialized: false,
}));
// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// authMiddleware FOR AUTHORIZATION
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('http://localhost:' + port + '/user/login');
    }
    if (req.session && req.session.user) {
        app.locals.siteUrl = req.session.user.siteUrl;
        app.locals.user = req.session.user
    }
    next();
};

// Routes
const userRoutes = require('./routes/userRoutes');
const pageRoutes = require('./routes/pageRoutes');
const homeRoutes = require('./routes/homeRoutes');
app.use('/user', userRoutes);
app.use('/page', authMiddleware, pageRoutes);
app.use('/', authMiddleware, homeRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
