const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//Creating a product {admin}
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.body.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })

})

// Getting all the products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
    })
})

//Getting a product's details
exports.getProductDetails = catchAsyncErrors(
    async (req, res, next) => {

        const product = await Product.findById(req.params.id)
        if (!product) {
            return next(new ErrorHandler("Product not found :(", 404))
        }


        res.status(200).json({
            success: true,
            product
        })


    }
)
//Updating the products {admin}
exports.updateProduct = catchAsyncErrors(
    async (req, res, next) => {

        let products = await Product.findById(req.params.id)
        if (!products) {
            return next(new ErrorHandler("Product not found :(", 404))
        }

        products = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })

        res.status(200).json({
            success: true,
            message: `Following data was modified ${products}`
        })

    }
)

//Deleting a product {admin}
exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {

        const product = await Product.findById(req.params.id)
        if (!product) {
            return next(new ErrorHandler("Product not found :(", 404))
        }

        await product.deleteOne();
        res.status(200).json({
            success: true,
            message: "Succesfully Deleted the Product"
        })

    }
)