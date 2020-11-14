import { BoltEvent, EventOptions } from '../Lib/Structures/BoltEvent';

@EventOptions({
	emitter: 'client',
	event: 'debug',
	category: 'client',
})
export default class Debug extends BoltEvent {
	public exec(event: any) {
		console.debug(`[DEBUG] ${event}`);
	}
}