// Modal.js
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {children}
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
