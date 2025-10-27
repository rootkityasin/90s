"use client";
import React from 'react';
import { deleteProduct } from '../actions';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        // Dispatch event for parent to show notification
        const event = new CustomEvent('productDeleted', { detail: { productId } });
        window.dispatchEvent(event);
        // Navigate back to admin page after successful delete
        router.push('/admin');
        router.refresh();
      } else {
        alert(`Error: ${result.error || 'Failed to delete product'}`);
        setDeleting(false);
        setConfirming(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
      setDeleting(false);
      setConfirming(false);
    }
  }

  function handleMouseLeave() {
    setConfirming(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      onMouseLeave={handleMouseLeave}
      disabled={deleting}
      style={{
        ...(confirming ? buttonStyles.deleteConfirm : buttonStyles.delete),
        opacity: deleting ? 0.6 : 1,
        cursor: deleting ? 'not-allowed' : 'pointer'
      }}
    >
      {deleting ? 'Deleting...' : confirming ? 'Confirm Delete?' : 'Delete Product'}
    </button>
  );
}
