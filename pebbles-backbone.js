/**
 *  Pebblify your Backbone models
 */

var slice = Array.prototype.slice;

var methodMap = {
  'create':'POST',
  'update':'PUT',
  'delete':'DELETE',
  'read':'GET'
};

exports.pebblify = function (backboneClass) {
  return {
    "with": function (opts) {

      if (opts.connector) {
        backboneClass.prototype.sync = function (method, model, options) {
          var headers = {};
          if (!options.data && model && (method === 'create' || method === 'update')) {
            headers['Content-Type'] = 'application/json';
            options.data = JSON.stringify(model.toJSON());
          }
          var url = typeof model.url === 'function' ? model.url() : model.url;
          var promise = opts.connector.perform(methodMap[method], url, options.data, headers);
          promise.then(options.success, options.error);
          return promise;
        };
      }

      if (opts.namespace) {
        // Keep a reference to the original Backbone parse and toJSON functions
        var originalParse = backboneClass.prototype.parse;
        var originalToJSON = backboneClass.prototype.toJSON;

        backboneClass.prototype.parse = function () {
          var data = originalParse.apply(this, arguments);
          if (!data.hasOwnProperty(opts.namespace)) {
            throw new Error("Missing namespace \"" + opts.namespace + "\" when parsing response for " + this.constructor.name);
          }
          return data[opts.namespace];
        };

        backboneClass.prototype.toJSON = function () {
          // feature detect whether we are in a model or collection
          var isModel = !!this.attributes;
          var json = {};
          json[opts.namespace] = isModel ? originalToJSON.apply(this, arguments) : this.models.map(function (model) {
            return model.toJSON();
          });
          return json;
        };
        // Add a convenient getAttributes that returns a munge-safe json hash of no-namespaced data
        backboneClass.prototype.getAttributes = function () {
          // feature detect whether we are in a model or collection
          var isModel = !!this.attributes;
          return isModel ? this.toJSON()[opts.namespace] : this.models.map(function (model) {
            return model.getAttributes();
          });
        };
      }
    }
  };
};
