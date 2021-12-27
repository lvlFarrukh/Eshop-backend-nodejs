import { Router } from "express";
import Product from "../modals/Products.mjs";

const productRouter = Router();

productRouter.post(`/`, (req, res) => {
    // const product = new Product({
    //     name: req?.body?.name,
    //     imageUrl: req?.body?.imageUrl,
    //     countInStock: req?.body?.countInStock,
    //     uploadDate: new Date(),
    // })

    // console.log(product)
    // product.save()
    //     .then(() => {
    //         res.status(200).json({
    //             success: true,
    //         })
    //     })
    //     .catch((error) => {
    //         res.status(500).json({
    //             success: false,
    //             error: error
    //         })
    //     })
    res.send("working")
})

productRouter.get(`/`, async (req, res) => {
    // const productList = await Product.find();

    // if (!productList) {
    //     res.status(500).json({
    //         success: false,
    //         error: error
    //     })
    // }
    // else {
    //     res.status(200).json({
    //         ...productList
    //     })
    // }
    res.send("working")
})

export default productRouter;