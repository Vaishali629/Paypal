const Product = require("../models/ProductModel")
const recordsPerPage = require("../config/pagination")
const imageValidate = require("../utils/imageValidate")
const getProducts = async (req,res, next) => {
    try {
        let query = {};
        let queryCondition = false
        let priceQueryCondition = {}
        if(req.query.price) {
            queryCondition = true;
            priceQueryCondition = { price: { $lte: Number(req.query.price) } }
        }
          let ratingQueryCondition = {}
          if(req.query.rating) {
            queryCondition = true;
            ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
        }
        let categoryQueryCondition = {}
        const categoryName = req.params.categoryName || ""
        if(categoryName) {
            queryCondition = true
            let a = categoryName.replaceAll(",", "/")
            var regEx = new RegExp("^" +a)
            categoryQueryCondition = { category: regEx}
        }
        if(req.query.category) {
            queryCondition = true
            let a = req.query.category.split(",").map((item) => {
                if(item) return new RegExp("^" + item)
        
            })
            categoryQueryCondition = {
                category: { $in: a }
            }
        }
        let attrsQueryCondition = []
        if(req.query.attrs) {
            // attrs=RAM-1TB-2TB-4TB, color-blue-red
            // [ 'RAM-1TB-4TB', 'color-blue', '' ]
            attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
                if(item) {
                    let a = item.split("-")
                    let values = [...a]
                    values.shift() // removes first item
                    let a1 = {
                        attrs: {$elemMatch: { key: a[0], value: { $in: values } } }
                    }
                    acc.push(a1)
                    // console.dir(acc, { depth: null })
                    return acc
                } else return acc
                
            }, []);
          //  console.dir(attrsQueryCondition, { depth: null });
          queryCondition = true;
        }
        
        const requestedPage = Number.parseInt(req.query.pageNum, 10)
        const pageNum = Number.isInteger(requestedPage) && requestedPage > 0
            ? requestedPage
            : 1

        
        // sort by  name, price etc.
        let sort= {}
        const sortOption = req.query.sort || ""
        if(sortOption) {
            let sortOpt = sortOption.split("_")
            sort = { [sortOpt[0]]: Number(sortOpt[1]) }
            
        }

        const searchQuery = req.params.searchQuery || ""
        let searchQueryCondition = {}
        let select = {}
        if(searchQuery) {
            queryCondition = true
            searchQueryCondition = { $text: { $search: searchQuery  } }
            select = {
                score: { $meta: "textScore" }
            }
            sort = { score: {$meta: "textScore" } }
        }
        if (queryCondition){
          query = {
            $and: [
                priceQueryCondition, 
                ratingQueryCondition , 
                categoryQueryCondition, 
                searchQueryCondition,
                ...attrsQueryCondition
            ],
        }  
        }

        
        const totalProducts = await Product.countDocuments({})
        const products = await Product.find(query)
            .select(select)
            .sort(sort)
            .skip(recordsPerPage * (pageNum - 1))
            .limit(recordsPerPage)

        // An HTTP request can have only one response.
        res.json({
            products,
            pageNum,
            paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
            totalProducts,
        })
    } catch(error) {
        next(error);
    }
};
const getProductById = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("reviews").orFail()
        res.json(product)
    } catch(err) {
        next(err)
    }
}
const getBestSellers = async(req,res,next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1}},
            { $group: {_id: "$category", doc_with_max_sales: {$first: "$$ROOT"} }},
            { $replaceWith: "$doc_with_max_sales"},
            { $match: {sales: {$gt: 0}}},
            { $project: {_id: 1, name: 1, images: 1, category: 1, description: 1}},
            { $limit: 3}
        ])
        res.json(products)
    } catch(err) {
        next(err)
    }
}
const adminGetProducts = async(req, res, next) => {
    try {
          
          const products = await Product.find({})
              .sort({ category: 1 })
              .select("name price category");
          return res.json(products)
    }  catch(err) {
        next(err)
    }
};
const adminDeleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail()
        await product.remove()
        res.json({ message: "product removed" })
    }  catch(err) {
        next(err)
    }
}
const adminCreateProduct = async(req, res, next) => {
    try {
          const product = new Product()
          const { name, description, count, price, category, attributesTable } = req.body 
          product.name = name
          product.description = description
          product.count = count
          product.price = price
          product.category = category
          if( attributesTable.length > 0 ) {
             attributesTable.map((item) => {
                product.attrs.push(item)
             })
          }
          await product.save()
          res.json({
            message: "product created",
            productId: product._id
          })
    } catch(err) {
        next(err)
    }
}
const adminUpdateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail()
        const { name, description, count, price, category, attributesTable } = req.body
        product.name = name ?? product.name
        product.description = description ?? product.description
        product.count = count ?? product.count
        product.price = price ?? product.price
        product.category = category ?? product.category
        product.attrs = Array.isArray(attributesTable) ? attributesTable : product.attrs
          await product.save()
          res.json({
            message: "product updated"
          })
    } catch(err) {
        next(err)
    }
}
const adminUpload = async (req, res, next) => {
    try {
        if (!req.files || !req.files.images) {
            return res.status(400).json({ message: "No files were uploaded." })
        }
        const validateResult = imageValidate(req.files.images)
        if(validateResult.error) {
            return res.status(400).json({ message: validateResult.error })
        }

        const productId = req.query.productId || req.body.productId
        if (!productId) {
            return res.status(400).json({ message: "productId is required." })
        }

        const path = require("path")
        const { v4: uuidv4 } = require("uuid")
        const uploadDirectory = path.resolve(__dirname, "../../frontend", "public", "images", "products")
        const product = await Product.findById(productId).orFail()
        const imagesTable = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images]

        const uploadedImages = await Promise.all(imagesTable.map(async (image) => {
            const filename = `${uuidv4()}${path.extname(image.name)}`
            await image.mv(path.join(uploadDirectory, filename))
            return `/images/products/${filename}`
        }))

        product.images.push(...uploadedImages.map((imagePath) => ({ path: imagePath })))
        await product.save()

        return res.status(201).json({
            message: "Files uploaded!",
            images: uploadedImages,
        })
    } catch(err) {
        next(err)
    }
}
const adminDeleteProductImage = async (req, res, next) => {
    try {
        const productId = req.query.productId || req.params.productId
        const imagePath = req.query.imagePath || req.params.imagePath

        if (!productId || !imagePath) {
            return res.status(400).json({ message: "productId and imagePath are required." })
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { $pull: { images: { path: imagePath } } },
            { new: true }
        ).orFail()

        // Only custom uploads belong to this product. Seeded/category images are shared,
        // so remove their database reference but do not delete the shared public file.
        if (imagePath.startsWith("/images/products/")) {
            const path = require("path")
            const fs = require("fs/promises")
            const imagesDirectory = path.resolve(__dirname, "../../frontend/public/images/products")
            const imageFilename = path.basename(imagePath)
            await fs.unlink(path.join(imagesDirectory, imageFilename)).catch((error) => {
                if (error.code !== "ENOENT") throw error
            })
        }

        return res.json({
            message: "Image removed.",
            images: product.images,
        })
    } catch(err) {
        next(err);
    }
}
module.exports = { getProducts, getProductById, getBestSellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct , adminUpload, adminDeleteProductImage};  
