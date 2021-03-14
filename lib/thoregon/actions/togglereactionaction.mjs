/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import CollaborationAction from "./collaborationaction.mjs";

export default class ToggleReactionAction  extends CollaborationAction {

    async exec() {
        let { sender, from, ghost } = this.identify();
        let reactions;
        if (this.options.parent) {
            let parent = this.options.parent[universe.T];
            reactions = await parent.get("reactions");
            if (!reactions) reactions = await parent.setSecretObject("reactions", true);

            let existing = await reactions.get(from);
            if (existing) {
                await reactions.drop(from);
            } else {
                await reactions.put(from, { type: 'like', sender, from, ghost });
            }
        }
    }
}
