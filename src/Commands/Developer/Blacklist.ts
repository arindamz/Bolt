import { BoltCommand, CommandOptions } from '../../Lib/Structures/BoltCommand';
import { Message, User } from 'discord.js';
import { SETTINGS } from '../../Lib/Utils/Constants';

@CommandOptions({
	aliases: ['unblacklist'],
	description: {
		content: 'Prohibit/Allow a user from using Bolt.',
		usage: '<user>',
		examples: ['Anish Shobith', '@Anish Shobith', '259008949427109891'],
	},
	category: 'Developer',
	ownerOnly: true,
	ratelimit: 2,
	args: [
		{
			id: 'user',
			match: 'content',
			type: 'user',
			prompt: {
				start: (message: Message) => `${message.author}, Who would you like to blacklist/unblacklist?`,
			},
		},
	],
})
export default class Blacklist extends BoltCommand {

	public async exec(message: Message, { user }: { user: User }) {
		const blacklist = this.client.settings.get('global', SETTINGS.BLACKLIST, ['']);
		if (blacklist.includes(user.id)) {
			const index = blacklist.indexOf(user.id);
			blacklist.splice(index, 1);
			if (blacklist.length === 0) this.client.settings.delete('global', SETTINGS.BLACKLIST);
			else this.client.settings.set('global', SETTINGS.BLACKLIST, blacklist);

			return message.util!.send(
				`${user.tag}, ha!...If I wore gloves, I wouldn't have to dirty my hands hitting you next time.`,
			);
		}

		blacklist.push(user.id);
		this.client.settings.set('global', SETTINGS.BLACKLIST, blacklist);

		return message.util!.send(`${user.tag}, you've let down my expectations--`);
	}
}