# jquery-loaderminigame
HTML5 / CSS3 loading animation minigame shipped as JQuery plugin.

<iframe width="100%" height="210" src="https://p0rnflake.github.io/loaderminigame/docs/demo/simple.html" frameborder="0"></iframe>

[Docs and Demos](https://p0rnflake.github.io/loaderminigame/)

## Getting Started

```html
    <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="/dist/jquery-loaderminigame.js"></script>
    ...
    <script>
        // Set up the loader minigame...
        $('.my_loader_class').loaderminigame();
        setTimeout(function(){
            // ...and destroy it after some long-lasting task.
            $('.my_loader_class').loaderminigame().destroy();
        }, 60000);
    </script>
```

## Examples
 * [simple use](https://p0rnflake.github.io/loaderminigame/docs/demo/simple.html)
 * [extended use / dark theme](https://p0rnflake.github.io/loaderminigame/docs/demo/extended.html)

## API

### Options

```js
    $('.my_loader_class').loaderminigame({
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
        maxLoaderSpeed: 3,
    });
```

### Methods

#### .destroy(\[options\])
Destroys all loader minigames within the given scope.

Param 'options':
The options parameter will be dispatched to the JQuery.fadeOut effect, have a look at <http://api.jquery.com/fadeout/#fadeOut-options> to get the full documentation.
If the options param is not set, the fadeOut duration will be "fast" ;-)

Example:
```js
    $('.my_loader_class').loaderminigame().destroy({
        duration: 800,
        easing: 'swing',
        done: function(){
            console.log('The damn animation is finally done!');
        }
    });
```

## Installation

### Using Bower
```shell
bower install jquery-loaderminigame
```

## UMD Support
This library is built on top of the [Universal Module Definition API](https://github.com/umdjs/umd) and can therefore be use with amd module loaders like [RequireJS](http://requirejs.org/).

## Requirements
 * [JQuery](https://jquery.com/) (should be compatible with most of the versions)
 * HTML5 / CSS3 compatible browser

## Known Issues
Currently the loader can only be applied to parent elements with position relative, absolute or fixed.
However if this requirement is not fulfilled, position relative will be automatically applied to the parent element.

## Contributing

Feel free to contribute to this project, you can simply built it with grunt:
```shell
grunt build
```
There is also a watch task which builds continuously on changes in the /src directory:
```shell
grunt watch
```

## License
MIT