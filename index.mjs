/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThoregonCollaborationWebservice from "./lib/thoregon/web/thoregoncollaborationwebservice.mjs";

export const thoregonCollaborationWebservice = new ThoregonCollaborationWebservice()
    .addTerminalRoot('collaboration')
    .start();

export { default as CollaborationChannelQuery } from "./lib/thoregon/queries/collaborationchannelquery.mjs";

