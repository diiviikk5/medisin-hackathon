import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, AlertTriangle } from 'lucide-react'
import { useStore } from '../lib/store'
import { useAnnoyUser } from '../hooks/useAnnoyUser'

export function ProductCard({ product }) {
  const { addToCart } = useStore()
  const { triggerRoast } = useAnnoyUser()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    triggerRoast('add-to-cart')
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tablet': return '💊'
      case 'syrup': return '🍯'
      case 'injection': return '💉'
      case 'advice': return '💬'
      default: return '❓'
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="card card-hover h-full space-y-4 group">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getCategoryIcon(product.category)}</span>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary-500 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">{product.category}</p>
            </div>
          </div>
          <AlertTriangle className="h-5 w-5 text-danger-500" />
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-1">Composition:</h4>
            <p className="text-sm text-gray-400">
              {product.composition.slice(0, 2).join(', ')}
              {product.composition.length > 2 && '...'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-1">Side Effects:</h4>
            <p className="text-sm text-gray-400">
              {product.sideEffects[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary-500">₹{product.price.original}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price.crossed}</span>
            </div>
            <p className="text-xs text-gray-400">{product.price.discount}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
