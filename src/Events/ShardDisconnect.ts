import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';

@ApplyOptions<ListenerOptions>('shardDisconnect', {
  emitter: 'client',
  event: 'shardDisconnect',
  category: 'client',
})
export default class ShardDisconnect extends Listener {
  public exec(event: any, id: number) {
    console.warn(
      `[SHARD ${id} DISCONNECT] Ugh...I'm sorry...but, a loss is a loss... (${event.code})`,
      event
    );
  }
}
