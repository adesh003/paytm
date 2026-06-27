import express from "express";
import User from "../model/userModel.js"
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import Zod, { object } from 'zod'
import AuthMiddleware from "../Authmiddleware.js";
import Account from "../model/acoountModel.js";
import mongoose from "mongoose";

const signupBody = Zod.object({
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

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
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

export async function updateUserData(req, res) {
    const { username, email, password } = req.body;

    const updateData = {}

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
        updateData.password = await bcrypt.hash(password, 10)
    }

    // if(object.keys(updateData).length === 0){
    //     return res.status(400).json({
    //         message:"No data provided for update"
    //     })
    // }

    await User.updateOne({
           _id:req.userId
    },updateData)

     return res.json({
        message: "Update successful"
    });
}

export async function bulkSearch(req,res) {
      const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            username: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            _id: user._id
        }))
    })
}

export async function userBalance(req,res) {
    const account = await Account.findOne({
        userId:req.userId
    });
console.log(account)
    res.json({
        balance: account.balance
    })
}

export async function transfer(req,res) {
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount , to }= req.body
    
    const account = await Account.findOne({
        userId:req.userId   
    })


if(!account || account.balance <amount){
await session.abortTransaction();
return res.status(400).json({
    message:"Insufficient balance"
})

}
const toAccount = await Account.findOne({
    userId:to
}).session(session);

if(!toAccount){
    await session.abortTransaction();
    return res.status(400).json({
            message: "Invalid account"
        });
}
// performing transection

await Account.updateOne({
    userId:req.userId
},{
    $inc:{balance:-amount}
}).session(session);

    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);


    await session.commitTransaction()
    res.json({
        message:"Transfer Successfull"
    })
}