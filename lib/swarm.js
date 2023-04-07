import  Swarm from 'webrtc-swarm';
import signalhub from 'signalhub';
import webrtcAdapter from 'webrtc-adapter';

export const createSwarm = (username, onMessageReceived) => {
  const hub = signalhub('p2p-messaging-app', [
    'https://signalhubUrl.p2p.today',
  ]);
  const swarm = new Swarm(hub, {
    uuid: username,
    config: webrtcAdapter.RTCConfiguration,
    wrtc: webrtcAdapter.wrtc,
  });

  swarm.on('peer', (peer, id) => {
    console.log(`Peer ${id} connected`);

    peer.on('data', (data) => {
      const message = JSON.parse(data.toString());
      console.log('Sending message:', JSON.stringify(newMessage));
      peer.send(JSON.stringify(newMessage));
      onMessageReceived(message);
    });

    const timestamp = new Date().getTime();
    const message = {
      timestamp,
      username,
      message: `${username} joined the chat`,
    };
    peer.send(JSON.stringify(message));
  });

  swarm.on('disconnected', (peer, id) => {
    console.log(`Peer ${id} disconnected`);

    const timestamp = new Date().getTime();
    const message = {
      timestamp,
      username,
      message: `${username} left the chat`,
    };
    onMessageReceived(message);
  });

  return swarm;
};
