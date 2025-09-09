"use client";
import React from 'react';
import { deleteProduct } from '../actions';

// Modern button styles
const buttonStyles = {
  delete: {
    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '.75rem 1.2rem',
    fontSize: '.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(197,48,48,0.3)',
    minWidth: 140,
    textAlign: 'center' as const,
  },
  deleteConfirm: {
    background: 'linear-gradient(135deg, #9b2c2c 0%, #c53030 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '.75rem 1.2rem',
    fontSize: '.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 3px 12px rgba(155,44,44,0.4)',
    minWidth: 140,
    textAlign: 'center' as const,
    transform: 'scale(1.02)',
  }
};

export default function DeleteButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = React.useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await deleteProduct(productId);
    // Note: The modal closing logic will be handled by the parent component
    // which will see the product is no longer in the list.
  }

  function handleMouseLeave() {
    setConfirming(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      onMouseLeave={handleMouseLeave}
      style={confirming ? buttonStyles.deleteConfirm : buttonStyles.delete}
    >
      {confirming ? 'Confirm Delete?' : 'Delete Product'}
    </button>
  );
}
