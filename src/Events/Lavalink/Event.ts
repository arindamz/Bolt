import { Listener, ListenerOptions } from 'discord-akairo';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';
import { trackEnded } from '../../Lib/Utils/MusicUtils';

@ApplyOptions<ListenerOptions>('event', {
  emitter: 'lavalink',
  event: 'event',
})
export default class Open extends Listener {
  public exec(data: any) {
    const { type, reason } = data;
    // If a track ends with finished, it means that the song ended. Time to send out music feeds.
    if (type === 'TrackEndEvent' && reason === 'FINISHED')
      return trackEnded(data, this.client);

    // Don't do anything else.
    return undefined;
  }
}
