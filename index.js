const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 5000;
const WSS = new WebSocket.Server({ port });

const clients = new Map();
const servers = new Map();

console.clear();
// console.log(servers.size, clients.size);

WSS.on('connection', (ws, req) => {
	ws.on('close', (data) => {
		for (let [key, value] of servers) {
			if (value.socket !== ws) continue;
			servers.delete(key);

			const serverlist = Array.from(servers, ([k, v]) => ({
				id: k,
				name: v.name,
				address: v.address,
			}));
			clients.forEach((client) => {
				if (client.socket.readyState === WebSocket.OPEN) {
					client.socket.send(
						JSON.stringify({
							id: 'user-serverlist',
							content: serverlist,
						})
					);
				}
			});
		}
		for (let [key, value] of clients) {
			if (value.socket !== ws) continue;
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

				clients.set(clientid, {
					name: message.content,
					socket: ws,
				});

				ws.send(
					JSON.stringify({
						id: 'user-connect-confirm',
						content: clientid,
					})
				);

				ws.send(
					JSON.stringify({
						id: 'user-serverlist',
						content: Array.from(servers, ([key, value]) => ({
							id: key,
							name: value.name,
							address: value.address,
						})),
					})
				);

				console.log(`user connected: ${clientid}`);
				break;
			case 'server-connect':
				let serverid = Math.random().toString().slice(2, 7);
				while (clients.has(serverid))
					serverid = Math.random().toString().slice(2, 7);

				servers.set(serverid, {
					name: message.content.name,
					address: message.content.address,
					socket: ws,
				});

				ws.send(
					JSON.stringify({
						id: 'server-connect-confirm',
						content: serverid,
					})
				);

				console.log('this');
				const serverlist = Array.from(servers, ([key, value]) => ({
					id: key,
					name: value.name,
					address: value.address,
				}));
				clients.forEach((client) => {
					if (client.socket.readyState === WebSocket.OPEN) {
						client.socket.send(
							JSON.stringify({
								id: 'user-serverlist',
								content: serverlist,
							})
						);
					}
				});

				console.log(`server connected: ${serverid}`);
				break;
			default:
				break;
		}

		// console.clear();
		// console.log(servers.size, clients.size);
	});
});

/* ksgo-server/index.js: MWS -> WSS */
// --- Game Server ---
// server-connect <- { name: string, address: string }
// server-connect-confirm -> { serverid: string }

/* ksgo-client/public/msocket.js: MWS -> WSS */
// --- User ---
// user-connect <- { name: string }
// user-connect-confirm -> { clientid: string }
// user-serverlist -> [{id: string, info: {name, address}}]
