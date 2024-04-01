import React from "react";
type IncomingCallModalProps = {
  open: boolean;
  walletAddress: string;
  onAccept: () => void;
  onReject: () => void;
};

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  open,
  walletAddress,
  onAccept,
  onReject,
}) => {
  return (
    <dialog id="my_modal_1" className="modal" open={open}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Incoming Call</h3>
        <p className="py-4">{walletAddress} is calling</p>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() => {
              onAccept();
              open = false;
            }}
          >
            Accept
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              onReject();
              open = false;
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default IncomingCallModal;
