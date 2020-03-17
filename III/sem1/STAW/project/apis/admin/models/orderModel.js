module.exports = mongoose => {
    var orderSchema = new mongoose.Schema({
        email: {
            type: String,
            default: 'none@none.ro'
        },
        firstname: {
            type: String,
            default: 'Mihaita'
        },
        telefon: {
            type: String,
            default: '0722600333'
        },
        oras: {
            type: String,
            default: 'Iasi'
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
    var Order = mongoose.model('Order', orderSchema);
    return Order;
};