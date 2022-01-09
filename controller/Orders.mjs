import { Router } from "express";
import mongoose from "mongoose";
import Order from "../modals/Orders.mjs";
import OrderItems from "../modals/OrderItems.mjs";

const orderRouter = Router();

orderRouter.post(`/`, async (req, res) => {

    const orderItemsIds = Promise.all(req?.body?.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItems({
            quantity: orderItem?.quantity,
            product: orderItem?.product
        })

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    })) 

    let order = new Order({
        orderItems: await orderItemsIds,
        shippingAddress1: req?.body?.shippingAddress1,
        shippingAddress2: req?.body?.shippingAddress2,
        city: req?.body?.city,
        zip: req?.body?.zip,
        country: req?.body?.country,
        phone : req?.body?.phone,
        user: req?.body?.user
    })

    order = await order.save()
        .then(() => {
            res.status(201).json({
                success: true,
                order
            })
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    
})

orderRouter.get(`/`, async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name')
        .populate({ path: 'orderItems'})
        // .sort({'dateOrdered': -1});

    if (!orders) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...orders
        })
    }
})

orderRouter.get(`/:id`, async (req, res) => {
    const orders = await Order.findById(req?.params?.id)
        .populate('user', 'name')
        .populate({ path: 'orderItems', populate: { path: 'product' , populate: { path: 'category'}}});
        // .sort({'dateOrdered': -1});

    if (!orders) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...orders._doc
        })
    }
})

// For single products
orderRouter.get(`/details/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
        return res.status(400).send("Invalid product id.")
    }
    const productList = await Product.find({_id: req.params.id}).populate('category');

    if (!productList) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...productList
        })
    }
})

// Product for image and title
orderRouter.get(`/titles`, async (req, res) => {
    const productList = await Product.find().select('name image -_id');

    if (!productList) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...productList
        })
    }
})

// Featured Products
orderRouter.get('/featured/:limit', async (req, res) => {
    const featuredProducts = await Product.find({isFeatured: true}).limit(req?.params?.limit === "" ? 4 : +req?.params?.limit);
    if (!featuredProducts) 
    return res.status(404).send({success: false, message: "Product not found"});

    res.json(featuredProducts)
    
})

// Filter by category
orderRouter.get('/filter/', async (req, res) => {
    if (req?.query?.category.length > 0) {
        const filterProduct = {
            category: req?.query?.category?.split(",")
        }
        const filteredProduct = await Product.find(filterProduct).populate('category');
        if (!filteredProduct) 
        return res.status(404).send({success: false, message: "Product not found"});

        res.json(filteredProduct)
    }
    res.status(400).send({success: false});
})

orderRouter.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
        return res.status(400).send("Invalid product id.")
    }

    let isCategory = await Category.findById(req?.body?.category);
    if(!isCategory) return res.status(404).send("Invalid category");

    let product = await Product.findByIdAndUpdate(
        req?.params?.id,
        {
            name: req?.body?.name,
            description: req?.body?.description,
            richDescription: req?.body?.richDescription,
            image: req?.body?.image,
            images: req?.body?.images,
            brand: req?.body?.brand,
            price : req?.body?.price,
            category: req?.body?.category,
            countInStock: req?.body?.countInStock,
            rating: req?.body?.rating,
            numReviews: req?.body?.numReviews,
            isFeatured: req?.body?.isFeatured,
        },
        { new: true }
    );
    
    if (!product) return res.status(404).send("product cannot update.");
    res.json(product);
})

orderRouter.delete(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
        return res.status(400).send("Invalid product id.")
    }
    Product.findByIdAndRemove(req?.params?.id)
        .then((product) => {
            if (product) {
                res.status(200).json({
                    success: true,
                    message: "Product delete successfully",
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Product not found",
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

orderRouter.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).send({
            productCount: productCount
        })
    }
})

orderRouter.get('/features', async (req, res) => {
    const featuredProducts = await Product.find({isFeatured: true});

    if (!featuredProducts) return res.status(404).send({success: false, message: "Product not found"});

    res.json(featuredProducts)
    
})

export default orderRouter;