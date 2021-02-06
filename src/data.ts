import WebSocket from 'ws';

export type MessageID =
	| 'server-connect'
	| 'server-connect-confirm'
	| 'user-connect'
	| 'user-connect-confirm'
	| 'user-serverlist-update';

export interface ClientListItem {
	id: string;
	name: string;
	socket: WebSocket;
}

export interface ServerListItem {
	id: string;
	name: string;
	address: string;
	socket: WebSocket;
}

export interface MessageItem {
	id: MessageID;
	content: any;
}

export interface ServerConnectContent {
	name: string;
	address: string;
}

export interface ClientConnectContent {
	name: '';
}
