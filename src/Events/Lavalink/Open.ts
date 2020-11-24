import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';

@ApplyOptions<ListenerOptions>('open', {
  emitter: 'lavalink',
  event: 'open',
})
export default class Open extends Listener {
  public exec(node: string) {
    console.log(`Opened lavalink connection on node: ${node}`);
  }
}
