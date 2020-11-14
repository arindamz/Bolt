import { BoltCommand, CommandOptions } from '../../Lib/Structures/BoltCommand';
import { stripIndents } from 'common-tags';
import { Message, MessageEmbed } from 'discord.js';

@CommandOptions({
	description: {
		content: 'Displays a list of available commands, or detailed information for a specified command.',
		usage: '[command]',
	},
	category: 'Core',
	clientPermissions: ['EMBED_LINKS'],
	ratelimit: 2,
	args: [
		{
			id: 'command',
			type: 'commandAlias',
		},
	],
})
export default class Help extends BoltCommand {

	public async exec(message: Message, { command }: { command: BoltCommand }) {
		// @ts-ignore
		const prefix = this.handler.prefix[0];
		if (!command) {
			const embed = new MessageEmbed().setColor(3447003).addField(
				'❯ Commands',
				stripIndents`A list of available commands.
					For additional info on a command, type \`${prefix}help <command>\`
				`,
			);

			for (const category of this.handler.categories.values()) {
				embed.addField(
					`❯ ${category.id.replace(/(\b\w)/gi, lc => lc.toUpperCase())}`,
					`${category
						.filter(cmd => cmd.aliases.length > 0)
						.map(cmd => `\`${cmd.aliases[0]}\``)
						.join(' ')}`,
				);
			}

			return message.util!.send(embed);
		}

		const embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
			.addField('❯ Description', command.description.content || '\u200b');

		if (command.aliases.length > 1) embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
		if (command.description.examples && command.description.examples.length)
			embed.addField(
				'❯ Examples',
				`\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``,
				true,
			);

		return message.util!.send(embed);
	}
}