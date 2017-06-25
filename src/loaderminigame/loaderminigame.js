function LoaderMiniGame(parent, config) {
    var self = this;
    this.element = $('<div class="loaderminigame_wrapper"></div>');

    this.loaders = [];

    this.__initialize = function(parent, config) {
        if(typeof parent[0].loaderminigameInstance !== 'undefined') {
            console.log('already instanced, returning the loadergame instance');
            return parent[0].loaderminigameInstance;
        }

        if(parent.css('position') !== 'absolute' || parent.css('position') !== 'relative' || parent.css('position') !== 'fixed') {
            console.log('LoaderGame::initialize: Parent object must be position absolute, relative or fixed -> changing it to relative...');
            parent.css('position', 'relative');
        }
        //init logic
        this.element.css('width', '100%');
        this.element.css('height', '100%');
        this.element.css('position', 'absolute');
        this.element.css('padding', 0);
        this.element.css('margin', 0);
        this.element.css('z-index', config.zindex || 9999);
        this.element.css('background', config.background || "rgba(255, 255, 255, 0.4)");
        this.element.css('top', 0);
        this.element.css('bottom', 0);
        this.element.css('left', 0);
        this.element.css('right', 0);
        this.element.css('overflow', 'hidden');
        this.element.on('click', this.__handleClickInteraction);
        this.__addLoader();
        this.__addLoader();
        parent.append(this.element);
        parent[0].loaderminigameInstance = this;
        this.isInitialized = true;
        return this;
    };

    this.__handleClickInteraction = function(ev) {
        var mouseAngle = 0; //TODO grab mouse angle

        for(var x = 0; x < self.loaders.length; x++) {
                //@TODO stop rotation OR calculate animation velocity
            var isPassable = self.loaders[x].isPassable(mouseAngle);
            if(!isPassable) {
                console.log("not passable");
            } else {
                console.log("passable");
            }
        }
        
    };
 
    this.__addLoader = function() {
        var borders = ['NE', 'SW'];
        var scale = 1 + (this.loaders.length + 1) / 1.5;
        this.loaders.push(new Loader(this.element, config, borders, scale));
    };

    this.start = function() {
        console.log('STAAART');
    };
    this.stop = function() {
        console.log('STOOOP');
    };

    //ensure we only bind on 1 single element in this class
    return this.__initialize($($(parent)[0]), config);
}