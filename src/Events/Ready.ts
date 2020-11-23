import { Listener, ListenerOptions } from 'discord-akairo';
import { ReferenceType } from 'rejects';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';
import { floatPromise } from '../Lib/Utils/floatPromise';

@ApplyOptions<ListenerOptions>('ready', {
  emitter: 'client',
  event: 'ready',
  category: 'client',
})
export default class Ready extends Listener {
  public async exec() {
    console.log(
      `[READY] Hello, I am ${this.client.user!.tag} (${
        this.client.user!.id
      }), one of the first fast battleships of the Sakura Empire. I'm someone who prefers the fist to the sword. Nice to meet you.`
    );
    floatPromise(
      { client: this.client },
      this.client.user?.setActivity(`@${this.client.user?.username} help 🎶`)
    );
    const players = await this.client.storage.get('players', {
      type: ReferenceType.ARRAY,
    });
    if (players) {
      for (const player of players) {
        if (player.channel_id) {
          const queue = this.client.music.queues.get(player.guild_id);
          await queue.player.join(player.channel_id);
        }
      }
      await this.client.music.queues.start();
    }
  }
}
