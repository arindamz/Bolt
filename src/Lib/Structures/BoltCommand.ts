import { Command, CommandOptions as Options } from 'discord-akairo';

export class BoltCommand extends Command {

    public voice: boolean;

    public constructor(options?: BoltCommandOptions) {
        const name = BoltCommand.name.toLowerCase();
        super(name, { aliases: [name], ...options });
        this.voice = options?.voice ?? false;
    }
}

export const CommandOptions = (options: BoltCommandOptions = {}) => {
    return <T extends new (...args: any[]) => BoltCommand>(target: T): T => {
        return class extends target {
            constructor(...args: any[]) {
                super(options);
                void args;
            }
        }
    }
}

export interface BoltCommandOptions extends Options {
    voice?: boolean
}