import { CommandHandler, Flag } from 'discord-akairo';
import { Util } from 'discord.js';
import { join } from 'path';
import BoltClient from './BoltClient';
import { Playlist } from '../Database/Models';

export default class extends CommandHandler {
  public constructor(client: BoltClient) {
    super(client, {
      directory: join(__dirname, '..', '..', 'Commands'),
      prefix: [
        '🎶',
        '🎵',
        '🎼',
        '🎹',
        '🎺',
        '🎻',
        '🎷',
        '🎸',
        '🎤',
        '🎧',
        '🥁',
        (client.config.prefix as string) ?? 'b!',
      ].flat(),
      aliasReplacement: /-/g,
      allowMention: true,
      handleEdits: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      defaultCooldown: 3000,
      argumentDefaults: {
        prompt: {
          modifyStart: (_, str): string =>
            `${str}\n\nType \`cancel\` to cancel the command.`,
          modifyRetry: (_, str): string =>
            `${str}\n\nType \`cancel\` to cancel the command.`,
          timeout: 'Guess you took too long, the command has been cancelled.',
          ended:
            "More than 3 tries and you still didn't quite get it. The command has been cancelled",
          cancel: 'The command has been cancelled.',
          retries: 3,
          time: 30000,
        },
        otherwise: '',
      },
    });

    this.resolver.addType('playlist', async (message, phrase) => {
      if (!phrase) return Flag.fail(phrase);
      phrase = Util.cleanContent(phrase.toLowerCase(), message);
      const playlistRepo = client.db.getRepository(Playlist);
      const playlist = await playlistRepo.findOne({
        name: phrase,
        guild: message.guild!.id,
      });

      return playlist || Flag.fail(phrase);
    });
    this.resolver.addType('existingPlaylist', async (message, phrase) => {
      if (!phrase) return Flag.fail(phrase);
      phrase = Util.cleanContent(phrase.toLowerCase(), message);
      const playlistRepo = client.db.getRepository(Playlist);
      const playlist = await playlistRepo.findOne({
        name: phrase,
        guild: message.guild!.id,
      });

      return playlist ? Flag.fail(phrase) : phrase;
    });
  }
}
