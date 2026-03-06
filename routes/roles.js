var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles')

// ====================== ROLE CRUD ======================

// GET all roles
router.get('/', async function (req, res, next) {
  try {
    let result = await roleSchema.find({ isDeleted: false })
    res.status(200).send(result)
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne({ _id: req.params.id, isDeleted: false })
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// POST create new role
router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleSchema({
      name: req.body.name,
      description: req.body.description || ""
    })
    let result = await newRole.save()
    res.status(201).send({
      message: "ROLE CREATED SUCCESSFULLY",
      data: result
    })
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
  try {
    let updateData = {}
    if (req.body.name) updateData.name = req.body.name
    if (req.body.description) updateData.description = req.body.description

    let result = await roleSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (result && !result.isDeleted) {
      res.status(200).send({
        message: "ROLE UPDATED SUCCESSFULLY",
        data: result
      })
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

// DELETE role (soft delete)
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    )
    if (result) {
      res.status(200).send({
        message: "ROLE DELETED SUCCESSFULLY"
      })
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "ERROR",
      error: error.message
    })
  }
});

module.exports = router;
