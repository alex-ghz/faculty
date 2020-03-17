module.exports = mongoose => {
    var categorySchema = new mongoose.Schema({
        name: {
            type: String,
            default: 'categoryDefault'
        },
        displayName: {
            type: String,
            default: 'Category Default'
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
    var Category = mongoose.model('Category', categorySchema);
    return Category;
};