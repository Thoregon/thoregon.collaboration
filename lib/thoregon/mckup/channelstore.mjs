/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import { ErrNoId, ErrNotFound } from "../errors.mjs";

import fs from "/fs";

class ChannelStoreMckup {

    constructor() {
        this.channels = {};
        this.load();
    }

    createChannel(channel) {
        let soul = universe.random();
        channel.id = soul;
        channel.state = 'active';
        this.channels[soul] = channel;
        this.persist();
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
        this.persist();
        return entity;
    }

    deactivateChannel(channel) {
        if (!channel.id) throw ErrNoId('channel');
        let soul = channel.id;
        let entity = this.channels[soul];
        if (!entity) throw ErrNotFound(`Channel '${soul}'`);
        entity.state = 'inactive';
        this.persist();
        return entity;
    }

    persist() {
        fs.writeFileSync('data/channelstore.json', JSON.stringify(this.channels));
    }

    load() {
        try {
            let data = fs.readFileSync('data/channelstore.json');
            this.channels = JSON.parse(data);
        } catch (ignore) { }
    }

}

if (!universe.mckup.channelstore) universe.mckup.channelstore = new ChannelStoreMckup();

export default universe.mckup.channelstore;
