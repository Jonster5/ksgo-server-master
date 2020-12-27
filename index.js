const WebSocket = require('ws');
const fs = require('fs');

const port = process.env.PORT || 5000;
const WSS = new WebSocket.Server({ port });

WSS.on('listening', () => {
	console.log(`Serving on port ${port}`);
});

WSS.on('connection', (ws, req) => {
	ws.on('message', (data) => {
		console.log(data);
	});
});
