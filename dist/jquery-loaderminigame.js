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

/*!loaderminigame - v0.0.1 - 2017-06-25 */
function Loader(parent, config, borders, scale) {
    this.element = $('<div class="loaderminigame_loader"></div>');
    this.config = config || {};
    this.borderSize = config.borderSize || "4px";
    this.borderColor = config.borderColor || "#3498db";
    this.borderBackgroundColor = config.borderBackgroundColor || "transparent";
    this.width = config.baseWidth || 20;
    this.height = config.baseHeight || 20;
    this.scale = scale|| 1.0;
    this.borders = borders || ['NE'];
    this.blockedRanges = [];
    
    this.__initialize = function() {
        this.element.hide();
        this.element.css("position", 'absolute');
        this.element.css("top", '50%');
        this.element.css("left", '50%');
        this.element.css("border", this.borderSize + " solid " + this.borderBackgroundColor);
        this.element.css("border-radius", '50%');
        this.element.css("width", this.width*scale);
        this.element.css("height", this.height*scale);
        for(var x = 0; x < this.borders.length; x++) {
            switch(this.borders[x]) {
                case 'NE':
                    this.element.css("border-top", this.borderSize + " solid " + this.borderColor);
                    this.blockedRanges.push([0, 90]);
                    break;
                case 'SE':
                    this.element.css("border-right", this.borderSize + " solid " + this.borderColor);
                    this.blockedRanges.push([90, 180]);
                    break;
                case 'SW':
                    this.element.css("border-bottom", this.borderSize + " solid " + this.borderColor);
                    this.blockedRanges.push([180, 270]);
                    break;
                case 'NW':
                    this.element.css("border-left", this.borderSize + " solid " + this.borderColor);
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
            console.log("blockLeftAngle: " + blockLeftAngle, "blockRightAngle: " + blockRightAngle, "passableFromAngle: " + passableFromAngle)
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
};
$.fn.loaderminigame = function (config) {
    config = $.extend({
        zindex: 9999,
        background: 'rgba(255, 255, 255, 0.4)',
        borderSize: "4px",
        borderColor: "#666",
        borderBackgroundColor: "transparent",
        baseWidth: 20,
        baseHeight: 20,
    }, config);
    
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
        init: function () {
            $jq.each(function () {
                var _this = this;
//                _this.$this = $(this);
//                _this._param = "value";

                if (typeof _this._loadergameInstance === 'undefined') {
                    _this._loadergameInstance = new LoaderMiniGame(_this, config);
                }
//                return this.loadergameInstance;
//                var privatefunction = function () {
//                    console.log("Calling: privatefunction();");
//                }
//
//                //Call private function on each jQuery element
//                privatefunction();

//                _this.$this.on('click', function (e) {
//                    //jQuery events
//                });
            });
//            plugin.start(settings.param);
        }
    };
    plugin.init();
    return plugin;
};
return $;

}));
