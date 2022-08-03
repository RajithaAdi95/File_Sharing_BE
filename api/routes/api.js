const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");

router.post("/user/authorize", UserController.auth_token);
router.post("/user/signup", UserController.user_signup);
router.post("/user/login", UserController.user_login);
router.get("/user/:id", UserController.get_user);
router.put("/user/update/:id", UserController.update_user);

module.exports = router;