/*global Loader */
/**
 * The LoaderMiniGame.
 * @param {JqueryObject or Selector} parent - if a selector is provided only the first match will be used.
 * @param {Object} config
 * @returns {LoaderMiniGame}
 */
function LoaderMiniGame(parent, config) {
    this.config = $.extend({
        zindex: 9999,
        background: 'rgba(255, 255, 255, 0.4)',
        loaderBorderSize: "4px",
        loaderBorderColor: "#666",
        loaderOpenBorderColor: "transparent",
        loaderAnimationTimings: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
        baseLoaderCount: 1,
        baseLoaderAnimationTiming: 'linear',
        baseLoaderBorders: ['NE', 'SE', 'SW'],
        baseLoaderWidth: 20,
        baseLoaderHeight: 20,
        minLoaderSpeed: 1,
        maxLoaderSpeed: 3
    }, config);
    
    var self = this;
    this.parent = null;
    this.element = null;
    this.winPoint = null;
    this.mousePoint = null;
    this.loaders = [];

    /**
     * Constructor.
     * @param {JQuery Object} parent
     * @returns {undefined}
     */
    this.__initialize = function(parent) {
        if(typeof parent[0].loaderminigameInstance !== 'undefined') {
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
            console.log('LoaderMiniGame::initialize: Parent object must be position absolute, relative or fixed -> changing it to relative...');
            parent.css('position', 'relative');
        }

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
        this.mousePoint.css('position', 'absolute');
        this.mousePoint.css("border-radius", '50%');
        this.mousePoint.css('background', 'red');
        this.mousePoint.css('padding', 0);
        this.mousePoint.css('margin', 0);
        this.mousePoint.css('top', '50%');
        this.mousePoint.css('left', '50%');
        this.mousePoint.css("transform", 'translate(-50%, -50%)');
        this.element.append(this.mousePoint);

        for(var i=0; i<this.config.baseLoaderCount; i++) {
            this.__addLoader();
        }
        parent.append(this.element);
        parent[0].loaderminigameInstance = this;
    };

    /**
     * Cursor movement handler.
     * Places the 'MousePoint' dot at the right angle.
     * @param {Event} ev
     * @returns {undefined}
     */
    this.__handleMouseMove = function(ev) {
        var radians = self.__getCurrentCursorRadians(ev);
        var scale = self.__getNextLoaderScale();
        var offsetX = (self.config.baseLoaderWidth * scale + 10) * Math.cos(radians) * -1 / 2;
        var offsetY = (self.config.baseLoaderHeight * scale + 10) * Math.sin(radians) * -1 / 2;
        self.mousePoint.css('left', (self.winPoint.position().left + offsetX) + 'px');
        self.mousePoint.css('top', (self.winPoint.position().top + offsetY) + 'px');
    };

    /**
     * Click interaction handler.
     * Validates if the current click can pass to the target or not.
     * If all loaders are passable the victory animation is shown and another 
     * loader will be added to the game. If not the outest loader will be removed.
     * @param {Event} ev
     * @returns {undefined}
     */
    this.__handleClickInteraction = function(ev) {
        self.__stop();
        var mouseAngle = self.__getCurrentCursorAngle(ev);
        var lastLoaderHit = null;
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
            var isPassable = loader.isPassable(mouseAngle);
            if(!isPassable) {
                lastLoaderHit = self.loaders[x];
            }
        }
        if(!lastLoaderHit) {
            self.mousePoint.animate({
                top: self.winPoint.position().top + 1,
                left: self.winPoint.position().left + 1
            }, 1000 );
            self.winPoint.animate({
                    width: 10,
                    height: 10
                }, 
                1000,
                'linear',
                function(){
                    self.winPoint.animate({
                        width: 0,
                        height: 0
                    }, 500, 'linear');
                    self.__addLoader();
                    self.__start();
                }
            );
        } else {
            self.__removeOutestLoader(function() {
                self.__start();
            });
        }
    };

    /**
     * Returns the rotation of the events cursor position in radians.
     * @param {Event} ev
     * @returns {Number}
     */
    this.__getCurrentCursorRadians = function(ev) {
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

    /**
     * Returns the rotation of the events cursor position in degrees.
     * Performs normalization logic so that 0° is in the north.
     * @param {Event} ev
     * @returns {Number}
     */
    this.__getCurrentCursorAngle = function(ev) {
        var radians = self.__getCurrentCursorRadians(ev);
        var mouseAngle = Math.round( radians * (180/Math.PI));
        mouseAngle = mouseAngle - 90;
        if(mouseAngle < 0) {
            mouseAngle = 360 + mouseAngle;
        }
        return mouseAngle;
    };

    /**
     * Adds another loader to the game.
     * New loaders will be sized by <this.__getNextLoaderScale> and will have
     * at least 1 border but at maximum 3 borders.
     * If the <config.baseLoaderCount> is not reached the loader to be added will
     * have the <config.baseLoader%> properties.
     * @returns {undefined}
     */
    this.__addLoader = function() {
        if(this.loaders.length < this.config.baseLoaderCount) {
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

    /**
     * Removes the outest loader by calling its destroy method.
     * Will not remove any loader if the <config.baseLoaderCount> would
     * be undershot by this action.
     * @param {Function} callback
     * @returns {undefined}
     */
    this.__removeOutestLoader = function(callback) {
        if(this.loaders.length > this.config.baseLoaderCount) {
            var loaderToRemove = this.loaders.splice( this.loaders.length - 1, 1 )[0];
            loaderToRemove.destroy(callback);
        } else {
            callback();
        }
    };

    /**
     * Returns the next loader scale depending on the currently active loaders.
     * @returns {Number}
     */
    this.__getNextLoaderScale = function() {
        return 1 + (this.loaders.length + 1) / 1.5;
    };

    /**
     * Binds the user interaction events.
     * @returns {undefined}
     */
    this.__bindUserControlls = function() {
        this.__unbindUserControlls();
        this.element.on('click', this.__handleClickInteraction);
        this.element.on('mousemove', this.__handleMouseMove);
    };

    /**
     * Unbinds the user interaction events.
     * @returns {undefined}
     */
    this.__unbindUserControlls = function() {
        this.element.unbind('click');
        this.element.unbind('mousemove');
    };

    /**
     * Starts the loader game by binding the user controlls and resuming all loaders.
     * @returns {undefined}
     */
    this.__start = function() {
        this.__bindUserControlls();
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
            loader.resume();
        }
    };

    /**
     * Stops the loader game by unbinding the user controlls and pausing all loaders.
     * @returns {undefined}
     */
    this.__stop = function() {
        this.__unbindUserControlls();
        for(var x = 0; x < self.loaders.length; x++) {
            var loader = self.loaders[x];
            loader.pause();
        }
    };

    /**
     * Removes the loaderminigame completely with DOM element.
     * @returns {undefined}
     */
    this.remove = function() {
        self.parent[0].loaderminigameInstance = undefined;
        self.element.remove();
    };

    /**
     * Destroys the loaderminigame instance by fading out and removing the
     * DOM element.
     * @param {Object} options - see http://api.jquery.com/fadeout/#fadeOut-options
     * @returns {undefined}
     */
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
            self.remove();
        };
        self.element.fadeOut(options);
    };

    //ensure we only bind on 1 single element in this class
    if(typeof $(parent)[0] === 'undefined') {
        throw "No object to bind the loaderminigame.";
    }
    this.__initialize($($(parent)[0]));
}
/*exported LoaderMiniGame */