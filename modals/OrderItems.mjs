import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }
})

const OrderItem = mongoose.model('orderItems', orderItemSchema);
export default OrderItem;