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
        destroy: function () {
            $jq.each(function () {
                var _this = this;
                _this._loadergameInstance.destroy();
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