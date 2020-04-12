module.exports = mongoose => {
    var recordSchema = new mongoose.Schema({
        name: {
            type: String,
            default: 'none'
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
    var Record = mongoose.model('Record', recordSchema);
    return Record;
};