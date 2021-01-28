import { useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient, MicrophoneAudioTrackInitConfig, CameraVideoTrackInitConfig, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalVideoTrack, ILocalAudioTrack
} from 'agora-rtc-sdk-ng';

export default function useAgora(client: IAgoraRTCClient | undefined)
  : {
    localAudioTrack: ILocalAudioTrack | undefined,
    localVideoTrack: ILocalVideoTrack | undefined,
    joinState: boolean,
    leave: Function,
    join: Function
  } {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);

  const [joinState, setJoinState] = useState(false);

  async function createLocalTracks(audioConfig?: MicrophoneAudioTrackInitConfig, videoConfig?: CameraVideoTrackInitConfig)
    : Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join(appid: string, channel: string, token?: string) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();

    await client.join(appid, channel, token || null);
    await client.publish([microphoneTrack, cameraTrack]);

    (window as any).client = client;
    (window as any).videoTrack = cameraTrack;

    setJoinState(true);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }

    setJoinState(false);
    await client?.leave();
  }

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join
  };
}