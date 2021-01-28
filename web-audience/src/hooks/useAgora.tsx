import { useState, useEffect } from 'react';
import {
  IAgoraRTCClient, IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';

export default function useAgora(client: IAgoraRTCClient | undefined)
  : {
    joinState: boolean,
    leave: Function,
    join: Function,
    remoteUsers: IAgoraRTCRemoteUser[],
  } {
  const [joinState, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);


  async function join(appid: string, channel: string, token?: string) {
    if (!client) return;

    await client.join(appid, channel, token || null);

    (window as any).client = client;

    setJoinState(true);
  }

  async function leave() {
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, [client]);

  return {
    joinState,
    leave,
    join,
    remoteUsers,
  };
}