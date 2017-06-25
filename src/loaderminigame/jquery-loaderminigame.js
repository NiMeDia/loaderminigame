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