(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('loaderminigame', ["jquery"], function (a0) {
      return (root['$'] = factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root['$'] = factory(root["jQuery"]);
  }
}(this, function ($) {

/*!loaderminigame - v0.0.1 - 2017-07-04 */
function Loader(parent, config, borders, scale, animationTiming, animationDuration) {
    this.config = $.extend({
        loaderBorderSize: "4px",
        loaderBorderColor: "#666",
        loaderOpenBorderColor: "transparent",
        loaderAnimationTimings: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
        baseLoaderBorders: ['NE', 'SE', 'SW'],
        baseLoaderWidth: 20,
        baseLoaderHeight: 20,
        minLoaderSpeed: 1,
        maxLoaderSpeed: 3,
    }, config);

    this.element = null;
    this.blockedRanges = [];

    this.scale = scale|| 1.0;
    this.borders = borders || ['NE', 'SE', 'SW'];
    this.animationDuration = animationDuration || (Math.random() * (this.config.maxLoaderSpeed - this.config.minLoaderSpeed) + this.config.minLoaderSpeed)+"s";
    this.animationTimings = this.config.loaderAnimationTimings || ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
    this.animationTiming = animationTiming || this.animationTimings[Math.floor(Math.random()*this.animationTimings.length)];
    this.animations = ['loaderminigame_spin_reversed','loaderminigame_spin'];

    /**
     * Constructor.
     * @returns {undefined}
     */
    this.__initialize = function() {
        this.element = $('<div class="loaderminigame_loader"></div>');
        this.element.hide();
        this.element.css("position", 'absolute');
        this.element.css("top", '50%');
        this.element.css("left", '50%');
        this.element.css("border", this.config.loaderBorderSize + " solid " + this.config.loaderOpenBorderColor);
        this.element.css("border-radius", '50%');
        this.element.css("width", this.config.baseLoaderWidth*scale);
        this.element.css("height", this.config.baseLoaderHeight*scale);
        this.element.css("transform", 'translate(-50%, -50%)');
        this.element.css("animation", this.animations[Math.floor(Math.random()*this.animations.length)] + ' ' + this.animationDuration + ' ' + this.animationTiming + ' infinite');
        for(var x = 0; x < this.borders.length; x++) {
            switch(this.borders[x]) {
                case 'NE':
                    this.element.css("border-top", this.config.loaderBorderSize + " solid " + this.config.loaderBorderColor);
                    this.blockedRanges.push([0, 90]);
                    break;
                case 'SE':
                    this.element.css("border-right", this.config.loaderBorderSize + " solid " + this.config.loaderBorderColor);
                    this.blockedRanges.push([90, 180]);
                    break;
                case 'SW':
                    this.element.css("border-bottom", this.config.loaderBorderSize + " solid " + this.config.loaderBorderColor);
                    this.blockedRanges.push([180, 270]);
                    break;
                case 'NW':
                    this.element.css("border-left", this.config.loaderBorderSize + " solid " + this.config.loaderBorderColor);
                    this.blockedRanges.push([270, 360]);
                    break;
            }
        }
        $(parent).append(this.element);
        this.element.fadeIn("slow");
    };

    /**
     * Checks whether the loader is passable from an angle between 0-360°.
     * @param {number} passableFromAngle
     * @returns {Boolean}
     */
    this.isPassable = function(passableFromAngle) {
        var currentRotation = this.getCurrentRotation();
        for(var x = 0; x < this.blockedRanges.length; x++) {
            var blockLeftAngle = this.blockedRanges[x][0] + currentRotation;
            if(blockLeftAngle >= 360) {
                blockLeftAngle = blockLeftAngle - 360;
            }
            var blockRightAngle = this.blockedRanges[x][1] + currentRotation;
            if(blockRightAngle >= 360) {
                blockRightAngle = blockRightAngle - 360;
            }
            //console.log("blockLeftAngle: " + blockLeftAngle, "blockRightAngle: " + blockRightAngle, "passableFromAngle: " + passableFromAngle)
            if(passableFromAngle >= blockLeftAngle) {
                if(blockLeftAngle > blockRightAngle) {
                    //happens if blockRightAngle is >360 and restarts with 0,
                    //but we already know that mouse pos is greater than the left
                    //angle so we know at this point that we've hit a "wall"
                    return false;
                }
                if (passableFromAngle < blockRightAngle) {
                    //between left and right bounds, it's a hit
                    return false;
                }
            }
            if(passableFromAngle <= blockRightAngle) {
                if(blockLeftAngle > blockRightAngle) {
                    //happens if blockRightAngle is >360 and restarts with 0,
                    //but we already know that mouse pos is smaler than the right
                    //angle so we know at this point that we've hit a "wall"
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Pauses the loading transition at the current keyframe.
     * @returns {undefined}
     */
    this.pause = function() {
        this.element.css('-webkit-animation-play-state', 'paused');
        this.element.css('-moz-animation-play-state', 'paused');
        this.element.css('-ms-animation-play-state', 'paused');
        this.element.css('-o-animation-play-state', 'paused');
        this.element.css('animation-play-state', 'paused');
    };

    /**
     * Resumes the loading transition from the current keyframe.
     * @returns {undefined}
     */
    this.resume = function() {
        this.element.css('-webkit-animation-play-state', 'running');
        this.element.css('-moz-animation-play-state', 'running');
        this.element.css('-ms-animation-play-state', 'running');
        this.element.css('-o-animation-play-state', 'running');
        this.element.css('animation-play-state', 'running');
    };

    /**
     * Destroys the loader element by showing its fadeout animation 
     * and removing the element from the DOM.
     * @param {function} callback
     * @returns {undefined}
     */
    this.destroy = function(callback) {
        var self = this;
        var stepDuration = 250;
        self.element.animate({
                opacity: 0,
            }, 
            stepDuration,
            'swing',
            function(){
                self.element.animate({
                        opacity: 0.8,
                    }, 
                    stepDuration,
                    'swing',
                    function(){
                        self.element.animate({
                                opacity: 0,
                            }, 
                            stepDuration,
                            'swing',
                            function(){
                                self.element.remove();
                                callback();
                            }
                        );
                    }
                );
            }
        );
    };

    /**
     * Returns the loaders current rotation.
     * 0 is calculated with a 45° offset to the elements base rotation in browser.
     * The offset ensures that the top border can be used as NW wall, etc. which
     * makes the collision detection easier.
     * Note: 0° is in the north.
     * @returns {Number}
     */
    this.getCurrentRotation = function () {
        var angle = 360-45;
        var tr = this.element.css("-webkit-transform") ||
             this.element.css("-moz-transform") ||
             this.element.css("-ms-transform") ||
             this.element.css("-o-transform") ||
             this.element.css("transform") ||
             "fail...";
        if( tr !== "none") {
            //console.log('Matrix: ' + tr);
            var values = tr.split('(')[1];
              values = values.split(')')[0];
              values = values.split(',');
            var a = values[0];
            var b = values[1];
            var c = values[2];
            var d = values[3];

            var radians = Math.atan2(b, a);
            if ( radians < 0 ) {
              radians += (2 * Math.PI);
            }
            var angle = Math.round( radians * (180/Math.PI));
            angle = angle - 45;
            if(angle < 0) {
                angle = 360 + angle;
            }
        }
        //console.log('Rotate: ' + angle + '°');
        return angle;
    };

    this.__initialize();
};
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
            self.parent[0].loaderminigameInstance = undefined;
            self.element.remove();
        };
        self.element.fadeOut(options);
    };

    //ensure we only bind on 1 single element in this class
    if(typeof $(parent)[0] === 'undefined') {
        throw "No object to bind the loaderminigame."
    }
    this.__initialize($($(parent)[0]));
};
$.fn.loaderminigame = function (config) {
    var $jq = this;
    var plugin = {
        destroy: function (options) {
            $jq.each(function () {
                var _this = this;
                _this._loadergameInstance.destroy(options);
                _this._loadergameInstance = undefined;
            });
            return plugin;
        },
        init: function () {
            $jq.each(function () {
                var _this = this;
                if (typeof _this._loadergameInstance === 'undefined') {
                    _this._loadergameInstance = new LoaderMiniGame(_this, config);
                }
            });
        }
    };
    plugin.init();
    return plugin;
};
return $;

}));
