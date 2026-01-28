const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    quantityUnit: {
      type: String,
      enum: ['plates', 'kg', 'packets'],
      default: 'plates'
    },
    foodType: {
      type: String,
      enum: ['edible', 'compost'],
      required: true
    },
    images: [{ url: String, filename: String }],
    pickupWindow: {
        from: {
          type: Date,
          default: Date.now
        },
        to: {
          type: Date,
          default: () => {
            const twoDaysLater = new Date();
            twoDaysLater.setDate(twoDaysLater.getDate() + 2);
            return twoDaysLater;
          }
        }
      },
    status: {
      type: String,
      enum: ['available', 'requested', 'picked'],
      default: 'available'
    },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

foodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Food', foodSchema);
