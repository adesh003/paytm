import express from "express";
import User from "../model/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SinupBody = Zod.object({
    username: Zod.string(),
    email: Zod.string().email(),
    password: Zod.string()
})

export async function userSignup(req, res) {


    // const username = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }


    const isUserExist = await User.findOne({
        username: req.body.username
    });
    if (isUserExist) {
        res.status(403).json({
            message: "Email already taken/Incorrect inputs"
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);


    const user = await User.create({
        username: req.body.username,
        email: req.body.email,

        password: hashedPassword,
    })

    res.status(200).json({
        message: "user Sinup up successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
};


export async function userLogin(req, res) {

    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
    })
    if (!user) {
        res.status(403).json({
            message: "invalid email"
        })
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(403).json({
            message: "invalid password"
        })
        return;
    }

    const token = jwt.sign({
        userId: user._id
    },
        "adeshkumartheboss")

    res.status(201).json({
        token
    })




}