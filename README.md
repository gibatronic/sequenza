![sequenza](http://gibatronic.github.io/sequenza/etc/sequenza.svg)

Micro library to queue delayed callbacks.

```sh
bower install sequenza
# or

[![Join the chat at https://gitter.im/gibatronic/sequenza](https://badges.gitter.im/gibatronic/sequenza.svg)](https://gitter.im/gibatronic/sequenza?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
npm install sequenza
```

It uses `requestAnimationFrame` with a fallback for `setInterval`.

You may use it in the browser and with Node, under [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md), [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1.1) or as a regular script.

## Usage

Choose between three different ways to instantiate:

```js
new Sequenza(step1, step2, ...stepN).start(options);
```

```js
var steps = [step1, step2, ...stepN];

new Sequenza(steps).start(options);
```

```js
var sequenza = new Sequenza()

sequenza.queue(step1);
sequenza.queue(step2);
sequenza.queue(stepN);

sequenza.start(options);
```

A **step** may be an object that contains *at least* one of these properties:

```js
{
  callback: Function,
  delay: Number
}
```

But you may also pass a callback or a delay directly as a step.

Also, you may pass an **options** object to the `start` method, these are the available options:

* `iterations` the number of times the sequence should be iterated, defaults to 1. to iterate forever, just assign `Infinity` to it.

## Example

```js
// create an instance

var sequenza = new Sequenza();

// queue some steps

sequenza.queue({
  callback: function() {
    console.log('#1');
  },
  delay: 1000
});

sequenza.queue({
  callback: function() {
    console.log('#2');
  },
  delay: 1000
});

sequenza.queue({
  callback: function() {
    console.log('#3');
  },
  delay: 1000
});

// start it

sequenza.start({
  iterations: 3
});
```

The above snippet will take ≈ 1 second to log each number, then it's going to repeat 2 more times.

You may also use Sequenza as a clock, to call a function between certain amount of time:

```js
var ticks = 0;

var tick = function() {
  console.log(++ticks % 2 ? 'tick' : 'tack');
};

new Sequenza({
  callback: tick,
  delay: 1000
}).start({
  iterations: Infinity
});
```
