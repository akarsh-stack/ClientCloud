const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  getFeaturedProperties
} = require('../controllers/properties')

// @route   GET api/properties
// @desc    Get all properties
// @access  Public
router.get('/', getProperties)

// @route   GET api/properties/featured
// @desc    Get featured properties
// @access  Public
router.get('/featured', getFeaturedProperties)

// @route   GET api/properties/:id
// @desc    Get single property
// @access  Public
router.get('/:id', getProperty)

// @route   GET api/properties/agent/:agentId
// @desc    Get agent's properties
// @access  Public
router.get('/agent/:agentId', getAgentProperties)

// @route   POST api/properties
// @desc    Create a property
// @access  Private (Agent)
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('propertyType', 'Property type is required').not().isEmpty(),
      check('pricingType', 'Pricing type is required').not().isEmpty(),
      check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
      check('bedrooms', 'Bedrooms is required and must be a positive number').isInt({ min: 0 }),
      check('bathrooms', 'Bathrooms is required and must be a positive number').isFloat({ min: 0 }),
      check('area', 'Area is required and must be a positive number').isFloat({ min: 0 }),
      check('location.address', 'Address is required').not().isEmpty(),
      check('location.city', 'City is required').not().isEmpty(),
      check('location.state', 'State is required').not().isEmpty(),
      check('location.zipCode', 'Zip code is required').not().isEmpty(),
      check('images', 'At least one image is required').isArray({ min: 1 })
    ]
  ],
  createProperty
)

// @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private (Agent/Admin)
router.put('/:id', auth, updateProperty)

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private (Agent/Admin)
router.delete('/:id', auth, deleteProperty)

module.exports = router