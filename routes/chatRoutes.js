const express = require("express");
const router = express.Router();
const auth = require("../config/auth");

router.get("/", auth, (req, res) => {
    try {
        res.render("chat", { user: req.user });
    }
    catch (err) {
        console.error(err);
        res.send("error");
    }
})

module.exports = router;