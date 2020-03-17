module.exports = mongoose => {
    var filterSchema = new mongoose.Schema({
        parent: {
            type: String,
            default: 'Capacitate'
        },
        child: {
            type: String,
            default: 'Mica'
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
    var Filters = mongoose.model('Filters', filterSchema);
    return Filters;
};