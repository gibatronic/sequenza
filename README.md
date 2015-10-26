![sequenza](http://gibatronic.github.io/sequenza/etc/sequenza.svg)

micro library to queue delayed callbacks.

```sh
bower install sequenza
# or
npm install sequenza
```

it uses `requestAnimationFrame` with a fallback for `setInterval`.

you may use it in the browser and with Node.

it supports AMD, CommonJS and the old regular `window`

## usage

choose between these three different ways:

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

the `queue` method expects a **step** object that must contain *at least* one of these properties:

```js
{
  callback: Function,
  delay: Number
}
```

you may pass an **options** object to the `start` method, these are the available options:

* `iterations` the number of times the sequence should be iterated, defaults to 1. to iterate forever, just assign `Infinity` to it.

## example

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

the above snippet will take ≈ 1 second to log `#1`, ≈ 2 for `#2` and ≈ 3 for `#3`, then it's going to repeat 2 more times.

you may also use Sequenza as a clock, to call a function between certain amount of time:

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
