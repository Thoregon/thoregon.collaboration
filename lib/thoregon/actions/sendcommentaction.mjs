/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import CollaborationAction from "./collaborationaction.mjs";

export default class SendCommentAction  extends CollaborationAction {

    async exec() {
        let text = this.command.message;
        text = text.replace(/\n$/, '');  // remove trailing newline
        let umessage = {
            timestamp: new Date().getTime(),
            message: text,
            vulnerability: 0,
            spam: false,
        };

        if (me) {
            umessage.sender = me.alias;
            umessage.from = me.spub;
        } else {
            let ghost = localStorage.getItem('POCS21Guest');
            if (!ghost) return;
            try {
                ghost           = JSON.parse(ghost);
                umessage.sender = ghost.nickname;
                umessage.from   = ghost.id
                umessage.ghost  = true;
            } catch (e) { return; }
        }
        let messages;
        if (this.options.parent) {
            let parent = this.options.parent[universe.T];
            messages = await parent.get("replies");
            if (!messages) messages = await parent.setSecretObject("replies", true);
        } else {
            let channel = this.options.channel;
            messages = await channel.get("messages");
            if (!messages) messages = await channel.setSecretObject("messages", true);
        }

        let { key, item } = await messages.addSecretObject();

        let smessage = item;
        await smessage.put("message", umessage);
        await smessage.setSecretObject("reactions", true);
        await smessage.setSecretObject("replies", true);
        this.result = { key, item };

        return this.result;
    }
}
