function LoaderMiniGame(parent, config) {
    this.config = $.extend({
        zindex: 9999,
        background: 'rgba(255, 255, 255, 0.4)',
        loaderBorderSize: "4px",
        loaderBorderColor: "#666",
        loaderOpenBorderColor: "transparent",
        loaderAnimationTimings: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
        baseLoaderAnimationTiming: 'linear',
        baseLoaderBorders: ['NE', 'SE', 'SW'],
        baseLoaderWidth: 20,
        baseLoaderHeight: 20,
        minLoaderSpeed: 1,
        maxLoaderSpeed: 3,
    }, config);
    
    var self = this;
    this.parent = null;
    this.element = null;
    this.winPoint = null;
    this.mousePoint = null;
    this.loaders = [];

    this.__initialize = function(parent) {
        if(typeof parent[0].loaderminigameInstance !== 'undefined') {
            console.log('already instanced, returning the loadergame instance');
            return parent[0].loaderminigameInstance;
        }
        this.parent = parent;

        if($('#loaderminigame_css_injection').length === 0){
            $('body').append('<div id="loaderminigame_css_injection"><style>' +
                '@keyframes loaderminigame_spin {' +
                    '0% { transform: translate(-50%, -50%) rotate(0deg); }' +
                    '100% { transform: translate(-50%, -50%) rotate(360deg); }' +
                '}' +
                '@keyframes loaderminigame_spin_reversed {' +
                    '0% { transform: translate(-50%, -50%) rotate(360deg); }' +
                    '100% { transform: translate(-50%, -50%) rotate(0deg); }' +
                '}' +
            '</style></div>');
        }
        if(parent.css('position') !== 'absolute' && parent.css('position') !== 'relative' && parent.css('position') !== 'fixed') {
            console.log('LoaderGame::initialize: Parent object must be position absolute, relative or fixed -> changing it to relative...');
            parent.css('position', 'relative');
        }
        //init logic
        this.element = $('<div class="loaderminigame_wrapper"></div>');
        this.element.css('width', '100%');
        this.element.css('height', '100%');
        this.element.css('position', 'absolute');
        this.element.css('padding', 0);
        this.element.css('margin', 0);
        this.element.css('z-index', this.config.zindex);
        this.element.css('background', this.config.background);
        this.element.css('top', 0);
        this.element.css('bottom', 0);
        this.element.css('left', 0);
        this.element.css('right', 0);
        this.element.css('overflow', 'hidden');
        this.element.on('click', this.__handleClickInteraction);
        this.element.on('mousemove', this.__handleMouseMove);

        this.winPoint = $('<div class="loaderminigame_win"></div>');
        this.winPoint.css('width', '0px');
        this.winPoint.css('height', '0px');
        this.winPoint.css('border', '1px solid ' + this.config.loaderBorderColor);
        this.winPoint.css('position', 'absolute');
        this.winPoint.css("border-radius", '50%');
        this.winPoint.css('padding', 0);
        this.winPoint.css('margin', 0);
        this.winPoint.css('top', '50%');
        this.winPoint.css('left', '50%');
        this.winPoint.css("transform", 'translate(-50%, -50%)');
        this.element.append(this.winPoint);
        
        this.mousePoint = $('<div class="loaderminigame_win"></div>');
        this.mousePoint.css('width', '4px');
        this.mousePoint.css('height', '4px');
//        this.mousePoint.css('border', '1px solid red');
        this.mousePoint.css('position', 'absolute');
        this.mousePoint.css("border-radius", '50%');
        this.mousePoint.css('background', 'red');
        this.mousePoint.css('padding', 0);
        this.mousePoint.css('margin', 0);
        this.mousePoint.css('top', '50%');
        this.mousePoint.css('left', '50%');
        this.mousePoint.css("transform", 'translate(-50%, -50%)');
        this.element.append(this.mousePoint);
        
        this.__addLoader();
//        this.__addLoader();
//        this.__addLoader();
        parent.append(this.element);
        parent[0].loaderminigameInstance = this;
        this.isInitialized = true;
        return this;
    };

    this.__handleMouseMove = function(ev) {
        var radians = self.__getCurrentMouseRadians(ev);
        var scale = self.__getNextLoaderScale();
        var offsetX = (self.config.baseLoaderWidth * scale + 10) * Math.cos(radians) * -1 / 2;
        var offsetY = (self.config.baseLoaderHeight * scale + 10) * Math.sin(radians) * -1 / 2;
        self.mousePoint.css('left', (self.winPoint.position().left + offsetX) + 'px');
        self.mousePoint.css('top', (self.winPoint.position().top + offsetY) + 'px');
    };

    this.__handleClickInteraction = function(ev) {
        self.stop();
        var mouseAngle = self.__getCurrentMouseAngle(ev); //TODO grab mouse angle
        var lastLoaderHit = null;
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
//            loader.pause();
            var isPassable = loader.isPassable(mouseAngle);
            if(!isPassable) {
                lastLoaderHit = self.loaders[x];
            }
        }
        if(!lastLoaderHit) {
            self.mousePoint.animate({
                top: self.winPoint.position().top + 1,
                left: self.winPoint.position().left + 1,
            }, 1000 );
            self.winPoint.animate({
                    width: 10,
                    height: 10,
                }, 
                1000,
                'linear',
                function(){
                    self.winPoint.animate({
                        width: 0,
                        height: 0,
                    }, 1000, 'linear');
                    self.__addLoader();
                    self.start();
                }
            );
        } else {
            //@TODO animate path to loader hit
            self.__removeOutestLoader();
            self.start();
        }
    };

    this.__getCurrentMouseRadians = function(ev) {
        var y2 = ev.clientY;
        var x2 = ev.clientX;
        var baseRect = self.winPoint[0].getBoundingClientRect();
        var y1 = baseRect.top + (self.winPoint.height()/2);
        var x1 = baseRect.left + (self.winPoint.width()/2);
        var radians = Math.atan2(y1 - y2, x1 - x2);
        if ( radians < 0 ) {
            radians += (2 * Math.PI);
        }
        return radians;
    };

    this.__getCurrentMouseAngle = function(ev) {
        var radians = self.__getCurrentMouseRadians(ev);
        var mouseAngle = Math.round( radians * (180/Math.PI));
        mouseAngle = mouseAngle - 90;
        if(mouseAngle < 0) {
            mouseAngle = 360 + mouseAngle;
        }
        return mouseAngle;
    };

    this.__addLoader = function() {
        if(this.loaders.length === 0) {
            this.loaders.push(new Loader(this.element, this.config, this.config.baseLoaderBorders, this.__getNextLoaderScale(), this.config.baseLoaderAnimationTiming));
            return;
        }
        var borders = ['NE', 'SE', 'SW', 'NW'];
        var removeBordersCount = Math.floor(Math.random() * 3) + 1;
        for(var i = 0; i<removeBordersCount;i++){
            borders.splice(Math.floor(Math.random()*borders.length), 1);
        }
        this.loaders.push(new Loader(this.element, this.config, borders, this.__getNextLoaderScale()));
    };

    this.__removeOutestLoader = function() {
        if(this.loaders.length > 1) {
            var loaderToRemove = this.loaders.splice( this.loaders.length - 1, 1 )[0];
            loaderToRemove.destroy();
        }
    };

    this.__getNextLoaderScale = function() {
        return 1 + (this.loaders.length + 1) / 1.5;
    };

    this.start = function() {
        this.element.unbind('click');
        this.element.unbind('mousemove');
        this.element.on('click', this.__handleClickInteraction);
        this.element.on('mousemove', this.__handleMouseMove);
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
            loader.resume();
        }
    };
    this.stop = function() {
        this.element.unbind('click');
        this.element.unbind('mousemove');
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
            loader.pause();
        }
    };
    this.destroy = function(options) {
        if(typeof options !== 'object') {
            options = {duration: 'fast'};
        }
        var userCb = null;
        if(typeof options.always === 'function') {
            userCb = options.always;
        }
        options.always = function(){
            if(userCb){
                userCb.apply(arguments);
            }
            self.parent[0].loaderminigameInstance = undefined;
            self.element.remove();
        };
        self.element.fadeOut(options);
    };

    //ensure we only bind on 1 single element in this class
    return this.__initialize($($(parent)[0]));
}