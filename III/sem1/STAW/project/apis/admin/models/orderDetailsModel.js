module.exports = mongoose => {
    var orderDetailsSchema = new mongoose.Schema({
        orderId: {
            type: String,
            default: 'none'
        },
        productId: {
            type: String,
            default: 'productId'
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
    var OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);
    return OrderDetails;
};