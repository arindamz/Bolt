import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';
@ApplyOptions<ListenerOptions>('shardReconnecting', {
  emitter: 'client',
  event: 'shardReconnecting',
  category: 'client',
})
export default class ShardReconnecting extends Listener {
  public exec(id: number) {
    console.log(`[SHARD ${id} RECONNECTING] Firepower--full force!!`);
  }
}
