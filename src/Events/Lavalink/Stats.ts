import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';

@ApplyOptions<ListenerOptions>('stats', {
  emitter: 'lavalink',
  event: 'stats',
})
export default class Open extends Listener {
  public exec(data: Record<string, unknown>) {
    this.client.music.info = {
      ...this.client.music.info,
      ...data,
    };
  }
}
