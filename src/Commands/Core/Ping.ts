import { Command, CommandOptions } from 'discord-akairo';
import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';

const RESPONSES: string[] = [
  'No.',
  'Not happening.',
  'Maybe later.',
  stripIndents`:ping_pong: Pong! \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
  stripIndents`Firepower--full force!! \`$(ping)ms\`
		Doki doki: \`$(heartbeat)ms\``,
  stripIndents`A fierce battle makes me want to eat a bucket full of rice afterwards. \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
  stripIndents`This, this is a little embarrassing... \`$(ping)ms\`
		Heartbeat: \`$(heartbeat)ms\``,
];

@ApplyOptions<CommandOptions>('ping', {
  aliases: ['ping'],
  description: {
    content: "Checks the bot's ping to the Discord servers.",
  },
  category: 'Core',
  ratelimit: 2,
})
export default class Ping extends Command {
  public async exec(message: Message): Promise<Message | Message[]> {
    const msg = await message.util!.send('Pinging...');

    return message.util!.send(
      RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
        .replace(
          '$(ping)',
          (
            (msg.editedTimestamp || msg.createdTimestamp) -
            (message.editedTimestamp || message.createdTimestamp)
          ).toString()
        )
        .replace('$(heartbeat)', Math.round(this.client.ws.ping).toString())
    );
  }
}
