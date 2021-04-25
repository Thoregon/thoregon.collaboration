/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import CollaborationChannelQuery from "./collaborationchannelquery.mjs";

const SecretObject = universe.everblack.SecretObject;

export default class RepliesQuery extends CollaborationChannelQuery {

    connect() {
        if (this.parent) {
            (async () => this.initMessages())();
        }
    }

    //
    // lazy init
    //

    currentItemsListenerRegistered() {
        (async () => this.initMessages())();
    }

    firstMutationListenerAdded() {
        (async () => this.initMessages())();
    }

    async initMessages() {
        if (!this.parent) return;
        let parent = this.parent;
        let messages = await parent.get("replies");
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
}
