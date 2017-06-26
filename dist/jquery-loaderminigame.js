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

/*!loaderminigame - v0.0.1 - 2017-06-26 */
function Loader(parent, config, borders, scale, animationDuration, animationTiming) {
    this.config = $.extend({
        borderSize: "4px",
        borderColor: "#666",
        borderBackgroundColor: "transparent",
        baseWidth: 20,
        baseHeight: 20,
    }, config);

    this.element = null;

    this.scale = scale|| 1.0;
    this.borders = borders || ['NE', 'SE', 'SW'];
    this.animationDuration = animationDuration || (Math.random() * (3 - 1) + 1)+"s";
    //animation-timing-function: linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|steps(int,start|end)|cubic-bezier(n,n,n,n)|initial|inherit;
    this.animationTiming = animationTiming || 'linear';
    this.animations = ['loaderminigame_spin_reversed','loaderminigame_spin'];
    this.blockedRanges = [];
    
    this.__initialize = function() {
        this.element = $('<div class="loaderminigame_loader"></div>');
        this.element.hide();
        this.element.css("position", 'absolute');
        this.element.css("top", '50%');
        this.element.css("left", '50%');
        this.element.css("border", this.config.borderSize + " solid " + this.config.borderBackgroundColor);
        this.element.css("border-radius", '50%');
        this.element.css("width", this.config.baseWidth*scale);
        this.element.css("height", this.config.baseHeight*scale);
        this.element.css("transform", 'translate(-50%, -50%)');
        this.element.css("animation", this.animations[Math.floor(Math.random()*this.animations.length)] + ' ' + this.animationDuration + ' ' + this.animationTiming + ' infinite');
        for(var x = 0; x < this.borders.length; x++) {
            switch(this.borders[x]) {
                case 'NE':
                    this.element.css("border-top", this.config.borderSize + " solid " + this.config.borderColor);
                    this.blockedRanges.push([0, 90]);
                    break;
                case 'SE':
                    this.element.css("border-right", this.config.borderSize + " solid " + this.config.borderColor);
                    this.blockedRanges.push([90, 180]);
                    break;
                case 'SW':
                    this.element.css("border-bottom", this.config.borderSize + " solid " + this.config.borderColor);
                    this.blockedRanges.push([180, 270]);
                    break;
                case 'NW':
                    this.element.css("border-left", this.config.borderSize + " solid " + this.config.borderColor);
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
//            console.log("blockLeftAngle: " + blockLeftAngle, "blockRightAngle: " + blockRightAngle, "passableFromAngle: " + passableFromAngle)
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

    this.pause = function() {
        this.element.css('-webkit-animation-play-state', 'paused');
        this.element.css('-moz-animation-play-state', 'paused');
        this.element.css('-ms-animation-play-state', 'paused');
        this.element.css('-o-animation-play-state', 'paused');
        this.element.css('animation-play-state', 'paused');
    };

    this.resume = function() {
        this.element.css('-webkit-animation-play-state', 'running');
        this.element.css('-moz-animation-play-state', 'running');
        this.element.css('-ms-animation-play-state', 'running');
        this.element.css('-o-animation-play-state', 'running');
        this.element.css('animation-play-state', 'running');
    };

    this.destroy = function() {
        this.element.remove();
    };

    /**
     * Returns the loaders current rotation.
     * 0 is calculated with a 45° offset to the elements base rotation in browser.
     * The offset ensures that the top border can be used as NW wall, etc. which
     * makes the collision detection easier.
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
        borderSize: "4px",
        borderColor: "#666",
        borderBackgroundColor: "transparent",
        baseWidth: 20,
        baseHeight: 20,
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
        if(parent.css('position') !== 'absolute' || parent.css('position') !== 'relative' || parent.css('position') !== 'fixed') {
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
        this.winPoint.css('border', '1px solid ' + this.config.borderColor);
        this.winPoint.css('position', 'absolute');
        this.winPoint.css("border-radius", '50%');
//        this.winPoint.css('background', this.config.borderColor);
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
//        var offset = self.element.offset();
//        var divPos = {
//            left: ev.pageX - offset.left,
//            top: ev.pageY - offset.top
//        };
//        self.mousePoint.css('left', (divPos.left - 3) + 'px');
//        self.mousePoint.css('top', (divPos.top - 3) + 'px');
        
        var radians = self.__getCurrentMouseRadians(ev);
        var scale = self.__getNextLoaderScale();
        var offsetX = (self.config.baseWidth * scale + 10) * Math.cos(radians) * -1 / 2;
        var offsetY = (self.config.baseHeight * scale + 10) * Math.sin(radians) * -1 / 2;
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
            self.__removeLoader();
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
        var borders = ['NE', 'SW', 'SE'];
        this.loaders.push(new Loader(this.element, this.config, borders, this.__getNextLoaderScale()));
    };
    this.__removeLoader = function() {
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
};
$.fn.loaderminigame = function (config) {
    var $jq = this;
    var plugin = {
        stop: function () {
            $jq.each(function () {
                var _this = this;
                _this._loadergameInstance.stop();
            });
            return plugin;
        },
        start: function () {
            $jq.each(function () {
                var _this = this;
                _this._loadergameInstance.start();
            });
            return plugin;
        },
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
//            plugin.start(settings.param);
        }
    };
    plugin.init();
    return plugin;
};
return $;

}));
