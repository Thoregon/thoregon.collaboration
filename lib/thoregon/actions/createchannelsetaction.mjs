/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import CollaborationAction from "./collaborationaction.mjs";
import { doAsync }         from "/evolux.universe";

export default class CreateChannelSetAction extends CollaborationAction {

    async exec() {
        await doAsync();
        console.log(JSON.stringify(this.command));
        let soul = universe.random();
        return soul;
    }

}
