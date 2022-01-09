import { Router } from "express";
import User from "../modals/User.mjs"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userRoutes = Router();

userRoutes.get(`/`, async (req, res) => {
    const userList = await User.find().select('-password');

    if (!userList) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...userList
        })
    }
})

userRoutes.get(`/:id`, async (req, res) => {
    const user = await User.findById(req?.params?.id).select('-password');

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        })
    }

    res.status(200).json({
        ...user
    })      
})

userRoutes.post(`/`, async (req, res) => {
    const isEmail = await User.find({email: req?.body?.email})
    if (isEmail.length === 0) {
        const user = new User({
            name: req?.body?.name,
            email: req?.body?.email,
            password: bcrypt.hashSync(req?.body?.password, 10),
            phone: req?.body?.phone,
            isAdmin: req?.body?.isAdmin,
            street: req?.body?.street,
            apartment: req?.body?.apartment,
            zip: req?.body?.zip,
            city: req?.body?.city,
            country: req?.body?.country,
        })
        user.save()
            .then(() => {
                res.status(200).json({
                    success: true,
                })
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error: error
                })
            })
    }
    else {
        res.status(400).send({
            success: false,
            message: "Email already present."
        })
    }
})

userRoutes.delete(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
        return res.status(400).send("Invalid user id.")
    }
    User.findByIdAndRemove(req?.params?.id)
        .then((product) => {
            if (product) {
                res.status(200).json({
                    success: true,
                    message: "User delete successfully",
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                error: error
            })
        })    
})

userRoutes.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
        return res.status(400).send("Invalid user id.")
    }

    let user = await User.findByIdAndUpdate(
        req?.params?.id,
        {
            name: req?.body?.name,
            email: req?.body?.email,
            phone: req?.body?.phone,
            isAdmin: req?.body?.isAdmin,
            street: req?.body?.street,
            apartment: req?.body?.apartment,
            zip: req?.body?.zip,
            city: req?.body?.city,
            country: req?.body?.country,
        },
        { new: true }
    );
    
    if (!user) return res.status(404).send("user cannot update.");
    res.json(user);
})

userRoutes.post(`/login`, async (req, res) => {
    const user = await User.findOne({email: req?.body?.email})

    if (!user) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        if (user && bcrypt.compareSync(req?.body?.password, user?.password)) {
            const token = jwt.sign(
                {
                    userId: user?._id,
                    isAdmin: user?.isAdmin
                },
                process.env.JSON_WEB_TOKEN,
                {expiresIn: "1d"}
            )
            res.status(200).send({
                user: user.email,
                token 
            })
        }
        else {
            res.status(400).send("wrong pssword");
        }
    }
})

userRoutes.post(`/register`, async (req, res) => {
    const isEmail = await User.find({email: req?.body?.email})
    if (isEmail.length === 0) {
        const user = new User({
            name: req?.body?.name,
            email: req?.body?.email,
            password: bcrypt.hashSync(req?.body?.password, 10),
            phone: req?.body?.phone,
            isAdmin: req?.body?.isAdmin,
            street: req?.body?.street,
            apartment: req?.body?.apartment,
            zip: req?.body?.zip,
            city: req?.body?.city,
            country: req?.body?.country,
        })
        user.save()
            .then(() => {
                res.status(200).json({
                    success: true,
                })
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error: error
                })
            })
    }
    else {
        res.status(400).send({
            success: false,
            message: "Email already present."
        })
    }
})

userRoutes.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();
    if (!userCount) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).send({
            userCount: userCount
        })
    }
})

export default userRoutes;
