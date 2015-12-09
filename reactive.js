(function(window){

function Reactive(){
  this.value = undefined;
  this.watchers = [];
  this.watchees = null;
};

Reactive.prototype.g = function Reactive_g(){ return this.value };

Reactive.prototype.w = function Reactive_watch(callback) { this.watchers.push(callback); return this; };

Reactive.prototype.u = function Reactive_unwatch(callback) { var ws = this.watchers; ws.splice(ws.indexOf(callback),1); return this; }

Reactive.prototype.s = function Reactive_set(value, isDependency) { //if (!isDependency) this.c();
  var old = this.value, watcher; this.value = value;
  for (var i in this.watchers) (watcher = this.watchers[i]), watcher(value, old);
  return this;
};

Reactive.prototype.m = function Reactive_method(fun) { this.c();
  var dependencies = [], args = Array.prototype.slice.call(arguments,1), watchees = [], self = this;
  for (var i in args) (function (arg, i){
    if (arg instanceof Reactive) arg.w((function(i){
        var callback = function Reactive_dependency(delta, old){
          dependencies[i] = delta;
          self.s(fun.apply(null, dependencies), true);
        };
        dependencies[i] = arg.g();
        watchees.push({reactive: arg, callback:callback});
        return callback;
    })(i));
    else dependencies[i] = arg;
  })(args[i] ,i);
  this.watchees = watchees;
  this.s(fun.apply(null, dependencies), true);
  return this;
};

Reactive.prototype.c = function Reactive_clear_dependencies () { var watchees = this.watchees, watchee;
  for (i in watchees) (watchee = watchees[i]), watchee.reactive.u(watchee.callback); this.watchees = null;
  return this;
};

window.Giro = window.Giro || { _shortcuts: {}};
window.Giro.Reactive = Reactive;
window.Giro.shortcuts = function Reactive_shortcuts(dict){ var shortcuts = window.Giro._shortcuts, i; dict = dict || window;
  for (i in shortcuts) dict[i] = shortcuts[i]; return dict;
};
window.Giro._shortcuts.r = function(){ var ret = new Reactive(); return ret};

window.Giro.concat = function Reactive_concat(){
  var ret = arguments[0] instanceof Array ? arguments[0]: [arguments[0]];
  for (var i=1, len=arguments.length; i<len; i++)
    ret = ret.concat(arguments[i]);
  return ret;
}
window.Giro._shortcuts.c = window.Giro.concat;

})(window)
