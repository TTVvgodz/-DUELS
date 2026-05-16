const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const rooms = {};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'ws://x');
  const room = (url.searchParams.get('room') || 'default').toUpperCase().slice(0, 12);

  if (!rooms[room]) rooms[room] = [];
  const clients = rooms[room];

  if (clients.length >= 2) {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
    return;
  }

  ws.roomId = room;
  ws.playerId = clients.length;
  clients.push(ws);

  ws.send(JSON.stringify({ type: 'waiting', playerId: ws.playerId }));

  if (clients.length === 2) {
    clients.forEach((c, i) => {
      c.send(JSON.stringify({ type: 'start', spawnIndex: i, playerId: i }));
    });
    console.log(`[${room}] Game started`);
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'ping') { ws.send(JSON.stringify({ type: 'pong' })); return; }
      const peer = clients.find(c => c !== ws && c.readyState === 1);
      if (peer) peer.send(data.toString());
    } catch (e) {}
  });

  ws.on('close', () => {
    rooms[room] = (rooms[room] || []).filter(c => c !== ws);
    const peer = rooms[room]?.[0];
    if (peer?.readyState === 1) peer.send(JSON.stringify({ type: 'opponent_left' }));
    if (!rooms[room]?.length) delete rooms[room];
    console.log(`[${room}] Player disconnected`);
  });

  ws.on('error', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`WARZONE running on port ${PORT}`));
