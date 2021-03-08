/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import { ErrNoId, ErrNotFound } from "../errors.mjs";

class ChannelStoreMckup {

    constructor() {
        this.channels = {};
    }

    createChannel(channel) {
        let soul = universe.random();
        channel.id = soul;
        channel.state = 'active';
        this.channels[soul] = channel;
        return channel;
    }

    getChannel(channel) {
        if (!channel.id) throw ErrNoId('channel');
        let soul = channel.id;
        let entity = this.channels[soul];
        if (!entity) throw ErrNotFound(`Channel '${soul}'`);
        return entity;
    }

    modifyChannel(channel) {
        if (!channel.id) throw ErrNoId('channel');
        let soul = channel.id;
        let entity = this.channels[soul];
        if (!entity) throw ErrNotFound(`Channel '${soul}'`);
        Object.assign(entity, channel);
        entity.state = 'active';
        return entity;
    }

    deactivateChannel(channel) {
        if (!channel.id) throw ErrNoId('channel');
        let soul = channel.id;
        let entity = this.channels[soul];
        if (!entity) throw ErrNotFound(`Channel '${soul}'`);
        entity.state = 'inactive';
        return entity;
    }

}

if (!universe.mckup.channelstore) universe.mckup.channelstore = new ChannelStoreMckup();

export default universe.mckup.channelstore;
