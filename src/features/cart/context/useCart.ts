import { useContext } from 'react';
import { CartContext } from './cart.context';
import type { CartContextType } from '../types/cart.types';

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
