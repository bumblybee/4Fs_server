const express = require("express");
const router = express.Router();

const { getUsers, getUser } = require("../controllers/adminController");

router.get("/users", getUsers);
router.get("/users/:id", getUser);

module.exports = router;
