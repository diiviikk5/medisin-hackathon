import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import { BuyNowGame } from './BuyNowGame'

export function BuyNowGameManager() {
  const cart = useStore(state => state.cart)
  const [gameActive, setGameActive] = useState(false)
  const [pendingProduct, setPendingProduct] = useState(null)
  const cartLengthRef = useRef(0)

  useEffect(() => {
    // Initialize with current cart length
    if (cartLengthRef.current === 0) {
      cartLengthRef.current = cart.length
    }
  }, [])

  useEffect(() => {
    console.log('🛒 Cart changed:', cart.length, 'Previous:', cartLengthRef.current)
    
    // Only trigger when cart increases AND no active game
    if (cart.length > cartLengthRef.current && !gameActive && cart.length > 0) {
      const newItem = cart[cart.length - 1]
      console.log('🎮 New item detected:', newItem?.product?.name)
      
      if (newItem && newItem.product) {
        setPendingProduct(newItem)
        setGameActive(true)
      }
    }
    
    cartLengthRef.current = cart.length
  }, [cart, gameActive])

  const handleGameResult = (won) => {
    console.log('🎯 Game result:', won ? 'WON' : 'LOST')
    
    if (!won && pendingProduct) {
      // Remove item if lost
      const removeFromCart = useStore.getState().removeFromCart
      removeFromCart(pendingProduct.product.id)
      console.log('❌ Item removed due to loss')
    } else {
      console.log('✅ Item stays in cart')
    }
    
    // Close game after longer delay to see result
    setTimeout(() => {
      setGameActive(false)
      setPendingProduct(null)
    }, 1000) // Give more time to see result
  }

  const closeGame = () => {
    console.log('🚪 Game closed manually')
    
    if (pendingProduct) {
      const removeFromCart = useStore.getState().removeFromCart
      removeFromCart(pendingProduct.product.id)
      console.log('❌ Item removed due to manual close')
    }
    
    setGameActive(false)
    setPendingProduct(null)
  }

  return (
    <>
      {gameActive && pendingProduct && (
        <BuyNowGame 
          onClose={closeGame}
          productName={pendingProduct.product.name}
          onResult={handleGameResult}
        />
      )}
    </>
  )
}
