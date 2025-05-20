const Property = require('../models/Property')
const User = require('../models/User')
const { validationResult } = require('express-validator')

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, bedrooms, bathrooms, search, page = 1, limit = 10 } = req.query
    
    let query = {}
    
    if (type) query.pricingType = type
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) }
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) }
    if (search) query.$text = { $search: search }
    
    const properties = await Property.find(query)
      .populate('agent', 'name email phone photo company')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
    
    const count = await Property.countDocuments(query)
    
    res.json({
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone photo company')
    
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' })
    }
    
    res.json(property)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' })
    }
    res.status(500).send('Server Error')
  }
}

// @desc    Create a property
// @route   POST /api/properties
// @access  Private (Agent)
exports.createProperty = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  try {
    const agent = await User.findById(req.user.id)
    if (!agent || agent.role !== 'agent') {
      return res.status(401).json({ msg: 'Not authorized to create properties' })
    }
    
    const newProperty = new Property({
      ...req.body,
      agent: req.user.id
    })
    
    const property = await newProperty.save()
    res.json(property)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id)
    
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' })
    }
    
    // Check if user is the agent who created the property or admin
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update this property' })
    }
    
    property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    )
    
    res.json(property)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' })
    }
    res.status(500).send('Server Error')
  }
}

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' })
    }
    
    // Check if user is the agent who created the property or admin
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete this property' })
    }
    
    await property.remove()
    res.json({ msg: 'Property removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' })
    }
    res.status(500).send('Server Error')
  }
}

// @desc    Get agent's properties
// @route   GET /api/properties/agent/:agentId
// @access  Public
exports.getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.params.agentId })
      .populate('agent', 'name email phone photo company')
    
    res.json(properties)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ featured: true })
      .populate('agent', 'name email phone photo company')
      .limit(6)
    
    res.json(properties)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}