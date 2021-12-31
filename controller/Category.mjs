import { Router } from "express";
import Category from "../modals/Category.mjs"

const categoryRoutes = Router();

categoryRoutes.get(`/`, async (req, res) => {
    const CategoryList = await Category.find();

    if (!CategoryList) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
    else {
        res.status(200).json({
            ...CategoryList
        })
    }
})

categoryRoutes.get(`/:id`, async (req, res) => {
    const category = await Category.findById(req?.params?.id);

    if (!category) {
        res.status(404).json({
            success: false,
            message: "Category not found",
        })
    }

    res.status(200).json({
        ...category
    })      
})

categoryRoutes.post(`/`, (req, res) => {
    const category = new Category({
        name: req?.body?.name,
        icon: req?.body?.icon,
        color: req?.body?.color,
    })

    Category.save()
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
})

categoryRoutes.delete(`/:id`, async (req, res) => {
    Category.findByIdAndRemove(req?.params?.id)
        .then((categery) => {
            if (categery) {
                res.status(200).json({
                    success: true,
                    message: "Category delete successfully",
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Category not found",
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

categoryRoutes.put(`/:id`, async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req?.params?.id,
        {
            name: req?.body?.name,
            icon: req?.body?.icon,
            color: req?.body?.color,
        }
    )

    if (!category) {
        res.status(404).json({
            success: false,
            message: "Category not found",
        })
    }

    res.status(500).json({
        ...category
    })
})

export default categoryRoutes;