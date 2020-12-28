const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 5000;
const WSS = new WebSocket.Server({ port });

const clients = new Map();
const servers = new Map();

console.clear();
console.log(servers.size, clients.size);

WSS.on('connection', (ws, req) => {
	ws.on('close', (data) => {
		for (let [key, value] of servers) {
			if (value !== ws) continue;
			servers.delete(key);
		}
		for (let [key, value] of clients) {
			if (value !== ws) continue;
			clients.delete(key);
		}
		console.clear();
		console.log(servers.size, clients.size);
	});

	ws.on('message', (data) => {
		const message = JSON.parse(data);

		switch (message.id) {
			case 'user-connect':
				let clientid = Math.random().toString().slice(2, 10);
				while (clients.has(clientid))
					clientid = Math.random().toString().slice(2, 10);

				clients.set(clientid, ws);

				ws.send(
					JSON.stringify({
						id: 'user-connect-confirm',
						content: clientid,
					})
				);

				console.log(`user connected: ${clientid}`);
				break;
			case 'server-connect':
				let serverid = Math.random().toString().slice(2, 7);
				while (clients.has(serverid))
					serverid = Math.random().toString().slice(2, 7);

				servers.set(serverid, ws);

				ws.send(
					JSON.stringify({
						id: 'server-connect-confirm',
						content: serverid,
					})
				);

				console.log(`server connected: ${serverid}`);
				break;
			default:
				break;
		}

		console.clear();
		console.log(servers.size, clients.size);
	});
});

/* ksgo-server: MWS -> WSS */
// --- Game Server ---
// server-connect <-
// server-connect-confirm ->

/* ksgo-client/public: MWS -> WSS */
// --- User ---
// user-connect <-
// user-connect-confirm ->
// user-update-serverlist ->
