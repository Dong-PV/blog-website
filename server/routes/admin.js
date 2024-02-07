/* /server/routes/admin.js */
const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET
const admin_layout = '../views/layouts/admin'
const auth_middle_ware = (req, res, next) => {
  const token = req.cookies.token
  if (!token)
    return res.status(401).json({ message: 'unauthorized acess' })
  try {
    const decoded = jwt.verify(token, jwt_secret)
    req.user_id = decoded.user_id
    next()
  }
  catch (e) {
    return res.status(401).json({ message: 'unauthorized acess' })
  }
}
// GET admin: login page
router.get('/admin', (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "This is a description."
    }
    res.render('admin/index', {
      locals,
      layout: admin_layout
    })
  }
  catch (e) { console.log(e) }
})
// POST admin: check login
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user)
      return res.status(401).json({ message: 'invalid credentials' })
    const is_password_valid = await bcrypt.compare(password, user.password)
    if (!is_password_valid)
      return res.status(401).json({ message: 'invalid credentials' })
    const token = jwt.sign({ user_id: user._id }, jwt_secret)
    res.cookie('token', token, { httpOnly: true })
    res.redirect('/dashboard')
  }
  catch (e) { console.log(e) }
})

// GET admin: edit post
router.get('/edit-post/:id', auth_middle_ware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Desssssssssscription12345"
    }
    const data = await Post.findOne({ _id: req.params.id })
    res.render('admin/edit-post', {
      locals,
      data,
      layout: admin_layout
    })
  }
  catch (e) { console.log(e) }
})



// GET admin: dashboard
router.get('/dashboard', auth_middle_ware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'A random description'
    }
    const data = await Post.find()
    res.render('admin/dashboard', {
      locals,
      data,
      layout: admin_layout
    })
  } catch (e) { console.log(e); }
})



// GET admin: create new post
router.get('/add-post', auth_middle_ware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'This is a description'
    }
    const data = await Post.find()
    res.render('admin/add-post', {
      locals,
      layout: admin_layout
    })
  }
  catch (e) { console.log(e) }
})



// POST admin: register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashed_password = await bcrypt.hash(password, 10)
    try {
      const user = await User.create({ username, password: hashed_password })
      res.status(201).json({ message: 'user created', user })
    } catch (error) {
      if (error.code === 11000)
        res.status(409).json({ message: 'user already in use' })
      res.status(500).json({ message: 'internal server error' })
    }
    console.log(req.body)
  }
  catch (e) { console.log(e) }
})
// POST admin: create new post | /views/admin/add-posts.ejs 
router.post('/add-post', auth_middle_ware, async (req, res) => {
  try {
    const new_post = new Post({
      title: req.body.title,
      body: req.body.body
    })
    await Post.create(new_post)
    res.redirect('/dashboard')
  }
  catch (e) { console.log(e) }
})



// PUT admin: create new post | /views/admin/edit-posts.ejs 
router.put('/edit-post/:id', auth_middle_ware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      date_modified: Date.now()
    })
    res.redirect(`/edit-post/${req.params.id}`)
  }
  catch (e) { console.log(e) }
})



// DELETE admin: delete post
router.delete('/delete-post/:id', auth_middle_ware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id })
    res.redirect('/dashboard')
  }
  catch (e) { console.log(e); }
})
// GET admin: logout
router.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
})
module.exports = router