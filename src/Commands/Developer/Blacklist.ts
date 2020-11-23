import { Command, CommandOptions } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { SETTINGS } from '../../Lib/Utils/Constants';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';
import { floatPromise } from '../../Lib/Utils/floatPromise';
@ApplyOptions<CommandOptions>('blacklist', {
  aliases: ['blacklist', 'unblacklist'],
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
        start: (message: Message) =>
          `${message.author}, Who would you like to blacklist/unblacklist?`,
      },
    },
  ],
})
export default class Blacklist extends Command {
  public async exec(message: Message, { user }: { user: User }) {
    const blacklist = this.client.settings.get('global', SETTINGS.BLACKLIST, [
      '',
    ]);
    if (blacklist.includes(user.id)) {
      const index = blacklist.indexOf(user.id);
      blacklist.splice(index, 1);
      if (blacklist.length === 0)
        floatPromise(
          { client: this.client },
          this.client.settings.delete('global', SETTINGS.BLACKLIST)
        );
      else
        floatPromise(
          { client: this.client },
          this.client.settings.set('global', SETTINGS.BLACKLIST, blacklist)
        );

      return message.util!.send(
        `${user.tag}, ha!...If I wore gloves, I wouldn't have to dirty my hands hitting you next time.`
      );
    }

    blacklist.push(user.id);
    floatPromise(
      { client: this.client },
      this.client.settings.set('global', SETTINGS.BLACKLIST, blacklist)
    );

    return message.util!.send(`${user.tag}, you've let down my expectations--`);
  }
}
