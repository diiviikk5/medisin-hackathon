import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, CreditCard, AlertTriangle, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { useAnnoyUser } from '../hooks/useAnnoyUser'

export function Cart() {
  const { cart, removeFromCart, addToCart, clearCart } = useStore()
  const { triggerRoast } = useAnnoyUser()

  const updateQuantity = (product, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id)
      triggerRoast('remove-item')
    } else if (newQuantity > cart.find(item => item.product.id === product.id)?.quantity) {
      // Increase quantity
      addToCart(product)
    } else {
      // For decreasing, we need to remove one
      removeFromCart(product.id)
      // Add back the reduced quantity
      for (let i = 0; i < newQuantity; i++) {
        addToCart(product)
      }
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price.original * item.quantity), 0)
  
  // Satirical fees
  const fees = {
    'Delivery Fee': Math.ceil(subtotal * 0.15),
    'Disappointment Insurance': Math.ceil(subtotal * 0.08),
    'Reality Check Surcharge': 5,
    'Hope Processing Fee': 3,
    'Regret Prevention (Failed)': 7,
    'GST (Guilt & Shame Tax)': Math.ceil(subtotal * 0.18),
    'Poverty Mode Discount': -Math.ceil(subtotal * 0.03)
  }
  
  const totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0)
  const total = subtotal + totalFees

  const handleCheckout = () => {
    triggerRoast('checkout')
    setTimeout(() => {
      triggerRoast('checkout-success')
      clearCart()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/catalog" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold">Cart of Regrets</h1>
              <p className="text-slate-400">Your journey to disappointment</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-4xl font-bold mb-4">Your Cart is Emptier Than Our Promises</h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              No products, no regrets... yet. Browse our catalog of confidently wrong treatments to fill this void.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/catalog" className="btn-primary">
                Browse Our Failures
              </Link>
              <Link to="/advice" className="btn-secondary">
                Get Bad Advice Instead
              </Link>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Items ({cart.length})</h2>
                <button 
                  onClick={() => {
                    clearCart()
                    triggerRoast('clear-cart')
                  }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              </div>

              {cart.map((item) => (
                <div key={item.product.id} className="card p-6">
                  <div className="flex items-start gap-4">
                    {/* Product Icon */}
                    <div className="text-4xl flex-shrink-0">
                      {item.product.category === 'tablet' ? '💊' : 
                       item.product.category === 'syrup' ? '🍯' : 
                       item.product.category === 'capsule' ? '💊' : 
                       item.product.category === 'injection' ? '💉' : '❓'}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-1">{item.product.name}</h3>
                      <p className="text-slate-400 capitalize mb-2">{item.product.category}</p>
                      
                      <div className="mb-3">
                        <p className="text-sm text-slate-400">Composition:</p>
                        <p className="text-slate-300">{item.product.composition.slice(0, 2).join(', ')}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-slate-400">Best Side Effect:</p>
                        <p className="text-slate-300 italic">"{item.product.sideEffects[0]}"</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-500">{item.product.price.discount}</div>
                        <span className="text-lg text-slate-500 line-through">₹{item.product.price.crossed}</span>
                        <span className="text-2xl font-bold text-primary-500">₹{item.product.price.original}</span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="text-right space-y-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="p-2 hover:bg-slate-600 rounded transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className="p-2 hover:bg-slate-600 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div>
                        <div className="text-2xl font-bold text-primary-500">
                          ₹{item.product.price.original * item.quantity}
                        </div>
                        
                        <button 
                          onClick={() => {
                            removeFromCart(item.product.id)
                            triggerRoast('remove-item')
                          }}
                          className="text-red-400 hover:text-red-300 text-sm mt-2 transition-colors"
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h3 className="text-2xl font-bold mb-6">Bill of Nonsense</h3>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  {Object.entries(fees).map(([label, amount]) => (
                    <div key={label} className="flex justify-between text-slate-400">
                      <span>{label}</span>
                      <span className={amount < 0 ? 'text-green-400' : ''}>
                        {amount < 0 ? '' : '+'}₹{amount}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t border-slate-600 pt-3 flex justify-between text-xl font-bold">
                    <span>Total Damage</span>
                    <span className="text-primary-500">₹{total}</span>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-600/30 rounded-lg mb-6">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-200">
                    <p className="font-semibold mb-1">⚠️ Final Warning</p>
                    <p>This purchase may cause immediate buyer's remorse, decreased faith in online shopping, and an unexplainable urge to read product reviews obsessively.</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
                >
                  <CreditCard className="h-6 w-6" />
                  Proceed to Regret (₹{total})
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  * All sales are final. Like your poor life choices.
                  <br />
                  ** No returns, no refunds, no sympathy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
