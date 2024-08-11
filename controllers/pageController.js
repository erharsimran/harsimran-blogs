const Post = require('../models/pageModel');
exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find({}, { title: 1, author: 1, createdAt: 1 }).exec();
        console.log(allPosts);
        res.render('page/manage', {
            allPosts,
            user: req.session.user,
            msg: req.query.msg || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
    }
};
exports.createPost = async (req, res) => {
    try {
        const { id } = req.query;
        const allPosts = await Post.find({}, 'title').exec();
        const page = await Post.findById(id).exec() || false;
        res.render('page/create', { allPosts: allPosts, page: page });
    } catch (error) {
        res.redirect('/page/all?error=Something went wrong');
    }
};
exports.createPostPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const existingPost = await Post.findOne({ title });
        if (existingPost) {
            return res.redirect('/page/all?error=Title already exists');
        }
        const page = new Post({ title: title.trim(), content, author: req.session.user.name });
        await page.save();
        res.redirect('/page/all?msg=Post Created Successfully');
    } catch (err) {
        res.redirect('/page/all?error=Something went wrong');
    }
};

exports.updatePostPost = async (req, res) => {
    try {
        const pageId = req.params.id;
        const { title, content } = req.body;
        const existingPost = await Post.findOne({ title, _id: { $ne: pageId } });
        if (existingPost) {
            return res.redirect('/page/all?error=Title already exists');
        }
        const updatedPost = await Post.findByIdAndUpdate(pageId, { title: title.trim(), content }, { new: true });
        if (!updatedPost) {
            res.render('page/create', {
                msg: 'Post not found'
            });
        } else {
            res.redirect('/page/all?msg=Post Updated Successfully');
        }
    } catch (error) {
        res.redirect('/page/all?error=Something went wrong');
    }
};


exports.deletePost = async (req, res) => {
    const { id } = req.query;
    const userId = req.session.user.id;
    try {
        const deletedPost = await Post.findOneAndDelete(id).exec();
        res.redirect('/page/all?msg=Post Deleted Successfully');
    } catch (err) {
        res.redirect('/page/all?error=Something went wrong');
    }
};

exports.homePost = async (req, res) => {
    try {
        const { title } = req.query;
        const allPosts = await Post.find({}, 'title').exec();
        const page = await Post.findOne({ title }).exec() ?? {};
        res.render('home', { allPosts, page: page });
    } catch (error) {
        console.error(error);
        res.redirect('/page/all?error=Something went wrong');
    }
};
