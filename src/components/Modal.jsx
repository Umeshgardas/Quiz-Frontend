// Modal.js
const Modal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>You haven't attempted all questions. Do you still want to submit?</p>
        <button onClick={onConfirm}>Yes, Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
