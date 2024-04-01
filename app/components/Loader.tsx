import React from "react";
interface LoaderProps {
  cancelCall: () => void;
}
const Loader: React.FC<LoaderProps> = ({cancelCall}) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <p className="text-primary text-xl">Calling...</p>
      <div className="flex flex-row justify-center">
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
      <button onClick={cancelCall} className="btn btn-primary">
        Cancel
      </button>
    </div>
  );
};

export default Loader;
