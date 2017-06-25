# Jquery Loader Minigame
HTML5 / CSS3 loading animation minigame.

## Getting Started

```js
    // Set up the loader minigame...
    $('.my_loader_class').loaderminigame();
    setTimeout(function(){
        // ...and destroy it after some long-lasting task.
        $('.my_loader_class').loaderminigame().destroy();
    }, 60000);
```

## Examples
 * [Complete overview](/docs/demo/test.html)

## Settings

```js
    $('.my_loader_class').loaderminigame({
        zindex: 9999,
        background: 'rgba(255, 255, 255, 0.4)',
        borderSize: "4px",
        borderColor: "#666",
        borderBackgroundColor: "transparent",
        baseWidth: 20,
        baseHeight: 20,
    });
```

## UMD Support
This library can be use with amd module loaders like [RequireJS](http://requirejs.org/).

## Requirements
 * [JQuery](https://jquery.com/)
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


## Release History

 * 2017-06-20   v0.0.0   -

## License
MIT