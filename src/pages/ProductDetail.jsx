import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, AlertTriangle } from 'lucide-react'
import { useStore } from '../lib/store'
import { useAnnoyUser } from '../hooks/useAnnoyUser'
import productsData from '../lib/data/products.json'

export function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useStore()
  const { triggerRoast } = useAnnoyUser()

  const product = productsData.find(p => p.id === id)

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-8">This product doesn't exist. Much like its benefits.</p>
        <Link to="/catalog" className="btn-primary">
          Back to Catalog
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
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
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/catalog" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image/Icon */}
        <div className="space-y-6">
          <div className="card text-center py-16">
            <div className="text-8xl mb-4">{getCategoryIcon(product.category)}</div>
            <p className="text-gray-400 capitalize">{product.category}</p>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-danger-500" />
              <h3 className="font-semibold">Warning</h3>
            </div>
            <p className="text-sm text-gray-400">
              This product is designed to be completely useless. Any perceived benefits are purely psychological and unintended.
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-400 capitalize">{product.category}</p>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-primary-500">₹{product.price.original}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.price.crossed}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{product.price.discount}</p>
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Composition */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-3">Composition</h3>
            <ul className="space-y-1">
              {product.composition.map((item, index) => (
                <li key={index} className="text-gray-400">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Indications */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-3">Indications</h3>
            <ul className="space-y-1">
              {product.indications.map((item, index) => (
                <li key={index} className="text-gray-400">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Side Effects */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-3">Side Effects</h3>
            <ul className="space-y-1">
              {product.sideEffects.map((item, index) => (
                <li key={index} className="text-gray-400">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-3">Contraindications</h3>
            <ul className="space-y-1">
              {product.contraindications.map((item, index) => (
                <li key={index} className="text-gray-400">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
