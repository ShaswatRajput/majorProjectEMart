const Product = require("../models/productModels")

//Creating a product {admin}
exports.createProduct = async (req,res,next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })

}

// Getting all the products
exports.getAllProducts = async (req,res)=>{
    const products = await Product.find({})
    res.status(200).json({
        success:true,
        products
    })
}

//Updating the products {admin}
exports.updateProduct = async (req,res,next)=>{
       
       let updateProduct = await Product.findById(req.params.id)
        if(!updateProduct){ 
          return  res.status(500).json({
                success:false,
                message:"Product not Found"
            })
        }
        products = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})

        res.status(200).json({
            success:true,
            message:`Following data was modified ${products}`
        })


}

//Deleting a product {admin}
exports.deleteProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Could not find any product like that"
        })
    }
   await product.remove();
    res.status(200).json({
        success:true,
        message:"Succesfully Deleted the Product"
    })

}