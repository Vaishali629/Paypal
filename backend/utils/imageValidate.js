const imageValidate = (images) => {
    let imagesTable = []
    if(Array.isArray(images)) {
        imagesTable = images
    } else {
        imagesTable.push(images)

    }
    if(imagesTable.length > 3) {
        return { error: "Send only 3 images at once" }

    }
    for(let image of imagesTable) {
        const maxImageSize = 5 * 1024 * 1024 // 5 MB
        if (image.size > maxImageSize) {
            return { error: "Image is too large. Maximum size is 5 MB." }
        }
        const mimetype = /^image\/(jpeg|png)$/.test(image.mimetype)
        if (!mimetype) {
            return { error: "Incorrect file type. Upload a JPG, JPEG, or PNG image." }
        }
    }
    return { error: false }
}
module.exports = imageValidate
