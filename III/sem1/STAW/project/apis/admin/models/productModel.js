module.exports = mongoose => {
    var productSchema = new mongoose.Schema({
        name: {
            type: String,
            default: 'productDefault'
        },
        specifics: {
            category: {
                value: {
                    type: String,
                    default: 'N/A'
                },
                id: {
                    type: String,
                    default: 'N/A'
                }
            },
            price: {
                value: {
                    type: Number,
                    default: 0
                },
                moneda: {
                    type: String,
                    default: 'RON'
                }
            },
            others: []
        },
        description: {
            type: String,
            default: ''
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
    var Product = mongoose.model('Products', productSchema);
    return Product;
};