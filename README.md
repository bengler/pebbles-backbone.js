# Pebbles.js

Make your Backbone models and collections Pebbles-powered

[![Build Status](https://secure.travis-ci.org/bengler/backbone-pebbles.js.png)](http://travis-ci.org/bengler/backbone-pebbles.js)

## Prerequisites

Node.js 0.8 or higher

## Getting started

Install module dependencies

    $ npm install

Run tests

    $ npm test

## Usage examples

### Vanilla JavaScript
```js
var pebblify = require("pebbles-backbone").pebblify;
var BlogPost = Backbone.Model.extend({
  //...
});

pebblify(BlogPost).with({
   namespace: "post",
   connector: grove.connector
});
```

### CoffeeScript
```coffee
pebblify = require("pebbles-backbone").pebblify

class BlogPost extends Backbone.Model
  pebblify(this).with
     namespace: "post"
     connector: grove.connector

  #...
```