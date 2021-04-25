/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Query }        from "/thoregon.tru4D";
// import UnifiedMessage   from "../entities/unifiedmessage.mjs";

const SecretObject = universe.everblack.SecretObject;

export default class ReactionsQuery extends Query {
    connect() {
        if (this.parent) {
            (async () => this.initReactions())();
        }
    }
    //
    // lazy init
    //

    currentItemsListenerRegistered() {
        (async () => this.initReactions())();
    }

    firstMutationListenerAdded() {
        (async () => this.initReactions())();
    }

    async initReactions() {
        if (!this.parent) return;
        let parent = this.parent;
        let messages = await parent.get("reactions");
        if (!messages) return; // so far no messages
        // first get existing items
        await messages.forEachEntry(async ({ item, key }) => {
            let reaction = {  };
            if (reaction) this._currentItems[key] = { store: item, item: universe.observe(reaction) };
        });
        // listen to changes

        // now inform listeners
        await this.propagateCurrentItems();

        messages.onChange(async (item, key) => await this.messagesModified(item, key));
    }

    async messagesModified(item, key) {
        if (this._currentItems[key]) {
            let reaction = {};
            if (!reaction) return;
            // message modified
            let old = this._currentItems[key];
            Object.assign(old, reaction);
        } else {
            // new message
            let reaction = {};
            if (reaction) {
                // um = universe.observe(um);
                this._currentItems[key] = { store: item, item: reaction };
                await this.itemAdded(key, reaction);
            }
        }
    }

}
