/**
 *
 *
 * TODO [OPEN]: authorization
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import fs from "/fs";

import { RestFull }           from "/evolux.web";

import { Command }             from "/thoregon.tru4D";
// import CreateChannelSetAction  from "../actions/createchannelsetaction.mjs";
import CreateChannelAction     from "../actions/createchannelaction.mjs";
import GetChannelAction        from "../actions/getchannelaction.mjs";
import ModifyChannelAction     from "../actions/modifychannelaction.mjs";
import DeactivateChannelAction from "../actions/deactivatechannelaction.mjs";

let created = (result) => ({ id: result });

export default class ThoregonCollaborationWebservice extends RestFull {

    connect(wwwroot, config) {
        // authrorization check
        wwwroot.isAuthorized = ({ auth }) => auth && auth.indexOf('Bearer') > -1

        // create, modify or delete channels
        this.setupChannelEndpoint(wwwroot, config);

        // relate channels with sets (or subsets)
        // this.setupChannelRelationEndpoints(wwwroot, config);

        // create, modify or delete channelsets
        // this.setupChannelsetEndpoints(wwwroot, config);

        // add or remove subsets
        // this.setupChannelSubsetEndpoints(wwwroot, config);
    }

    setupChannelEndpoint(wwwroot, config) {

        /*
         * create a chennelset for a SID
         */
        wwwroot.post('channel', async (req, res, data, utils) => {
            await this.exec(CreateChannelAction, req, res, { data, utils/*, from: created*/ });
        });

        /*
         * modify a channelset by id
         */
        wwwroot.put('channel/:id', async (req, res, data, utils) => {
            await this.exec(ModifyChannelAction, req, res, { data, utils/*, from: created*/ });
        });

        /*
         * get the channel by id
         */
        wwwroot.get('channel/:id', async (req, res, data, utils) => {
            await this.exec(GetChannelAction, req, res, { data, utils/*, from: created*/ });
        });

        /*
         * delete the channel its id
         */
        wwwroot.delete('channel/:id', async (req, res, data, utils) => {
            await this.exec(DeactivateChannelAction, req, res, { data, utils/*, from: created*/ });
        });
    }

    setupChannelRelationEndpoints(wwwroot, config) {
        /*
         * add a channel to a channelset by id
         */
        wwwroot.post('channelset/:setid/channel/:channelid', async (req, res, data, utils) => {

        });
        /*
         * add a channel to a channelset by id
         */
        wwwroot.delete('channelset/:setid/channel/:channelid', async (req, res, data, utils) => {

        });
    }

    setupChannelsetEndpoints(wwwroot, config) {
        /*
         * create a chennelset for a SID
         * Data:
         *   {
         *       "name" : "channelset1",
         *       "description":"name of the new channel set",
         *   }
         */
        wwwroot.post('channelset', async (req, res, data, utils) => {
//             await this.exec(CreateChannelSetAction, req, res, { data, utils/*, from: created*/ });
        });

        /*
         * modify a channelset by id
         */
        wwwroot.put('channelset/:setid', async (req, res, data, utils) => {

        });

        /*
         * get the channelset by name or id
         */
        wwwroot.get('channelset/:setid', async (req, res, data, utils) => {

        });

        /*
         * delete the channelset its id
         */
        wwwroot.delete('channelset/:setid', async (req, res, data, utils) => {

        });
    }

    setupChannelSubsetEndpoints(wwwroot, config) {
        /*
         * create and add a channelsubset to a channelset by id
         * Data:
         *   {
         *       "name" : "channelset1",
         *       "description":"name of the new channel set",
         *   }
         *
         */
        wwwroot.post('sid/:sid/channelset/:setid/set', async (req, res, data, utils) => {

        });

        /*
         * remove a channelsubset by id
         */
        wwwroot.delete('sid/:sid/channelset/:setid/set/:subsetid', async (req, res, data, utils) => {

        });
    }

    /*
     * perform command
     */

    async exec(action, req, res, { data, utils, to, from }) {
        this.logReq(req, data);
        let cmd = Command.with(data, {
            to: to || ((data) => ({ auth: data.auth, params: { ...data.query, ...data.content, ...data.params } })),
            action: action,
            from: from || ((result) => result)
        });
        let result = await cmd.commit();
        utils.send(result);
    }

    logReq(req, data) {
        let x = {
            url: req.url,
            headers: req.headers,
            data
        }
        fs.writeFileSync('data/collabreq.json', JSON.stringify(x));
    }
}
