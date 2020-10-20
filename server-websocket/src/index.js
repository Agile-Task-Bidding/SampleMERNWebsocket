const WebSocket = require('ws');
const moment = require('moment-timezone');

const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  // Alert other clients someone joined
  const joinPacket = JSON.stringify({event: 'join', data: { user: 'Yeet'}});
  console.log('client connected');
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(joinPacket);
    }
  });
  // Alert self of other clients
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      const joinPacket = JSON.stringify({event: 'join', data: { user: 'Yeet'}});
      ws.send(joinPacket);  
    }
  });
  // Handle generic messages
  ws.on('message', function incoming(data) {
    const incoming = JSON.parse(data);
    const packet = JSON.stringify({type: 'message', data: { text: incoming.data.text, timestamp: moment().format() }})
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(packet);
      }
    });
  });

  ws.on('close', () => {
    console.log('client disconnected');
  })
});