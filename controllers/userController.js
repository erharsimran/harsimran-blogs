const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    let errors = {};
    res.render('user/register', { errors });

};
exports.login = (req, res) => {
    let errors = {};
    res.render('user/login', { errors });
};
exports.registerUser = async (req, res) => {
    console.log('register', req.body);
    const { name, email, password, cpassword } = req.body;
    let errors = {};
    const alphabetPattern = /^[A-Za-z\s]+$/;

    if (!name) {
        errors.name = "Name is required.";
    } else if (!alphabetPattern.test(name)) {
        errors.name = "Name should contain only alphabets.";
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        errors.email = "Invalid email format.";
    }

    if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    if (password !== cpassword) {
        errors.cpassword = "Passwords do not match";
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            errors.userExists = "User already exists";
        }
        if (Object.keys(errors).length > 0) {
            res.render('user/register', { errors });
        } else {
            const user = new User({ name, email, password });
            await user.save();
            console.log('User saved:', user);
            res.render('user/login', {
                msg: "User created successfully, Log in now!"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    let errors = {};
    try {
        const user = await User.findOne({ email });
        if (!user) {
            errors.error = "User not found";
            res.render('user/login', { errors });
        } else {
            const isMatch = await user.matchPassword(password.trim());
            if (!isMatch) {
                errors.error = "Invalid password";
                res.render('user/login', { errors });
            } else {
                req.session.user = {
                    name: user.name,
                    email: user.email,
                    isAdminUser: email.trim() === 'admin@gmail.com',
                    siteUrl: 'http://localhost:' + process.env.PORT
                };
                res.redirect('/');
            }
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};


exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
