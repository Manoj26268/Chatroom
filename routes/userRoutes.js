const express = require('express');
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/register",async(req,res)=>{
     try{
        res.render("register");
     }
     catch(error) {
        console.error(error);
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, username, password } = req.body;

        console.log(password);

        // validations on name username and passowrd
        const user = await User.findOne({ username: username });
        if (user) {
           res.redirect("/login");
        }

        const newUser = new User({
            name,
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        console.log(newUser);

        const token = jwt.sign({ id: newUser._id }, "Hello world", { expiresIn: "30d" });

        if (newUser) {
            res.setHeader(token);
            res.redirect('api/chat');
        }
        else {
            res.status(400);
            throw new Error("User not created");
        }

    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
});

router.get("/login",async(req,res)=>{
    try{
         res.render("login");
    }
    catch(err){
        console.log(err);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(401);
            throw new Error("user not found");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
           return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, "Hello world", { expiresIn: "30d" });
        res.setHeader(token);
        res.redirect('api/chat');
        

    }
    catch (err) {
        res.status(400);
        throw new Error("error");
    }
})

module.exports = router;