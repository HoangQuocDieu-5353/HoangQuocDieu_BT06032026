var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')
let roleSchema = require('../schemas/roles')

// ====================== USER CRUD ======================

// GET all users
router.get('/', async function (req, res, next) {
  try {
    let result = await userSchema.find({ isDeleted: false }).populate({ path: 'role', select: 'name description' })
    res.status(200).send(result)
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne({ _id: req.params.id, isDeleted: false }).populate({ path: 'role', select: 'name description' })
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// POST create new user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || "",
      avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
      status: req.body.status || false,
      role: req.body.role,
      loginCount: req.body.loginCount || 0
    })
    let result = await newUser.save()
    res.status(201).send({
      message: "USER CREATED SUCCESSFULLY",
      data: result
    })
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
  try {
    let updateData = {}
    if (req.body.username) updateData.username = req.body.username
    if (req.body.password) updateData.password = req.body.password
    if (req.body.email) updateData.email = req.body.email
    if (req.body.fullName) updateData.fullName = req.body.fullName
    if (req.body.avatarUrl) updateData.avatarUrl = req.body.avatarUrl
    if (req.body.status !== undefined) updateData.status = req.body.status
    if (req.body.role) updateData.role = req.body.role
    if (req.body.loginCount !== undefined) updateData.loginCount = req.body.loginCount

    let result = await userSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (result && !result.isDeleted) {
      res.status(200).send({
        message: "USER UPDATED SUCCESSFULLY",
        data: result
      })
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    )
    if (result) {
      res.status(200).send({
        message: "USER DELETED SUCCESSFULLY"
      })
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// ====================== ENABLE/DISABLE USER ======================

// POST enable user (set status to true)
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body
    if (!email || !username) {
      return res.status(400).send({
        message: "EMAIL AND USERNAME ARE REQUIRED"
      })
    }
    let user = await userSchema.findOne({ email: email, username: username })
    if (!user) {
      return res.status(404).send({
        message: "USER NOT FOUND"
      })
    }
    let result = await userSchema.findByIdAndUpdate(
      user._id,
      { status: true },
      { new: true }
    )
    res.status(200).send({
      message: "USER ENABLED SUCCESSFULLY",
      data: result
    })
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// POST disable user (set status to false)
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body
    if (!email || !username) {
      return res.status(400).send({
        message: "EMAIL AND USERNAME ARE REQUIRED"
      })
    }
    let user = await userSchema.findOne({ email: email, username: username })
    if (!user) {
      return res.status(404).send({
        message: "USER NOT FOUND"
      })
    }
    let result = await userSchema.findByIdAndUpdate(
      user._id,
      { status: false },
      { new: true }
    )
    res.status(200).send({
      message: "USER DISABLED SUCCESSFULLY",
      data: result
    })
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

module.exports = router;
