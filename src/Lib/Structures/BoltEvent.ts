import { Listener, ListenerOptions } from 'discord-akairo';

export class BoltEvent extends Listener {
    public constructor(options?: ListenerOptions) {
        const { name }  = BoltEvent;
        super(name, options);
    }
}

export const EventOptions = (options?: ListenerOptions) => {
    return <T extends new(...args: any[]) => BoltEvent>(target: T): T => {
        return class extends target {
            constructor(...args: any[]) {
                super(options);
                void args;
            }
        }
    }
}