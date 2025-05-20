import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { MapPinIcon, EnvelopeIcon, PhoneIcon, HeartIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import PropertyGallery from '@/components/PropertyGallery'
import InquiryForm from '@/components/InquiryForm'
import Map from '@/components/Map'

export default function PropertyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const res = await fetch(`/api/properties/${id}`)
          const data = await res.json()
          if (res.ok) {
            setProperty(data)
          } else {
            throw new Error(data.message || 'Failed to fetch property')
          }
        } catch (error) {
          console.error('Error fetching property:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProperty()
    }
  }, [id])

  const formatPrice = (price, type) => {
    if (type === 'rent') {
      return `$${price}/mo`
    } else if (type === 'rent-yearly') {
      return `$${price}/yr`
    } else {
      return `$${price}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Property not found</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{property.title} | Prime Properties</title>
        <meta name="description" content={property.description.substring(0, 160)} />
      </Head>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{property.title}</h1>
              <div className="flex items-center">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <HeartIcon className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>{property.location.address}</span>
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                {formatPrice(property.price, property.pricingType)}
              </p>
            </div>
            
            <PropertyGallery images={property.images} />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{property.description}</p>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property Type</p>
                  <p className="font-medium text-gray-800 dark:text-white">{property.propertyType}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                  <p className="font-medium text-gray-800 dark:text-white">{property.bedrooms}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                  <p className="font-medium text-gray-800 dark:text-white">{property.bathrooms}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                  <p className="font-medium text-gray-800 dark:text-white">{property.area} sqft</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Year Built</p>
                  <p className="font-medium text-gray-800 dark:text-white">{property.yearBuilt}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
              <div className="h-64 rounded-lg overflow-hidden">
                <Map location={property.location} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact Agent</h2>
              
              <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={property.agent.photo || '/agent-placeholder.jpg'}
                    alt={property.agent.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{property.agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{property.agent.company}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <a href={`tel:${property.agent.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {property.agent.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <a href={`mailto:${property.agent.email}`} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {property.agent.email}
                  </a>
                </div>
              </div>
              
              <button
                onClick={() => setShowInquiryForm(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
        
        {showInquiryForm && (
          <InquiryForm 
            propertyId={property._id} 
            agentId={property.agent._id} 
            onClose={() => setShowInquiryForm(false)} 
          />
        )}
      </motion.div>
    </>
  )
}