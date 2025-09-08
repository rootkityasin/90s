"use client";
import React from 'react';
import { deleteProduct } from '../actions';

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
      style={{
        background: confirming ? '#c00' : '#611',
        color: '#fff',
        padding: '.7rem 1.1rem',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        transition: 'background .2s',
        minWidth: 120,
        textAlign: 'center',
      }}
    >
      {confirming ? 'Confirm Delete?' : 'Delete Product'}
    </button>
  );
}
