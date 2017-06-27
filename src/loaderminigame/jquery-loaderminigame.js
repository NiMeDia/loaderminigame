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