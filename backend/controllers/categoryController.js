const Category = require("../models/CategoryModel")
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: "asc" })

        res.json(categories)
    } catch(error){
        next(error)
    }
    

}
const newCategory = async (req, res, next) => {
    try {
        // res.send(!!req.body)
        const {category} = req.body
        if (!category || !category.trim()) {
            return res.status(400).send("Category input is required")
        }

        const name = category.trim()
        const categoryExists = await Category.findOne({ name })
        if (categoryExists) {
            return res.status(400).send("Category already exists")
        } else {
            const categoryCreated = await Category.create({
                name
            })
            res.status(201).send({categoryCreated: categoryCreated})
        }  
    } catch (err) {
        next(err)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        

        if (req.params.category !== "Choose category") {
            const categoryExists = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail()
            await categoryExists.remove()
            res.json({categoryDeleted: true})
        }

        
    } catch (error) {
        next(error)
    }
}
const saveAttr = async (req, res, next) => {
    const {key, val, categoryChoosen} = req.body
    if(!key || !val || !categoryChoosen) {
        return res.status(400).send("All inputs are requiredsaveAttr")
    }
    try {
        // Keep the request value and the normalized database name in separate
        // variables. Redeclaring `categoryChoosen` here puts it in the
        // temporal-dead-zone while its initializer is evaluated.
        const categoryName = categoryChoosen.split("/")[0]
        const categoryExists = await Category.findOne({ name: categoryName }).orFail()
        if(categoryExists.attrs.length > 0) {
            // if key exists in the database then add a value to the key
            var keyDoesNotExistsInDatabase = true
            categoryExists.attrs.map((item, idx) => {
                if(item.key === key) {
                    keyDoesNotExistsInDatabase = false
                    var copyAttributeValues = [...categoryExists.attrs[idx].value]
                    copyAttributeValues.push(val)
                    var newAttributeValues = [...new Set(copyAttributeValues)] // Set ensures unique values
                      categoryExists.attrs[idx].value = newAttributeValues
                }
            })
            if(keyDoesNotExistsInDatabase) {
                categoryExists.attrs.push({key: key, value: [val]})
            }
        } else {
            // push to the array
            categoryExists.attrs.push({key: key, value: [val]})
        }
        await categoryExists.save()
        // Apply the sort to the Mongoose query, before awaiting it. Once
        // awaited this is a JavaScript array, whose sort expects a comparator.
        const cat = await Category.find({}).sort({ name: 1 })
        return res.status(201).json({categoriesUpdated: cat})
    } catch(err) {
        next(err)
    }
}

module.exports = {getCategories, newCategory, deleteCategory, saveAttr}
