const express = require("express")
const router = express.Router()
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createReview} = require("../controllers/productController.js")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js")

router.route("admin/product/new")
.post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)

router.route("/products").get(getAllProducts)

router.route("admin/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/product/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatedUser,createReview)


module.exports = router 