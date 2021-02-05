import WebSocket from 'ws';

const port = process.env.PORT || 4000;
const WSS = new WebSocket.Server({ port: parseInt(`${port}`) });

type MessageID =
	| 'server-connect'
	| 'server-connect-confirm'
	| 'user-connect'
	| 'user-connect-confirm'
	| 'user-serverlist-update';

interface ClientListItem {
	id: string;
	name: string;
	socket: WebSocket;
}

interface ServerListItem {
	id: string;
	name: string;
	address: string;
	socket: WebSocket;
}

interface MessageItem {
	id: MessageID;
	content: any;
}

interface ServerConnectContent {
	name: string;
	address: string;
}

const clients: Array<ClientListItem> = [];
const servers: Array<ServerListItem> = [];

console.clear();
// console.log(servers.size, clients.size);

WSS.on('connection', (ws, req) => {
	ws.on('close', (data) => {
		if (servers.find((s) => s.socket === ws)) {
			const server = servers.find((s) => s.socket === ws);

			servers.splice(servers.indexOf(server), 1);

			const u_list = clients.map(({ id }) => id);

			clients.forEach(({ socket }) => {
				if (socket.readyState !== WebSocket.OPEN) return;
				socket.send(
					JSON.stringify({
						id: 'user-serverlist',
						content: u_list,
					})
				);
			});

			console.info(`Server disconnected: ${server.id}`);
		} else {
			const client = clients.find((c) => c.socket === ws);

			clients.splice(clients.indexOf(client), 1);
			console.info(`User disconnected: ${client.name}`);
		}
	});

	ws.on('message', (data: string) => {
		const { id, content }: MessageItem = JSON.parse(data);

		if (id === 'server-connect') {
			const {
				name,
				address,
			}: ServerConnectContent = content as ServerConnectContent;
			// Generate random server ID (random 5 character string of numbers)
			let s_id = Math.random().toString().slice(2, 7);
			while (servers.some((s) => s.id === s_id))
				s_id = Math.random().toString().slice(2, 7);

			// Create new ServerListItem based on that key and the incoming data
			servers.push({
				id: s_id,
				name,
				address,
				socket: ws,
			});

			// Update all the clients with the new server
			clients.forEach(({ socket }) => {
				if (socket.readyState !== WebSocket.OPEN) return;
				socket.send(
					JSON.stringify({
						id: 'user-serverlist-update',
						content: {
							name,
							id: s_id,
						},
					})
				);
			});

			console.info(`Server connected ${s_id}`);
		}
		// switch (message.id) {
		// 	case 'user-connect':
		// 		let clientid = Math.random().toString().slice(2, 10);
		// 		while (clients.has(clientid))
		// 			clientid = Math.random().toString().slice(2, 10);

		// 		clients.set(clientid, {
		// 			name: message.content,
		// 			socket: ws,
		// 		});

		// 		ws.send(
		// 			JSON.stringify({
		// 				id: 'user-connect-confirm',
		// 				content: clientid,
		// 			})
		// 		);

		// 		ws.send(
		// 			JSON.stringify({
		// 				id: 'user-serverlist',
		// 				content: Array.from(servers, ([key, value]) => ({
		// 					id: key,
		// 					name: value.name,
		// 					address: value.address,
		// 				})),
		// 			})
		// 		);

		// 		console.log(`User connected: ${clientid}`);
		// 		break;

		// 	default:
		// 		break;
		// }

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
