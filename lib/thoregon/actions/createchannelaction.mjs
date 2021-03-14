/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import channelstore from "../mckup/channelstore.mjs"

import CollaborationAction from "./collaborationaction.mjs";

export default class CreateChannelAction extends CollaborationAction {

    async exec() {

        let channel = this.command.params;
        return this.mckupCreateChannel(channel);
    }

    createChannel(channel) {
        // channel:
        //   - new address -> channel id
        //   - create in matter
        //   - add ghost
        //   - grant write for ghost -> todo: remove later when guests exists
        //   - add to 'POC21' set -> todo: introduce ChannelSets
        return channel;
    }

    mckupCreateChannel(channel) {
        return channelstore.createChannel(channel);
    }
}
