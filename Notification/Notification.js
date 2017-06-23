/**
 * Created by xpwu on 16/5/16.
 */

(function(ns) {

    "use strict";
    /**
     *
     * @type {{name:[{o:object,c:string}]}}
     */
    var names = Object.create(null);
    ns.NotificationCenter = {
        /**
         *
         * @param {object}observer ---注册者
         * @param {string}callback ---收到通知后的事件处理回调
         * @param {string}name     ---注册事件名称
         * @param {function(name userInfo)}   --- 通知事件，事件名，参数
         */
        //注册通知
        addObserver: function(observer, callback, name) {
            if (names[name] === undefined) {
                names[name] = [];
                names[name + '_cnt'] = 0;
            }

            var pos = names[name].length;
            for (var i = 0; i < names[name].length; ++i) {
                if (i in names[name] && names[name][i] === undefined) {
                    pos = i;
                    continue;
                }
                if (i in names[name] && names[name][i] != undefined) {
                    if (names[name][i]['o'] === observer) {
                        names[name][i]['c'] = callback;
                        return;
                    }
                }
            }
            names[name][pos] = { 'o': observer, 'c': callback };
            names[name + '_cnt'] += 1;
        },
        //移除
        removeObserver: function(observer, name) {
            if (names[name] === undefined) {
                return;
            }

            for (var i = 0; i < names[name].length; ++i) {
                if (i in names[name] && names[name][i] != undefined) {
                    if (names[name][i]['o'] === observer) {
                        names[name][i] = undefined;
                        names[name + '_cnt'] -= 1;

                        if (names[name + '_cnt'] == 0) {
                            delete names[name + '_cnt'];
                            delete names[name];
                        }
                        return;
                    }
                }
            }
        },

        removeObserverAllNotification: function(observer) {
            for (var name in names) {
                if (typeof names[name] != 'object') {
                    continue;
                }
                this.removeObserver(observer, name);
            }
        },
        //发送通知
        postNotification: function(name, userInfo) {
            if (names[name] === undefined) {
                return;
            }

            for (var i = 0; i < names[name].length; ++i) {
                if (i in names[name] && names[name][i] != undefined) {
                    if (typeof names[name][i]['o'][names[name][i]['c']] === 'function') {
                        names[name][i]['o'][names[name][i]['c']](name, userInfo);
                    }
                }
            }
        }
    };

    ns.NC = ns.NotificationCenter;

})(this);