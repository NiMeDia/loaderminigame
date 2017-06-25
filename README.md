# HTML5 Loader Minigame


## Getting Started

```js
$(document).ready(function() {
    $('.my_loader_class').loaderminigame();
});
```
## Known Issues
Currently the loader can only be applied to parent elements with position relative, absolute or fixed.
However if this requirement is not fulfilled, position relative will be automatically applied to the parent element.

## Contributing

Feel free to contribute to this project, you can simply built with grunt:
```shell
$ grunt build
```
There is also a watch task which builds continuously on changes in the /src directory:
```shell
$ grunt watch
```


## Release History

 * 2017-06-20   v0.0.0   -

## License
MIT