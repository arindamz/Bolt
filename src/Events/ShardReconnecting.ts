import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';

@EventOptions({
	emitter: 'client',
	event: 'shardReconnecting',
	category: 'client',
})
export default class ShardReconnect extends BoltEvent {
	public exec(id: number) {
		console.log(`[SHARD ${id} RECONNECTING] Firepower--full force!!`);
	}
}