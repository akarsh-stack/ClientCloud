require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const propertyRoutes = require('./routes/properties')
const userRoutes = require('./routes/users')
const inquiryRoutes = require('./routes/inquiries')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/inquiries', inquiryRoutes)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))