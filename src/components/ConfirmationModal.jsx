import React from "react";
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal modal-open flex items-center justify-center p-4"
      onClick={onClose}
    >
      {" "}
      <div
        className="modal-box bg-white p-6 rounded-lg shadow-xl w-full max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
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
