module.exports = mongoose => {
    var userSchema = new mongoose.Schema({
        email: {
            type: String,
            default: 'admin'
        },
        password: {
            type: String,
            default: 'admin'
        },
        firstname: {
            type: String,
            default: 'Admin'
        },
        specifics: {
            oras: {
                type: String,
                default: 'Iasi'
            }
        },
        profileImage: {
            type: String,
            default: '/public/images/default-profile.jpg'
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
    var Users = mongoose.model('Users', userSchema);
    return Users;
};