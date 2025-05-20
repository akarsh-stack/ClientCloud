const mongoose = require('mongoose')
const Schema = mongoose.Schema

const propertySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Commercial']
  },
  pricingType: {
    type: String,
    required: true,
    enum: ['sale', 'rent', 'rent-yearly']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  yearBuilt: {
    type: Number
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
  amenities: [{
    type: String
  }],
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'rented'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

propertySchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Property', propertySchema)