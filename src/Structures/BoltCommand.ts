import { Message, Permissions, PermissionResolvable } from 'discord.js';

import type { BoltClient } from './BoltClient';

export abstract class BoltCommand implements BoltCommandOptions {

	public client: BoltClient;

	public name!: string;

	public aliases: BoltCommandOptions['aliases'];

	public description: BoltCommandOptions['description'];

	public botPerms: BoltCommandOptions['botPerms'];

	public userPerms: BoltCommandOptions['userPerms'];

	public constructor(client: BoltClient, options: BoltCommandOptions) {
		this.client = client;
		this.name = options.name;
		this.aliases = options.aliases ?? [];
		this.description = options.description ?? 'No description provided';
		this.botPerms = new Permissions().freeze();
		this.userPerms = new Permissions().freeze();
	}

	abstract run(message: Message, args: unknown[]): any[];

}

export interface BoltCommandOptions {
	name: string;
	aliases?: string[];
	description?: string;
	botPerms?: PermissionResolvable;
	userPerms?: PermissionResolvable;
}

