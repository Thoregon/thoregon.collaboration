/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import channelstore from "../mckup/channelstore.mjs"

import CollaborationAction from "./collaborationaction.mjs";

export default class ModifyChannelAction extends CollaborationAction {

    async exec() {
        let channel = this.command.params;
        return channelstore.modifyChannel(channel);
    }
}
