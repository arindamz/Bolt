/* eslint-disable @typescript-eslint/naming-convention */
import { Listener, ListenerOptions } from 'discord-akairo';
import { ReferenceType } from 'rejects';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';
import { floatPromise } from '../Lib/Utils/floatPromise';

@ApplyOptions<ListenerOptions>('raw', {
  emitter: 'client',
  event: 'raw',
  category: 'client',
})
export default class Raw extends Listener {
  public async exec(packet: any) {
    const players:
      | { guild_id: string; channel_id?: string }[]
      | null = await this.client.storage.get('players', {
      type: ReferenceType.ARRAY,
    });
    let index = 0;
    switch (packet.t) {
      case 'VOICE_STATE_UPDATE':
        if (packet.d.user_id !== this.client.config.lavalink.id) return;
        floatPromise(
          { client: this.client },
          this.client.music.voiceStateUpdate(packet.d)
        );
        if (Array.isArray(players)) {
          index = players.findIndex(
            (player) => player.guild_id === packet.d.guild_id
          );
        }
        if (((!players && !index) || index < 0) && packet.d.channel_id) {
          floatPromise(
            { client: this.client },
            this.client.storage.upsert('players', [
              { guild_id: packet.d.guild_id, channel_id: packet.d.channel_id },
            ])
          );
        } else if (
          players &&
          typeof index !== 'undefined' &&
          index >= 0 &&
          !packet.d.channel_id
        ) {
          players.splice(index, 1);
          await this.client.storage.delete('players');
          if (players.length) await this.client.storage.set('players', players);
        }
        break;
      case 'VOICE_SERVER_UPDATE':
        floatPromise(
          { client: this.client },
          this.client.music.voiceServerUpdate(packet.d)
        );
        break;
      default:
        break;
    }
  }
}
