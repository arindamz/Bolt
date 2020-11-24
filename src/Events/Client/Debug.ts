import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';

@ApplyOptions<ListenerOptions>('debug', {
  emitter: 'client',
  event: 'debug',
  category: 'client',
})
export default class Debug extends Listener {
  public exec(event: any) {
    console.debug(`[DEBUG] ${event}`);
  }
}
