import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';

@EventOptions({
	emitter: 'client',
	event: 'shardDisconnect',
	category: 'client',
})
export default class ShardDisconnect extends BoltEvent {
	public exec(event: any, id: number) {
		console.warn(
			`[SHARD ${id} DISCONNECT] Ugh...I'm sorry...but, a loss is a loss... (${event.code})`,
			event,
		);
	}
}