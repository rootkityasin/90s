import { addClient, removeClient } from '../../../lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const id = crypto.randomUUID();
      const client = {
        id,
        write: (chunk: string) => controller.enqueue(encoder.encode(chunk)),
        closed: () => false
      };
      await addClient(client);
    }
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
