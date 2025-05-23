import React from "react";
import "./EditModal.css";

const EditModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
};

export default EditModal;
