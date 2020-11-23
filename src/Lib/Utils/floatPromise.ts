import { Client } from 'discord.js';
import { isThenable } from './isThenable';
import { Awaited } from './Awaited';

export function floatPromise(
  ctx: { client: Client },
  promise: Awaited<unknown>
) {
  if (isThenable(promise))
    promise.catch((error: Error) => ctx.client.emit('error', error));
}
