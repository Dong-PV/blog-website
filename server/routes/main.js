/* /server/routes/main.js */
const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
/* GET home */
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Home Page",
      description: "Simple Blog created with NodeJS, Express & MongoDB."
    }
    let posts_per_page = 10
    let current_page = req.query.page || 1
    const data = await Post
      .aggregate([{ $sort: { date_created: -1 } }])
      .skip(posts_per_page * current_page - posts_per_page)
      .limit(posts_per_page)
      .exec()
    const count = await Post.countDocuments();
    const next_page = parseInt(current_page) + 1
    const has_next_page = next_page <= Math.ceil(count / posts_per_page)
    res.render('index.ejs', { // ./views/index.ejs
      locals,
      data,
      current: current_page,
      next_page: has_next_page ? next_page : null,
    })
  }
  catch (e) { console.log(e) }
})
/* GET post id */
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id
    const data = await Post.findById({ _id: slug })
    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJS, Express & MongoDB",
    }
    res.render('post', {
      locals,
      data
    })
  }
  catch (e) { console.log(e) }
})
/* POST search term */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJS, Express & MongoDB"
    }
    let search_term = req.body.search_term
    const search_no_special_char = search_term.replace(/[^\w\s]/g, "")
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(search_no_special_char, 'i') } },
        { body: { $regex: new RegExp(search_no_special_char, 'i') } }
      ]
    })
    res.render("result.ejs", { data, locals })
  }
  catch (e) { console.log(e) }
})
// GET about
router.get('/about', (req, res) => {
  res.render('about.ejs')
})
module.exports = router