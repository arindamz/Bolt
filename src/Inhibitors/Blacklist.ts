import { Inhibitor, InhibitorOptions } from 'discord-akairo';
import { Message } from 'discord.js';
import { SETTINGS } from '../Lib/Utils/Constants';
import { ApplyOptions } from '../Lib/Utils/ApplyOptions';
@ApplyOptions<InhibitorOptions>('blacklist', {
  reason: 'blacklist',
})
export default class BlacklistInhibitor extends Inhibitor {
  public exec(message: Message) {
    const blacklist = this.client.settings.get('global', SETTINGS.BLACKLIST, [
      '',
    ]);
    return blacklist.includes(message.author.id);
  }
}
