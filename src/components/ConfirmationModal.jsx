import React from 'react';

// ConfirmationModal component: A reusable modal for user confirmations.
// Props:
// - isOpen: Boolean to control modal visibility.
// - onClose: Function to call when the modal is closed (e.g., by clicking outside or cancel).
// - onConfirm: Function to call when the user confirms the action.
// - title: The title text for the modal.
// - message: The main message/question displayed in the modal.
export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  // If the modal is not open, don't render anything.
  if (!isOpen) {
    return null;
  }

  return (
    // DaisyUI modal container. 'modal-open' class makes it visible.
    // Clicking on the backdrop (outside the modal-box) will close it.
    <div className="modal modal-open flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal box content. Prevent clicks inside from closing the modal. */}
      <div 
        className="modal-box bg-white p-6 rounded-lg shadow-xl w-full max-w-[500px]"
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
      >
        {/* Modal title */}
        <h3 className="font-bold text-lg text-dark-red ">{title}</h3>
        {/* Modal message */}
        <p className="py-2 text-gray-700 text-center">{message}</p>
        
        {/* Modal actions (buttons) */}
        <div className="modal-action flex justify-end gap-3 mt-4">
          {/* Cancel button */}
          <button 
            className="btn btn-ghost text-dark-red hover:bg-gray-100" 
            onClick={onClose}
          >
            Cancel
          </button>
          {/* Confirm button */}
          <button 
            className="btn bg-light-red text-white hover:bg-dark-red" 
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

