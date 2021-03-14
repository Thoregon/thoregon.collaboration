/*
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

/**
 *  MessageReaction
 *
 *  the receiver is able to react to a message.
 *
 *  @parm array {
 *    @var {user}   trigger  the user which triggered an reaction
 *    @var {string} reaction what was the reaction of the user
 *  }
 *
 *  @author: Martin Neitz
 */

class MessageReaction {
    constructor({
                    trigger,
                    reaction = "LIKE"
                } = {}) {
        Object.assign(this, { trigger, reaction });
    }
}

/**
 *
 */
class MessageAttachment {
    constructor({
                    type = "IMAGE",
                    source      // reference (pointer) to the content
                } = {}) {
        Object.assign(this, { type, source });
    }
}

/**
 * Message of any source with any content but a
 * unified interface
 */
export default class UnifiedMessage {

    constructor({
            messagetype = "TEXT",
            store,          // this is the persistent node from the store -> refactor!
            channel,
            timestamp,
            sender,
            from,
            receiver,   // TODO: will be solved on channel
            message = [],
            reactions = [],
            attachments = [],
            replies = [],
            expire,
            foreignsystems,
            parent,          // TODO: can be deleted
            vulnerability

                } = {}) {
        Object.assign(this, { messagetype, channel, timestamp, sender, from, receiver, message, reactions, attachments, expire, foreignsystems, parent, vulnerability });
/*
        this.replies = [];
        replies.forEach(item => this.replies.push(new UnifiedMessage({ parent: this, ...item })));
        this.xyz = "Servas Martin";
*/
    }

    static from(msg, key, parent) {
        let um = new this({
              key,
              message      : msg.message,
              timestamp    : new Date(msg.timestamp),
              vulnerability: msg.vulnerability,
              spam         : msg.spam,
              sender       : msg.nickname || msg.sender,
              from         : msg.from,
              ghost        : msg.ghost,
              parent
          });
        return um;
    }

    decorates(message) {
        this.message = message;
        // todo: listen to DB changes
        // Listen to identity changes
        return universe.observe(this); // return this
    }

    /**
     * tells if this unified message can by used
     */
    guarded() {
        return false;   // todo: use audittext for sanity check
    }

    addReaction(reaction) {
        this.reactions.push(reaction);
    }

    removeReaction(reaction) {

    }

    addReply(reply) {
        this.replies.push(reply);
    }

    totalReplies() {
        return this.replies.length + this.replies.reduce((accumulator, currentValue) => accumulator + currentValue.totalReplies(), 0);
    }

    /*
    * returns the age of the message in seconds
     */
    age() {
        let date = new Date( this.timestamp );
        let minutes = Date.now() - date.getTime();

        return Math.round(minutes / 1000 );
    }

    containsReaction( from, type = 'like' ) {
        return !!this.reactions.find(
            // TODO: MN - reactions contains
//            item => item.sender === 'bobB'
            item => item.from === from &&
                item.type === type
        );
    }

    get stamp() {
        return this.stampJSONFormat();
    }

    stampJSONFormat() {
        return JSON.stringify( this.timestamp ).slice(1,-1);
    }

}
