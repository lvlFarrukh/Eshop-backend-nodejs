import { Router } from "express";
import mongoose from "mongoose";
import Category from "../modals/Category.mjs";
import Product from "../modals/Products.mjs";

const productRouter = Router();

productRouter.post(`/`, async (req, res) => {
    let isCategory = await Category.findById(req?.body?.category);
    if (isCategory) {
        let product = new Product({
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
            dateCreated: req?.body?.dateCreated
        })

        product = await product.save()
        .then(() => {
            res.status(201).json({
                success: true
            })
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
    else
        res.status(404).json({
            error: "Category not found.",
            success: false,
        })
})

productRouter.get(`/`, async (req, res) => {
    const productList = await Product.find().populate('category');

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

// For single products
productRouter.get(`/details/:id`, async (req, res) => {
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
productRouter.get(`/titles`, async (req, res) => {
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
productRouter.get('/featured/:limit', async (req, res) => {
    const featuredProducts = await Product.find({isFeatured: true}).limit(req?.params?.limit === "" ? 4 : +req?.params?.limit);
    if (!featuredProducts) 
    return res.status(404).send({success: false, message: "Product not found"});

    res.json(featuredProducts)
    
})


// Filter by category
productRouter.get('/filter/', async (req, res) => {
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

productRouter.put('/:id', async (req, res) => {
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

productRouter.delete(`/:id`, async (req, res) => {
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

productRouter.get('/get/count', async (req, res) => {
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

productRouter.get('/features', async (req, res) => {
    const featuredProducts = await Product.find({isFeatured: true});

    if (!featuredProducts) return res.status(404).send({success: false, message: "Product not found"});

    res.json(featuredProducts)
    
})

export default productRouter;