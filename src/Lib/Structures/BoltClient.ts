import {
  AkairoClient,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { join } from 'path';
import Storage from 'rejects';
import { Connection } from 'typeorm';
import Node from './LavalinkClient';
import CommandHandler from './CommandHandler';
import { Setting } from '../Database/Models';
import Database from '../Database/Database';
import TypeORMProvider from '../Database/SettingsProvider';

import type { ExtendedRedis } from 'lavaqueue/typings/QueueStore';

export default class BoltClient extends AkairoClient {
  public root: string;

  public db!: Connection;

  public settings!: TypeORMProvider;

  public music = new Node(this);

  public redis = this.music.queues.redis;

  public storage = new Storage(this.redis);

  public commandHandler = new CommandHandler(this);

  public inhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, '..', '..', 'Inhibitors'),
  });

  public listenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', '..', 'Events'),
  });

  public constructor(config: BoltOptions) {
    super({
      ownerID: config.owner,
      disableMentions: 'everyone',
    });
    this.root = config.root;

    this.config = config;

    process.on('unhandledRejection', (err: any) =>
      console.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack)
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private async _init() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
      lavalink: this.music,
      process,
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();

    this.db = Database.get('bolt');
    await this.db.connect();
    this.settings = new TypeORMProvider(this.db.getRepository(Setting));
    await this.settings.init();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async start() {
    await this._init();
    return this.login(this.config.token);
  }
}

declare module 'discord-akairo' {
  interface AkairoClient {
    db: Connection;
    settings: TypeORMProvider;
    music: Node;
    redis: ExtendedRedis;
    storage: Storage;
    config: BoltOptions;
  }
}

interface BoltOptions {
  owner?: string | string[];
  token?: string;
  prefix?: string | string[];
  root: string;
  lavalink: {
    id: string;
    password: string;
    hosts: {
      rest: string;
      ws: string;
      redis: string;
    };
  };
}
