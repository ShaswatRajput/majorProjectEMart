const express = require("express")
const router = express.Router()
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails} = require("../controllers/productController.js")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js")

router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)
router.route("/products").get(getAllProducts)
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
.get(getProductDetails)


module.exports = router 