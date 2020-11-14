import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';

@EventOptions({
	emitter: 'client',
	event: 'shardResume',
	category: 'client',
})
export default class ShardResumeListener extends BoltEvent {
	public exec(id: number) {
		console.log(`[SHARD ${id} RESUME] Alright, next time I'll--Eh...again...?`);
	}
}