// pages/index.js
import React, { useRef, useEffect } from 'react';
import {
  IoMicOffOutline,
  IoMicSharp,
  IoVideocamOffSharp,
  IoVideocamOutline,
} from 'react-icons/io5';
import { ImPhoneHangUp } from 'react-icons/im';
import truncateEthereumAddress from '../util/truncateEthereumAddress';
import { TYPES } from '@pushprotocol/restapi';
type VideoPlayerPropsType = {
  data: TYPES.VIDEO.DATA;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
};
const VideoPlayer: React.FC<VideoPlayerPropsType> = ({
  data,
  endCall,
  toggleAudio,
  toggleVideo,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && data?.local?.stream) {
      localVideoRef.current.srcObject = data?.local?.stream;
    }
    if (remoteVideoRef.current && data?.incoming[0]?.stream) {
      remoteVideoRef.current.srcObject = data?.incoming[0]?.stream;
    }
  }, [data?.local?.stream, data?.incoming[0]?.stream]);

  return (
    <div className="flex flex-col items-center mt-[60px] h-screen p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 relative">
        {/* Local Video Container */}
        <div className="bg-black absolute z-10 top-[20px] right-[20px] md:top-0 md:right-0 w-[100px] h-[100px] md:w-[40vw] md:h-[60vh] mb-4 rounded-xl overflow-hidden md:relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <p className="badge absolute top-[10px] md:top-[92%] md:bottom-[20px] right-[10px] py-1 text-xs md:text-md">
            you
          </p>

          <div className="absolute bottom-[10px] md:bottom-[20px] left-[10px] md:left-[20px] flex flex-row gap-2 md:gap-4">
            {!data.local.audio ? (
              <IoMicOffOutline size="20px" />
            ) : (
              <IoMicSharp size="20px" />
            )}
            {!data.local.video ? (
              <IoVideocamOffSharp size="20px" />
            ) : (
              <IoVideocamOutline size="20px" />
            )}
          </div>
        </div>

        {/* Remote Video Container */}
        <div className="bg-black w-full md:w-[40vw] h-[60vh] mb-4 rounded-xl overflow-hidden relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />{' '}
          <p className="badge absolute bottom-[20px] right-[20px] py-1">
            {truncateEthereumAddress(data?.incoming[0].address)}
          </p>
          <div className="absolute bottom-[10px] md:bottom-[20px] left-[10px] md:left-[20px] flex flex-row gap-2 md:gap-4">
            {!data.incoming[0].audio ? (
              <IoMicOffOutline size="20px" />
            ) : (
              <IoMicSharp size="20px" />
            )}
            {!data.incoming[0].video ? (
              <IoVideocamOffSharp size="20px" />
            ) : (
              <IoVideocamOutline size="20px" />
            )}
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex justify-around items-center mt-4 gap-4">
        <button
          className="btn btn-outline btn-info tooltip"
          disabled={!data.incoming[0]}
          onClick={toggleAudio}
          data-tip={data.local.audio ? 'Mute' : 'Unmute'}
        >
          {data.local.audio ? (
            <IoMicOffOutline size={'20px'} />
          ) : (
            <IoMicSharp size={'20px'} />
          )}
        </button>
        <button
          className="btn btn-outline btn-info tooltip"
          disabled={!data.incoming[0]}
          onClick={toggleVideo}
          data-tip={data.local.video ? 'Stop Video' : 'Start Video'}
        >
          {data.local.video ? (
            <IoVideocamOffSharp size={'20px'} />
          ) : (
            <IoVideocamOutline size={'20px'} />
          )}
        </button>

        <button
          className="btn btn-outline btn-error tooltip"
          onClick={endCall}
          disabled={!data?.incoming[0]?.address}
          data-tip="End Call"
        >
          <ImPhoneHangUp size={'20px'} />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
