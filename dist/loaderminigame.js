(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
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

function Loader(borders, scale) {
    this.width = 100;
    this.height = 100;
    this.scale = scale|| 1.0;
    this.borders = borders || ['NE'];
    this.blockedRanges = [];
    for(let x = 0; x < this.borders.length; x++) {
        switch(this.borders[x]) {
            case 'NE':
                //@TODO set border-top
                this.blockedRanges.push([0, 90]);
                break;
            case 'SE':
                //@TODO set border-right
                this.blockedRanges.push([90, 180]);
                break;
            case 'SW':
                //@TODO set border-bottom
                this.blockedRanges.push([180, 270]);
                break;
            case 'NW':
                //@TODO set border-left
                this.blockedRanges.push([270, 360]);
                break;
        }
    }

    this.isPassable = function(passableFromAngle) {
        let passable = 0;
        let currentRotation = this.getCurrentRotation();
        for(let x = 0; x < this.blockedRanges.length; x++) {
            let blockLeftAngle = this.blockedRanges[x][0] + currentRotation;
            if(blockLeftAngle >= 360) {
                blockLeftAngle = blockLeftAngle - 360;
            }
            let blockRightAngle = this.blockedRanges[x][1] + currentRotation;
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
    }

    this.getCurrentRotation = function ( elid ) {
        elid = 'loader1'
        var el = document.getElementById(elid);
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
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
        } else {
            var angle = 315;
        }

        // works!
        console.log('Rotate: ' + angle + 'deg');
        return angle;
    }
    
    console.log(this.blockedRanges);
    
}

function LoaderGame() {
    this.loaders = [];
    this.loaders.push(new Loader());
    var self = this;
    this.onClick = function(ev) {
        let mouseAngle = 0; //TODO grab mouse angle

        for(let x = 0; x < self.loaders.length; x++) {
                //@TODO stop rotation OR calculate animation velocity
            let isPassable = self.loaders[x].isPassable(mouseAngle);
            if(!isPassable) {
                console.log("not passable");
            } else {
                console.log("passable");
            }
        }
        
    }
    
    var anchor = document.getElementById('loader1');
    if(anchor.addEventListener) // DOM method
      anchor.addEventListener('click', this.onClick , false);
}

$.fn.loaderminigame = function (config) {
    let loadergame = new LoaderGame();
    return loadergame; 
};
return $;

}));
