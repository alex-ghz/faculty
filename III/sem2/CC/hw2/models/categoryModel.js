module.exports = mongoose => {
    var categorySchema = new mongoose.Schema({
        name: {
            type: String,
            default: 'Category'
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
    var Categories = mongoose.model('Categories', categorySchema);
    return Categories;
};