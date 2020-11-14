import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';
import { ReferenceType } from 'rejects';

@EventOptions({
    emitter: 'client',
    event: 'debug',
    category: 'client',
})
export default class Raw extends BoltEvent {
	public async exec(packet: any ) {
        switch (packet.t) {
            case 'VOICE_STATE_UPDATE':
                if (packet.d.user_id !== this.client.config.lavalink.id) return;
                this.client.music.voiceStateUpdate(packet.d);
                    const players: { guild_id: string, channel_id?: string }[] | null = await this.client.storage.get('players', { type: ReferenceType.ARRAY });
                    let index = 0;
                if (Array.isArray(players)) {
                    index = players.findIndex(player => player.guild_id === packet.d.guild_id);
                }
                if (((!players && !index) || index < 0) && packet.d.channel_id) {
                    this.client.storage.upsert('players', [{ guild_id: packet.d.guild_id, channel_id: packet.d.channel_id }]);
                } else if (players && typeof index !== 'undefined' && index >= 0 && !packet.d.channel_id) {
                    players.splice(index, 1);
                    await this.client.storage.delete('players');
                    if (players.length) await this.client.storage.set('players', players);
                }
                break;
            case 'VOICE_SERVER_UPDATE':
                this.client.music.voiceServerUpdate(packet.d);
                break;
            default:
                break;
        }
	}
}