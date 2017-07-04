/**
 * A Loader instance of the LoaderMinigame.
 * @param {Jquery Object} parent
 * @param {Object} config
 * @param {Array|undefined} borders
 * @param {Number|undefined} scale
 * @param {String|undefined} animationTiming
 * @param {Number|undefined} animationDuration
 * @returns {Loader}
 */
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
}