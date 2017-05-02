# babel-plugin-pull

> Transform pipeline operator into `pull(...)` calls

This inspired from similar [pipe](https://github.com/miraks/babel-plugin-pipe-operator) [operator](https://github.com/Swizz/babel-plugin-pipe-operator-curry) [plugins](https://github.com/michaelmitchell/babel-plugin-pipe-composition) to use [`pull-stream`](https://github.com/pull-stream/pull-stream), which provides you a whole ecosystem + [composing them together](#composition)!

## Install

```sh
npm install --save-dev babel-plugin-pull

# with yarn:
yarn add --dev babel-plugin-pull
```

Then load it in your Babel config:

```js
{
  "plugins": ["pull"]
}
```

## Usage

It takes input as such:

```js
source()
| through()
| sink()
```

And transforms to:

```js
pull(
  source(),
  through(),
  sink()
)
```

This allows you to use duplex streams, and compose them!

### Composition

You can create streams from other streams:

```js
// Create a source:
var foo = source() | through()

// Create a through:
var bar = through() | through()

// Create a sink:
var qux = through() | through() | sink()

// Reuse any of them in another pipeline:
foo | bar | qux
```

This would transform to:

```js
var foo = pull(source(), through())

var bar = pull(through(), through())

var qux = pull(through(), through(), sink())

pull(foo, bar, qux)
```

