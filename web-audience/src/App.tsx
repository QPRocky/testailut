import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import { Flex, Button, Text } from 'rebass';
import { Input } from '@rebass/forms';

const client = AgoraRTC.createClient({ codec: 'vp8', mode: 'live', role: "audience" });

function App() {
  const appid = process.env.REACT_APP_AGORA_APP_ID;
  const channel = process.env.REACT_APP_AGORA_CHANNEL;

  const [token, setToken] = useState("006f179fa79e2ae4ec28c316af123a6d98bIAAGUSecLQBodqe27BTh/7NfaSlxPxLiSyueiZUj2CU+xDqk/gYAAAAAEAD26wA6sfLeXwEAAQCx8t5f")
  const { leave, join, joinState, remoteUsers } = useAgora(client);

  return (
    <Flex flexDirection="column">
      <Text>AUDIENCE</Text>
      <Input
        placeholder="token"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
        value={token}
      />
      <Button
        bg={joinState ? "lightblue" : "blue"}
        width={100}
        height={30}
        disabled={joinState}
        onClick={() => join(appid, channel, token)}
      >
        Join
      </Button>
      <Button
        bg={!joinState ? "lightblue" : "blue"}
        width={100}
        height={30}
        disabled={!joinState}
        onClick={() => { leave() }}
      >
        Leave
      </Button>
      {remoteUsers.map((user, index) =>
        <MediaPlayer key={index} videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
      )}
    </Flex>
  );
}

export default App;
