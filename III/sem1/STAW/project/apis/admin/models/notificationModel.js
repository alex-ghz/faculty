module.exports = mongoose => {
    var notificationsSchema = new mongoose.Schema({
        from: {
            type: String,
            default: 'admin'
        },
        to: {
            type: String,
            default: '5e2dee79a5e68e03a98abb64'
        },
        content: {
            type: String,
            default: 'Produs aparut nou in stoc'
        },
        seen: {
            type: Boolean,
            default: false
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
    var Notification = mongoose.model('Notification', notificationsSchema);
    return Notification;
};