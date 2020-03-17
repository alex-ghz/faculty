module.exports = mongoose => {
    var adminsSchema = new mongoose.Schema({
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
    var Admins = mongoose.model('Admins', adminsSchema);
    return Admins;
};