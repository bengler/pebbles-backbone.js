const Backbone = require("backbone")
const sinon = require("sinon")
const assert = require("assert")

const pebblify = require("../").pebblify

describe('backbone-pebbles', () => {
  it("configures a backbone model class with a namespace", () => {
    class FooClass extends Backbone.Model {
    }
    pebblify(FooClass).with({namespace: 'spacename'})

    const foo = new FooClass

    assert.equal(foo.parse({spacename: {name: "foo"}}).name, "foo")

    it("configures a backbone model class with a connector for requesting data", () => {
      const spy = sinon.spy()

      const FooClass = Backbone.Model.extend({
        url: "/some/api/url"
      })

      pebblify(FooClass).with({
        namespace: 'spacename',
        service: {
          request: () => {
            spy()
            return Promise.resolve({spacename: {foo: "bar"}})
          }
        }
      })

      const foo = new FooClass

      return foo.fetch().then(() => {
        assert.equal(foo.get('foo'), "bar")
        assert(spy.calledOnce)
      })
    })
  })
})