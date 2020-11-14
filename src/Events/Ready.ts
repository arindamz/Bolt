import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';
import { ReferenceType } from 'rejects';

@EventOptions({
	emitter: 'client',
	event: 'ready',
	category: 'client',
})
export default class Ready extends BoltEvent {
	public async exec() {
		console.log(
			`[READY] Hello, I am ${this.client.user!.tag} (${
				this.client.user!.id
			}), one of the first fast battleships of the Sakura Empire. I'm someone who prefers the fist to the sword. Nice to meet you.`,
		);
		this.client.user?.setActivity(`@${this.client.user?.username} help 🎶`);

		const players = await this.client.storage.get('players', { type: ReferenceType.ARRAY });
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