module.exports = mongoose => {
    var movieSchema = new mongoose.Schema({
        title: {
            type: String,
            default: 'Title'
        },
        category: {
            type: mongoose.ObjectId,
        },
        specifics: {
            ageRestriction: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                from: {
                    type: Number,
                    default: 16
                }
            },
            description: {
                type: String,
                default: 'Cool movie'
            }
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
    var Movies = mongoose.model('Movies', movieSchema);
    return Movies;
};