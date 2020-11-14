import { ConnectionManager } from 'typeorm';
import { Playlist, Setting } from '../Models';

const connectionManager = new ConnectionManager();
connectionManager.create({
    name: 'bolt',
    type: 'postgres',
    url: '',
    entities: [Setting, Playlist]
});

export default connectionManager;