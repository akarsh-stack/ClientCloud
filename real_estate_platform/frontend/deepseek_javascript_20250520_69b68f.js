import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PropertyCard({ property }) {
  const [isFavorite, setIsFavorite] = useState(false)
  
  const formatPrice = (price, type) => {
    if (type === 'rent') {
      return `$${price}/mo`
    } else if (type === 'rent-yearly') {
      return `$${price}/yr`
    } else {
      return `$${price}`
    }
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.images[0] || '/property-placeholder.jpg'}
          alt={property.title}
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute bottom-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {property.type === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            {property.title}
          </h3>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(property.price, property.pricingType)}
          </p>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location.address}</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {property.bedrooms} Beds
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {property.bathrooms} Baths
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {property.area} sqft
            </span>
          </div>
          
          <Link href={`/properties/${property._id}`}>
            <a className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              View Details
            </a>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}