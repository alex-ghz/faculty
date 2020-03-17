module.exports = mongoose => {
    var productImageSchema = new mongoose.Schema({
        parent: {
            type: ObjectId,
            default: 0
        },
        file_path : {
            type: String,
            default: '/files/default-profile.jpg'
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    });
    var ProductImage = mongoose.model('Files', productImageSchema);
    return ProductImage;
};