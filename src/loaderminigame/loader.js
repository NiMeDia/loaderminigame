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
}