'use client';
import { PushAPI, CONSTANTS, TYPES } from '@pushprotocol/restapi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useRef, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import IncomingCallModal from './components/IncomingCallModal';
import VideoPlayer from './components/VideoPlayer';
import Loader from './components/Loader';

export default function Home() {
  const { data: signer } = useWalletClient();
  // state to handle current video call data
  const [data, setData] = useState<TYPES.VIDEO.DATA>(
    CONSTANTS.VIDEO.INITIAL_DATA
  );
  const aliceVideoCall = useRef<any>();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [incomingWalletAddress, setIncomingWalletAddress] = useState('');
  const init = async () => {
    const userAlice = await PushAPI.initialize(signer, {
      env: (process.env.NEXT_PUBLIC_ENV as any) ?? CONSTANTS.ENV.STAGING,
    });

    // Initialize Stream
    const stream = await userAlice.initStream([CONSTANTS.STREAM.VIDEO]);

    // Configure stream listen events and what to do
    stream.on(CONSTANTS.STREAM.VIDEO, (data) => {
      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        // handle call request
        setIncomingWalletAddress(data.peerInfo.address);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
        // handle call approve
        setLoading(false);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
        // handle call denied
        setLoading(false);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
        // handle call connected
        setLoading(false);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
        // handle call disconnected
      }
    });
    // Initialising the video API
    aliceVideoCall.current = await userAlice.video.initialize(setData, {
      stream: stream,
      config: {
        video: true, // to enable video on start
        audio: true, // to enable audio on start
      },
    });

    console.log('Video Call Initialized', aliceVideoCall.current);

    // Connect Stream
    stream.connect();
  };

  useEffect(() => {
    if (!signer) return;
    if (data?.incoming[0].status !== CONSTANTS.VIDEO.STATUS.UNINITIALIZED)
      return;
    init();
  }, [signer, data?.incoming[0].status]);

  useEffect(() => {
    console.log(data);
  }, [data]);
  const makeCall = async () => {
    await aliceVideoCall.current.request([recipientAddress]);
    setLoading(true);
  };
  const handleEndCall = async () => {
    await aliceVideoCall.current.disconnect();
  };
  const toggleAudio = async () => {
    aliceVideoCall.current?.config({ audio: !data?.local.audio });
  };
  const toggleVideo = async () => {
    aliceVideoCall.current?.config({ video: !data?.local.video });
  };
  return (
    <main>
      <div className="p-4 flex justify-center">
        <ConnectButton />
      </div>
      {data?.incoming[0].status === CONSTANTS.VIDEO.STATUS.UNINITIALIZED && (
        <div className="flex flex-col gap-4 items-center justify-center min-h-[80vh]">
          <p className="text text-xl text-primary font-bold">
            Start a video call to a wallet
          </p>
          <div className="flex flex-row max-w-xl gap-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setRecipientAddress(e.target.value)}
              value={recipientAddress}
            />
            <button className="btn btn-primary" onClick={makeCall}>
              Call
            </button>
          </div>
        </div>
      )}

      <IncomingCallModal
        open={data.incoming[0].status === CONSTANTS.VIDEO.STATUS.RECEIVED}
        walletAddress={incomingWalletAddress}
        onAccept={async () => {
          await aliceVideoCall.current.approve();
        }}
        onReject={async () => {
          await aliceVideoCall.current.deny();
        }}
      />

      {loading && (
        <Loader
          cancelCall={() => {
            setLoading(false);
            init();
          }}
        />
      )}
      {data?.incoming[0].status === CONSTANTS.VIDEO.STATUS.CONNECTED && (
        <VideoPlayer
          data={data}
          endCall={handleEndCall}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
        />
      )}
    </main>
  );
}
