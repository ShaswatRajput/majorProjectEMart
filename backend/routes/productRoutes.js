const express = require("express")
const router = express.Router()
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails} = require("../controllers/productController.js")

router.route("/product/new").post(createProduct)
router.route("/products").get(getAllProducts)
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)


module.exports = router 