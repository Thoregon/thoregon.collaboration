/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Action } from "/thoregon.tru4D";

export default class CollaborationAction extends Action {

    identify() {
        let sender;
        let from;
        let ghost = false;
        if (universe.identity) {
            sender = universe.identity.alias;
            from = universe.identity.pub;
        } else {
            let ghost = localStorage.getItem('POCS21Guest');
            if (!ghost) return;
            try {
                ghost           = JSON.parse(ghost);
                sender = ghost.nickname;
                from   = ghost.id
                ghost  = true;
            } catch (e) { return; }
        }

        return { sender, from, ghost };
    }
}
