# sequenza

micro library to queue delayed callbacks.

```sh
bower install sequenza
# or
npm install sequenza
```

## usage

choose between these three different ways:

```js
new Sequenza(step1, step2, ...stepN).start();
```

```js
var steps = [step1, step2, ...stepN];

new Sequenza(steps).start();
```

```js
var sequenza = new Sequenza()

sequenza.queue(step1);
sequenza.queue(step2);
sequenza.queue(stepN);

sequenza.start();
```

a **step** should be an object containing *at least* one of these properties:

```js
{
  callback: Function,
  delay: Number
}
```

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

sequenza.start();
```

the above snippet will take ≈ 1 second to log `#1`, ≈ 2 seconds to log `#2` and ≈ 3 seconds to log `#3`
