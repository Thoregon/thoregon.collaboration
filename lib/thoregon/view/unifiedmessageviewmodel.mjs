/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { ViewModel } from "/thoregon.aurora"
// import { app }       from "./repo.mjs";

export default class UnifiedMessageViewmodel extends ViewModel {
    // this.east -> view
    // this.west -> model

    constructor(options) {
        super(options);
        this.reply           = '';
        this.repliesLoaded   = false;
        this.repliesexpanded = false;
        this.avatar          = 'img/POCS-2021-150x150.jpg';
        this.reactions       = []; // todo [REFACTOR]: use object with identity key
        this.replies         = [];
    }

    initModelMapping() {
        universe.Identity.on('auth', (evt) => this.identityChanged(evt.payload));
        universe.Identity.on('leave', (evt) => this.identityChanged(evt.payload));
        this.west.model.addEventListener('changed', (evt) => this.propertyChanged(evt));
        this.startAging();
        this.connectReactions();
    }

    propertyChanged(evt) {

    }

    identityChanged(identity) {
        this.east.identityChanged(identity);
    }

    // todo -> move to AuroraCollection
    async connectReplies() {
        let repliesQuery = this.east.repliesQuery;
        let app = universe.uirouter.app;
        let parent = this.west.model[universe.T]; // todo
        let Query = app.getQuery(repliesQuery);
        if (!Query) {
            console.log(`AuroraCollection: Query '${repliesQuery}' not found.`);
            return;
        }
        let query = Query.withParent(app);
        this.query = query;
        // todo: entity ref from url router, parent if exists

        query.addCurrentItemsHandler((items) => this.initialItems(items));
        query.connect();
    }

    // todo -> introduce AuroraCollectionInfo (or extend AuroraCollection with sumary)
    async connectReactions() {
        let reactionsQuery = this.east.reactionsQuery;
        let app = universe.uirouter.app;
        let parent = this.west.model[universe.T]; // todo
        let Query = app.getQuery(reactionsQuery);
        if (!Query) {
            console.log(`AuroraCollection: Query '${repliereactionsQuerysQuery}' not found.`);
            return;
        }
        let query = Query.withParent(parent);
        this.query = query;
        // todo: entity ref from url router, parent if exists

        query.addCurrentItemsHandler((items) => this.initialItems(items));
        query.connect();
    }

    async initialItems(items) {
        this.reactionitems = items;
        this.reactions = Object.values(items);    // todo: create new objects?
        this.query.addMutationListener(async (mutation) => await this.mutated(mutation));
        this.east.updateLikes();
    }

    async mutated(mutation) {
        if (mutation.type === 'new')    await this.addItem(mutation.item, mutation.id);
        if (mutation.type === 'remove') await this.removeItem(mutation.id, mutation.old);
    }

    addItem(item, id) {
        if (this.reactionitems[id]) return;
        this.reactions = Object.values(this.reactionitems);
        this.east.view.updateLikes();
    }

    removeItem(id, old) {
        if (!this.reactionitems[id]) return;
        delete this.reactionitems[id];
        this.reactions = Object.values(this.reactionitems);
        this.east.view.updateLikes();
    }
/*

    get reactions() {
        return [];
    }



    get replies() {
        // get the query from the
        return [];
    }
*/

    reactionsChanged() {
        this.east.reactionChanged();
    }

    containsReaction( from, type ) {
        return this.west.model.containsReaction( from, type );
    }

    viewmodeltest() {
        debugger;
    }

    age() {
        return this.west.model.age();
    }

    startAging() {
        setTimeout( () => this.agingPuls() , this.agingInterval() );
    }

    agingInterval() {
        let age = this.age();
        let intervals = [
            { age: 10,      interval: 1 },      // until 10 seconds
            { age: 60,      interval: 5 },      // until 60 seconds
            { age: 3600,    interval: 60 },     // until 1  hour
            { age: 86400,   interval: 3600 },   // until 1  day
            { age: 2592000, interval: 86400 },  // until 1  month
        ]

        for (let i = 0; i < intervals.length; ++i) {
            let interval = intervals[i];
            if ( age < interval.age ) { return interval.interval * 1000; }
        }
        return 2592000 * 1000;
    }

    agingPuls() {
        if (this.east.updateAge) {
            this.startAging();
            this.east.updateAge();
        }
    }

    ageFormated() {
        let SECONDS = 1;
        let MINUTE = 60 * SECONDS;
        let HOUR   = 60 * MINUTE;
        let DAY    = 24 * HOUR;
        let MONTH  = 30 * DAY;

        let delta = this.age();

        if ( delta < 1 * MINUTE ) {
            return  ( delta === 1 )
                ? { age: delta, display: 'one_second_ago' }
                : { age: delta, display: 'seconds_ago'};
        }

        if ( delta < 2  * MINUTE ) return { age: Math.floor(delta / MINUTE), display: 'a_minute_ago' };

        if ( delta < 45 * MINUTE ) return { age: Math.floor(delta / MINUTE), display: 'minutes_ago' };

        if ( delta < 90 * MINUTE ) return { age: Math.floor(delta / HOUR), display: 'an_hour_ago' };
        if ( delta < 24 * HOUR )   return { age: Math.floor(delta / HOUR), display: 'hours_ago' };

        if ( delta < 48 * HOUR )   return { age: Math.floor(delta / DAY), display: 'yesterday'};
        if ( delta < 30 * DAY )    return { age: Math.floor(delta / DAY), display: 'days_ago' };

        if ( delta < 12 * MONTH )  {
            let months = Math.floor( delta / DAY / 30 );
            return  ( months <= 1 )
                ? { age: months, display: 'one_month_ago' }
                : { age: months, display: 'months_ago' };
        } else {
            let years = Math.floor ( delta / DAY / 365 );
            return  ( years <= 1 )
                ? { age: years, display: 'one_year_ago' }
                : { age: years, display: 'years_ago' };
        }
    }


    totalReplies() {
        return this.replies.length;
    }

    showComments( displayStatus, level ) {

        //--- todo: check if the collection is filled already
        let replies = this.west.model.replies;

/*
        if ( ! this.repliesLoaded ) {
            this.repliesLoaded   = true;
            this.repliesexpanded = true;

            replies.forEach(reply => {
                let unifiedMessage = universe.observe(reply);
                let message        = reply.message;

//            let channel = reply.channel

                let elem   = document.createElement('aurora-comment');
                let avatar = "img/PROFILE_BL.jpg";

                elem.setAttribute('replies_expanded', true);
                elem.setAttribute('level', level + 1);

                if (universe.identity.alias === unifiedMessage.sender) elem.setAttribute('sent', '');
                elem.setAttribute('label', 'a');
                elem.setAttribute('name', unifiedMessage.sender);
                if (reply.sender == 'bobB') {
                    avatar = "img/PROFILE_MN.jpg";
                }
                elem.setAttribute('avatar', avatar);
                elem.setAttribute('stamp', unifiedMessage.timestamp);
                elem.setAttribute('messages', `['${message}']`);
                // elem.setViewModel(new UnifiedMessageViewmodel(message, elem));
                elem.addEventListener('exists', () => UnifiedMessageViewmodel.with({
                                                                                       model : unifiedMessage,
                                                                                       view  : elem,
                                                                                       parent: this
                                                                                   }));

                this.east.showReply(elem);
            })
        }
*/
    }

    /*
     * commands and actions
     */

    async commitReply() {
        // send add comment command
        if (!this.reply) return;
        let from = this.from();
        if (!from) return;
        let cmd = {
            name: 'addreply',
            from: from.pub || from.id,
            sender: from.alias || from.nickname,
            reply : this.reply,
            unifiedmessage: this.west.model,
        }
        await this.exec(cmd, { parent: this.west.model });
    }

    async commitReaction() {
        // send add comment command
        let from = this.from();
        if (!from) return;
        let cmd = {
            name: 'togglereaction',
            from: from.pub || from.id,
            sender: from.alias || from.nickname,
            unifiedmessage: this.west.model,
        }
        await this.exec(cmd, { parent: this.west.model });
    }

    from() {
        let guest =localStorage.getItem("POCS21Guest");
        return universe.identity || (guest ? JSON.parse(guest) : undefined) ;
    }

    get repliesLoaded() {
        return this._repliesloaded;
    }

    set repliesLoaded(repliesloaded) {
        this._repliesloaded = repliesloaded;
    }

    /*
     * perform
     */

    async exec(command, options) {
        universe.dorifer.uirouter.app.exec(command, options);
    }

}
