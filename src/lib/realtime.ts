// Simple in-memory Server-Sent Events hub for product updates.
// Not production-ready (no persistence / clustering); fine for demo.
import type { Product } from './types';
import { listProducts } from './data/store';

export type SSEClient = { id: string; write: (chunk: string) => void; closed: () => boolean };

const clients: SSEClient[] = [];

function send(client: SSEClient, data: string) {
  try { client.write(data); } catch { /* ignore broken pipe */ }
}

export function addClient(client: SSEClient) {
  clients.push(client);
  // send initial snapshot
  const snapshot = JSON.stringify(listProducts());
  send(client, `event: snapshot\n` + `data: ${snapshot}\n\n`);
}

export function removeClient(id: string) {
  const idx = clients.findIndex(c => c.id === id);
  if (idx !== -1) clients.splice(idx, 1);
}

export function broadcastProductUpdate(p: Product | null) {
  if (!p) return;
  const payload = JSON.stringify(p);
  clients.forEach(c => !c.closed() && send(c, `event: productUpdate\n` + `data: ${payload}\n\n`));
}

// Optional keepalive to prevent proxies closing connection
setInterval(() => {
  clients.forEach(c => !c.closed() && send(c, `event: ping\n` + `data: ${Date.now()}\n\n`));
}, 25000);
