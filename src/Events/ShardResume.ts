import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';

@ApplyOptions<ListenerOptions>('shardResume', {
  emitter: 'client',
  event: 'shardResume',
  category: 'client',
})
export default class ShardResume extends Listener {
  public exec(id: number) {
    console.log(`[SHARD ${id} RESUME] Alright, next time I'll--Eh...again...?`);
  }
}
