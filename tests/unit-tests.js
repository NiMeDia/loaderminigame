/* jshint undef:false */

;(function ($, undefined) {

  var div, div2;

  QUnit.module('All tests', {
    beforeEach: function() {
      div = $('<div id="my-loader" style="position:relative;"></div>');
      div2 = $('<div id="my-loader2" style="position:absolute;"></div>');
    },
    afterEach: function() {
      div.loaderminigame().destroy({duration:0});
      div2.loaderminigame().destroy({duration:0});
    }
  });

  QUnit.test('if loaderminigame is initializeable', function(assert) {
    div.loaderminigame();
    assert.ok(typeof div[0]._loadergameInstance !== 'undefined', 'loaderminigame is initializeable');
    assert.equal(div[0]._loadergameInstance.parent.attr('id'), 'my-loader', 'loaderminigame object has reference to the right element');
  });
  QUnit.test('if loaderminigame API is existent and complete', function(assert) {
    assert.ok(div.loaderminigame() instanceof Object, 'loaderminigame API exists');
    assert.ok(div.loaderminigame().destroy instanceof Function, 'loaderminigame.destoy() is callable');
  });

})(jQuery);