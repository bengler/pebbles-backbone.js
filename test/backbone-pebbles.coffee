should = require "should"
Backbone = require "backbone"
sinon = require "sinon"

pebblify = require("../").pebblify

sinon.stub().yieldsTo "perform", ->
  console.log("omg")

mockConnector =
  perform: ->
    request = $.Deferred()
    setTimeout((->
      request.resolve(spacename)
    ), 0)

describe 'backbone-pebbles', ->
  it "configures a backbone model class with a namespace", ->
    class FooClass extends Backbone.Model
      pebblify(@).with namespace: 'spacename'

    foo = new FooClass

    foo.parse(spacename: {name: "foo"}).name.should.equal("foo")

  it "configures a backbone model class with a connector for requesting data", ->
    spy = sinon.spy()
    class FooClass extends Backbone.Model
      pebblify(@).with
        namespace: 'spacename'
        service:
          perform: ->
            spy()
            then: (cb)->cb(spacename: {foo: "bar"})
      url: "/some/api/url"

    foo = new FooClass
    foo.fetch()
    foo.get('foo').should.equal "bar"
    spy.calledOnce.should.be.ok

