// socket-client.ts
import Pusher from 'pusher-js';

export const createSocketConnection = () => {
  Pusher.logToConsole = true;

  const pusher = new Pusher('tlc-key', {
    cluster: '', // add the required cluster property, adjust as needed
    wsHost: 'localhost', // đổi thành domain nếu deploy
    wsPort: 6002,
    wssPort: 6002,
    forceTLS: false, // true nếu dùng HTTPS
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  });

  const channel = pusher.subscribe('chat.123');

 return {
    onMessage: (callback: (data: any) => void) => {
      channel.bind('message.created', callback);
    },
    sendMessage: async (message: string) => {
      await fetch('http://localhost:6001/apps/tlc-id/events', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer tlc-secret',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: 'chat.123',
          name: 'message.created',
          data: JSON.stringify({ message })
        })
      });
    },
    disconnect: () => {
      pusher.disconnect();
    }
  };
};
