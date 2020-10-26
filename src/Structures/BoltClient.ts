import { Client, ClientOptions } from 'discord.js';
import { container } from 'tsyringe';
import { QueueClient, QueueClientOptions } from './Audio/QueueClient';

export class BoltClient extends Client {

	public prefix: string;

	public audio: QueueClient;

	public constructor(options: BoltClientOptions) {
		super(options);
		this.prefix = options.prefix;
		this.audio = new QueueClient(options.audio, (guildID, packet) => {
			const guild = this.guilds.cache.get(guildID);
			return Promise.resolve(guild?.shard.send(packet));
		});
		container.registerInstance(BoltClient, this).registerInstance('BoltClient', this);
	}

}

export interface BoltClientOptions extends ClientOptions {
	prefix: string;
	audio: QueueClientOptions;
}
