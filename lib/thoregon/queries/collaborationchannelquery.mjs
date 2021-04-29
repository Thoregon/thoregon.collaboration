/**
 * Top entrypoint to a collaboration channel
 *
 * Replies to a message can be queried by MessageRepliesQuery
 *
 * todo [REFACTOR]
 *  - implement partitons
 *  - see crypt/index.mjs
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Query }        from "/thoregon.tru4D";
import UnifiedMessage   from "../unifiedmessage/unifiedmessage.mjs";

const SecretObject = universe.everblack.SecretObject;

export default class CollaborationChannelQuery extends Query {

    connect() {
        if (!this.channel) {
            if (this.app.channelid) {
                this.channelid = this.app.channelid;
                (async () => this.initChannel())();
            } else {
                let channelid = universe.dorifer.urlParams.channel;
                if (channelid) {
                    this.channelid = channelid;
                    (async () => this.initChannel())();
                } else {
                    // todo [OPEN]: no channel to show, let user select?
                }
            }
        }
    }

    //
    // lazy init
    //

    currentItemsListenerRegistered() {
        (async () => this.initChannel())();
    }

    firstMutationListenerAdded() {
        (async () => this.initChannel())();
    }

    async initChannel() {
        if (this.channel) return;
        if (!this.channelid) return;
        let channel = await SecretObject.at(this.channelid);
        // get the channel
        this.channel = channel;
        if (this.identity) {
            await channel.join(this.identity);
        } else {
            await channel.joinAsGhost();
        }
        let messages = await channel.get("messages");
        if (!messages) return; // so far no messages
        // first get existing items
        await messages.forEachEntry(async ({ item, key }) => {
            let um = await this.checkMessage(item, key);
            if (um) this._currentItems[key] = { store: item, item: universe.observe(um) };
        });
        // listen to changes

        // now inform listeners
        await this.propagateCurrentItems();

        messages.onChange(async (item, key) => await this.messagesModified(item, key));
    }

    async messagesModified(item, key) {
        if (this._currentItems[key]) {
            let um = await this.checkMessage(item, key);
            if (!um) return;
            // message modified
            let old = this._currentItems[key];
            Object.assign(old, um);
        } else {
            // new message
            let um = await this.checkMessage(item, key);
            if (um) {
                um = universe.observe(um);
                this._currentItems[key] = { store: item, item: um };
                await this.itemAdded(key, um);
            }
        }
    }

    async checkMessage(item, key) {
        let msg = await item.get("message");
        if (!msg) return;
        let um = UnifiedMessage.from(msg, key);
        um._ = item.node._;
        um[universe.T] = item;
        if (um.guarded()) return;   // todo: log reason, if
        return um;
    }

    get identity() {
        return universe.identity;
    }
}
