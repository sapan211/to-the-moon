/*!
 * Pusher JavaScript Library v2.2.3
 * http://pusher.com/
 *
 * Copyright 2014, Pusher
 * Released under the MIT licence.
 */
function addCanvasEventListener(t, e) {
    canvas.addEventListener(t, e, !1)
}

function wheel(t) {
    var e = 0;
    e = t.detail ? -t.detail / 3 : t.wheelDelta / 120;
    var n = e / 25;
    (e > 0 && .5 >= Z + n || 0 > e && Z + n >= .01) && (Z += e / 25)
}

function resetstar(t) {
        t.x = (Rnd() * width - .5 * width) * warpZ, t.y = (Rnd() * height - .5 * height) * warpZ, t.z = warpZ, t.px = 0, t.py = 0
    }(function() {
        function t(n, i) {
            e(n), i = i || {};
            var r = this;
            this.key = n, this.config = t.Util.extend(t.getGlobalConfig(), i.cluster ? t.getClusterConfig(i.cluster) : {}, i), this.channels = new t.Channels, this.global_emitter = new t.EventsDispatcher, this.sessionID = Math.floor(1e9 * Math.random()), this.timeline = new t.Timeline(this.key, this.sessionID, {
                cluster: this.config.cluster,
                features: t.Util.getClientFeatures(),
                params: this.config.timelineParams || {},
                limit: 50,
                level: t.Timeline.INFO,
                version: t.VERSION
            }), this.config.disableStats || (this.timelineSender = new t.TimelineSender(this.timeline, {
                host: this.config.statsHost,
                path: "/timeline/v2/jsonp"
            }));
            var s = function(e) {
                var n = t.Util.extend({}, r.config, e);
                return t.StrategyBuilder.build(t.getDefaultStrategy(n), n)
            };
            this.connection = new t.ConnectionManager(this.key, t.Util.extend({
                getStrategy: s,
                timeline: this.timeline,
                activityTimeout: this.config.activity_timeout,
                pongTimeout: this.config.pong_timeout,
                unavailableTimeout: this.config.unavailable_timeout
            }, this.config, {
                encrypted: this.isEncrypted()
            })), this.connection.bind("connected", function() {
                r.subscribeAll(), r.timelineSender && r.timelineSender.send(r.connection.isEncrypted())
            }), this.connection.bind("message", function(t) {
                var e = 0 === t.event.indexOf("pusher_internal:");
                if (t.channel) {
                    var n = r.channel(t.channel);
                    n && n.handleEvent(t.event, t.data)
                }
                e || r.global_emitter.emit(t.event, t.data)
            }), this.connection.bind("disconnected", function() {
                r.channels.disconnect()
            }), this.connection.bind("error", function(e) {
                t.warn("Error", e)
            }), t.instances.push(this), this.timeline.info({
                instances: t.instances.length
            }), t.isReady && r.connect()
        }

        function e(e) {
            (null === e || void 0 === e) && t.warn("Warning", "You must pass your app key when you instantiate Pusher.")
        }
        var n = t.prototype;
        t.instances = [], t.isReady = !1, t.debug = function() {
            t.log && t.log(t.Util.stringify.apply(this, arguments))
        }, t.warn = function() {
            var e = t.Util.stringify.apply(this, arguments);
            window.console && (window.console.warn ? window.console.warn(e) : window.console.log && window.console.log(e)), t.log && t.log(e)
        }, t.ready = function() {
            t.isReady = !0;
            for (var e = 0, n = t.instances.length; n > e; e++) t.instances[e].connect()
        }, n.channel = function(t) {
            return this.channels.find(t)
        }, n.allChannels = function() {
            return this.channels.all()
        }, n.connect = function() {
            if (this.connection.connect(), this.timelineSender && !this.timelineSenderTimer) {
                var e = this.connection.isEncrypted(),
                    n = this.timelineSender;
                this.timelineSenderTimer = new t.PeriodicTimer(6e4, function() {
                    n.send(e)
                })
            }
        }, n.disconnect = function() {
            this.connection.disconnect(), this.timelineSenderTimer && (this.timelineSenderTimer.ensureAborted(), this.timelineSenderTimer = null)
        }, n.bind = function(t, e) {
            return this.global_emitter.bind(t, e), this
        }, n.bind_all = function(t) {
            return this.global_emitter.bind_all(t), this
        }, n.subscribeAll = function() {
            var t;
            for (t in this.channels.channels) this.channels.channels.hasOwnProperty(t) && this.subscribe(t)
        }, n.subscribe = function(t) {
            var e = this.channels.add(t, this);
            return "connected" === this.connection.state && e.subscribe(), e
        }, n.unsubscribe = function(t) {
            var e = this.channels.remove(t);
            "connected" === this.connection.state && e.unsubscribe()
        }, n.send_event = function(t, e, n) {
            return this.connection.send_event(t, e, n)
        }, n.isEncrypted = function() {
            return "https:" === t.Util.getDocument().location.protocol ? !0 : Boolean(this.config.encrypted)
        }, t.HTTP = {}, this.Pusher = t
    }).call(this),
    function() {
        function t(t) {
            window.clearTimeout(t)
        }

        function e(t) {
            window.clearInterval(t)
        }

        function n(t, e, n, i) {
            var r = this;
            this.clear = e, this.timer = t(function() {
                null !== r.timer && (r.timer = i(r.timer))
            }, n)
        }
        var i = n.prototype;
        i.isRunning = function() {
            return null !== this.timer
        }, i.ensureAborted = function() {
            this.timer && (this.clear(this.timer), this.timer = null)
        }, Pusher.Timer = function(e, i) {
            return new n(setTimeout, t, e, function() {
                return i(), null
            })
        }, Pusher.PeriodicTimer = function(t, i) {
            return new n(setInterval, e, t, function(t) {
                return i(), t
            })
        }
    }.call(this),
    function() {
        Pusher.Util = {
            now: function() {
                return Date.now ? Date.now() : (new Date).valueOf()
            },
            defer: function(t) {
                return new Pusher.Timer(0, t)
            },
            extend: function(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = arguments[e];
                    for (var i in n) t[i] = n[i] && n[i].constructor && n[i].constructor === Object ? Pusher.Util.extend(t[i] || {}, n[i]) : n[i]
                }
                return t
            },
            stringify: function() {
                for (var t = ["Pusher"], e = 0; e < arguments.length; e++) t.push("string" == typeof arguments[e] ? arguments[e] : void 0 === window.JSON ? arguments[e].toString() : JSON.stringify(arguments[e]));
                return t.join(" : ")
            },
            arrayIndexOf: function(t, e) {
                var n = Array.prototype.indexOf;
                if (null === t) return -1;
                if (n && t.indexOf === n) return t.indexOf(e);
                for (var i = 0, r = t.length; r > i; i++)
                    if (t[i] === e) return i;
                return -1
            },
            objectApply: function(t, e) {
                for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e(t[n], n, t)
            },
            keys: function(t) {
                var e = [];
                return Pusher.Util.objectApply(t, function(t, n) {
                    e.push(n)
                }), e
            },
            values: function(t) {
                var e = [];
                return Pusher.Util.objectApply(t, function(t) {
                    e.push(t)
                }), e
            },
            apply: function(t, e, n) {
                for (var i = 0; i < t.length; i++) e.call(n || window, t[i], i, t)
            },
            map: function(t, e) {
                for (var n = [], i = 0; i < t.length; i++) n.push(e(t[i], i, t, n));
                return n
            },
            mapObject: function(t, e) {
                var n = {};
                return Pusher.Util.objectApply(t, function(t, i) {
                    n[i] = e(t)
                }), n
            },
            filter: function(t, e) {
                e = e || function(t) {
                    return !!t
                };
                for (var n = [], i = 0; i < t.length; i++) e(t[i], i, t, n) && n.push(t[i]);
                return n
            },
            filterObject: function(t, e) {
                var n = {};
                return Pusher.Util.objectApply(t, function(i, r) {
                    (e && e(i, r, t, n) || Boolean(i)) && (n[r] = i)
                }), n
            },
            flatten: function(t) {
                var e = [];
                return Pusher.Util.objectApply(t, function(t, n) {
                    e.push([n, t])
                }), e
            },
            any: function(t, e) {
                for (var n = 0; n < t.length; n++)
                    if (e(t[n], n, t)) return !0;
                return !1
            },
            all: function(t, e) {
                for (var n = 0; n < t.length; n++)
                    if (!e(t[n], n, t)) return !1;
                return !0
            },
            method: function(t) {
                var e = Array.prototype.slice.call(arguments, 1);
                return function(n) {
                    return n[t].apply(n, e.concat(arguments))
                }
            },
            getWindow: function() {
                return window
            },
            getDocument: function() {
                return document
            },
            getNavigator: function() {
                return navigator
            },
            getLocalStorage: function() {
                try {
                    return window.localStorage
                } catch (t) {
                    return void 0
                }
            },
            getClientFeatures: function() {
                return Pusher.Util.keys(Pusher.Util.filterObject({
                    ws: Pusher.WSTransport,
                    flash: Pusher.FlashTransport
                }, function(t) {
                    return t.isSupported({})
                }))
            },
            addWindowListener: function(t, e) {
                var n = Pusher.Util.getWindow();
                void 0 !== n.addEventListener ? n.addEventListener(t, e, !1) : n.attachEvent("on" + t, e)
            },
            removeWindowListener: function(t, e) {
                var n = Pusher.Util.getWindow();
                void 0 !== n.addEventListener ? n.removeEventListener(t, e, !1) : n.detachEvent("on" + t, e)
            },
            isXHRSupported: function() {
                var t = window.XMLHttpRequest;
                return Boolean(t) && void 0 !== (new t).withCredentials
            },
            isXDRSupported: function(t) {
                var e = t ? "https:" : "http:",
                    n = Pusher.Util.getDocument().location.protocol;
                return Boolean(window.XDomainRequest) && n === e
            }
        }
    }.call(this),
    function() {
        Pusher.VERSION = "2.2.3", Pusher.PROTOCOL = 7, Pusher.host = "ws.pusherapp.com", Pusher.ws_port = 80, Pusher.wss_port = 443, Pusher.sockjs_host = "sockjs.pusher.com", Pusher.sockjs_http_port = 80, Pusher.sockjs_https_port = 443, Pusher.sockjs_path = "/pusher", Pusher.stats_host = "stats.pusher.com", Pusher.channel_auth_endpoint = "/pusher/auth", Pusher.channel_auth_transport = "ajax", Pusher.activity_timeout = 12e4, Pusher.pong_timeout = 3e4, Pusher.unavailable_timeout = 1e4, Pusher.cdn_http = "http://js.pusher.com/", Pusher.cdn_https = "https://js.pusher.com/", Pusher.dependency_suffix = "", Pusher.getDefaultStrategy = function(t) {
            var e;
            return e = t.encrypted ? [":best_connected_ever", ":ws_loop", [":delayed", 2e3, [":http_fallback_loop"]]] : [":best_connected_ever", ":ws_loop", [":delayed", 2e3, [":wss_loop"]],
                [":delayed", 5e3, [":http_fallback_loop"]]
            ], [
                [":def", "ws_options", {
                    hostUnencrypted: t.wsHost + ":" + t.wsPort,
                    hostEncrypted: t.wsHost + ":" + t.wssPort
                }],
                [":def", "wss_options", [":extend", ":ws_options", {
                    encrypted: !0
                }]],
                [":def", "sockjs_options", {
                    hostUnencrypted: t.httpHost + ":" + t.httpPort,
                    hostEncrypted: t.httpHost + ":" + t.httpsPort,
                    httpPath: t.httpPath
                }],
                [":def", "timeouts", {
                    loop: !0,
                    timeout: 15e3,
                    timeoutLimit: 6e4
                }],
                [":def", "ws_manager", [":transport_manager", {
                    lives: 2,
                    minPingDelay: 1e4,
                    maxPingDelay: t.activity_timeout
                }]],
                [":def", "streaming_manager", [":transport_manager", {
                    lives: 2,
                    minPingDelay: 1e4,
                    maxPingDelay: t.activity_timeout
                }]],
                [":def_transport", "ws", "ws", 3, ":ws_options", ":ws_manager"],
                [":def_transport", "wss", "ws", 3, ":wss_options", ":ws_manager"],
                [":def_transport", "flash", "flash", 2, ":ws_options", ":ws_manager"],
                [":def_transport", "sockjs", "sockjs", 1, ":sockjs_options"],
                [":def_transport", "xhr_streaming", "xhr_streaming", 1, ":sockjs_options", ":streaming_manager"],
                [":def_transport", "xdr_streaming", "xdr_streaming", 1, ":sockjs_options", ":streaming_manager"],
                [":def_transport", "xhr_polling", "xhr_polling", 1, ":sockjs_options"],
                [":def_transport", "xdr_polling", "xdr_polling", 1, ":sockjs_options"],
                [":def", "ws_loop", [":sequential", ":timeouts", ":ws"]],
                [":def", "wss_loop", [":sequential", ":timeouts", ":wss"]],
                [":def", "flash_loop", [":sequential", ":timeouts", ":flash"]],
                [":def", "sockjs_loop", [":sequential", ":timeouts", ":sockjs"]],
                [":def", "streaming_loop", [":sequential", ":timeouts", [":if", [":is_supported", ":xhr_streaming"], ":xhr_streaming", ":xdr_streaming"]]],
                [":def", "polling_loop", [":sequential", ":timeouts", [":if", [":is_supported", ":xhr_polling"], ":xhr_polling", ":xdr_polling"]]],
                [":def", "http_loop", [":if", [":is_supported", ":streaming_loop"],
                    [":best_connected_ever", ":streaming_loop", [":delayed", 4e3, [":polling_loop"]]],
                    [":polling_loop"]
                ]],
                [":def", "http_fallback_loop", [":if", [":is_supported", ":http_loop"],
                    [":http_loop"],
                    [":sockjs_loop"]
                ]],
                [":def", "strategy", [":cached", 18e5, [":first_connected", [":if", [":is_supported", ":ws"], e, [":if", [":is_supported", ":flash"],
                    [":best_connected_ever", ":flash_loop", [":delayed", 2e3, [":http_fallback_loop"]]],
                    [":http_fallback_loop"]
                ]]]]]
            ]
        }
    }.call(this),
    function() {
        Pusher.getGlobalConfig = function() {
            return {
                wsHost: Pusher.host,
                wsPort: Pusher.ws_port,
                wssPort: Pusher.wss_port,
                httpHost: Pusher.sockjs_host,
                httpPort: Pusher.sockjs_http_port,
                httpsPort: Pusher.sockjs_https_port,
                httpPath: Pusher.sockjs_path,
                statsHost: Pusher.stats_host,
                authEndpoint: Pusher.channel_auth_endpoint,
                authTransport: Pusher.channel_auth_transport,
                activity_timeout: Pusher.activity_timeout,
                pong_timeout: Pusher.pong_timeout,
                unavailable_timeout: Pusher.unavailable_timeout
            }
        }, Pusher.getClusterConfig = function(t) {
            return {
                wsHost: "ws-" + t + ".pusher.com",
                httpHost: "sockjs-" + t + ".pusher.com"
            }
        }
    }.call(this),
    function() {
        function t(t) {
            var e = function(e) {
                Error.call(this, e), this.name = t
            };
            return Pusher.Util.extend(e.prototype, Error.prototype), e
        }
        Pusher.Errors = {
            BadEventName: t("BadEventName"),
            RequestTimedOut: t("RequestTimedOut"),
            TransportPriorityTooLow: t("TransportPriorityTooLow"),
            TransportClosed: t("TransportClosed"),
            UnsupportedTransport: t("UnsupportedTransport"),
            UnsupportedStrategy: t("UnsupportedStrategy")
        }
    }.call(this),
    function() {
        function t(t) {
            this.callbacks = new e, this.global_callbacks = [], this.failThrough = t
        }

        function e() {
            this._callbacks = {}
        }

        function n(t) {
            return "_" + t
        }
        var i = t.prototype;
        i.bind = function(t, e, n) {
            return this.callbacks.add(t, e, n), this
        }, i.bind_all = function(t) {
            return this.global_callbacks.push(t), this
        }, i.unbind = function(t, e, n) {
            return this.callbacks.remove(t, e, n), this
        }, i.unbind_all = function(t, e) {
            return this.callbacks.remove(t, e), this
        }, i.emit = function(t, e) {
            var n;
            for (n = 0; n < this.global_callbacks.length; n++) this.global_callbacks[n](t, e);
            var i = this.callbacks.get(t);
            if (i && i.length > 0)
                for (n = 0; n < i.length; n++) i[n].fn.call(i[n].context || window, e);
            else this.failThrough && this.failThrough(t, e);
            return this
        }, e.prototype.get = function(t) {
            return this._callbacks[n(t)]
        }, e.prototype.add = function(t, e, i) {
            var r = n(t);
            this._callbacks[r] = this._callbacks[r] || [], this._callbacks[r].push({
                fn: e,
                context: i
            })
        }, e.prototype.remove = function(t, e, i) {
            if (!t && !e && !i) return void(this._callbacks = {});
            var r = t ? [n(t)] : Pusher.Util.keys(this._callbacks);
            e || i ? Pusher.Util.apply(r, function(t) {
                this._callbacks[t] = Pusher.Util.filter(this._callbacks[t] || [], function(t) {
                    return e && e !== t.fn || i && i !== t.context
                }), 0 === this._callbacks[t].length && delete this._callbacks[t]
            }, this) : Pusher.Util.apply(r, function(t) {
                delete this._callbacks[t]
            }, this)
        }, Pusher.EventsDispatcher = t
    }.call(this),
    function() {
        function t(t, e) {
            this.lastId = 0, this.prefix = t, this.name = e
        }
        var e = t.prototype;
        e.create = function(t) {
            this.lastId++;
            var e = this.lastId,
                n = this.prefix + e,
                i = this.name + "[" + e + "]",
                r = !1,
                s = function() {
                    r || (t.apply(null, arguments), r = !0)
                };
            return this[e] = s, {
                number: e,
                id: n,
                name: i,
                callback: s
            }
        }, e.remove = function(t) {
            delete this[t.number]
        }, Pusher.ScriptReceiverFactory = t, Pusher.ScriptReceivers = new t("_pusher_script_", "Pusher.ScriptReceivers")
    }.call(this),
    function() {
        function t(t) {
            this.src = t
        }
        var e = t.prototype;
        e.send = function(t) {
            var e = this,
                n = "Error loading " + e.src;
            e.script = document.createElement("script"), e.script.id = t.id, e.script.src = e.src, e.script.type = "text/javascript", e.script.charset = "UTF-8", e.script.addEventListener ? (e.script.onerror = function() {
                t.callback(n)
            }, e.script.onload = function() {
                t.callback(null)
            }) : e.script.onreadystatechange = function() {
                ("loaded" === e.script.readyState || "complete" === e.script.readyState) && t.callback(null)
            }, void 0 === e.script.async && document.attachEvent && /opera/i.test(navigator.userAgent) ? (e.errorScript = document.createElement("script"), e.errorScript.id = t.id + "_error", e.errorScript.text = t.name + "('" + n + "');", e.script.async = e.errorScript.async = !1) : e.script.async = !0;
            var i = document.getElementsByTagName("head")[0];
            i.insertBefore(e.script, i.firstChild), e.errorScript && i.insertBefore(e.errorScript, e.script.nextSibling)
        }, e.cleanup = function() {
            this.script && (this.script.onload = this.script.onerror = null, this.script.onreadystatechange = null), this.script && this.script.parentNode && this.script.parentNode.removeChild(this.script), this.errorScript && this.errorScript.parentNode && this.errorScript.parentNode.removeChild(this.errorScript), this.script = null, this.errorScript = null
        }, Pusher.ScriptRequest = t
    }.call(this),
    function() {
        function t(t) {
            this.options = t, this.receivers = t.receivers || Pusher.ScriptReceivers, this.loading = {}
        }
        var e = t.prototype;
        e.load = function(t, e) {
            var n = this;
            if (n.loading[t] && n.loading[t].length > 0) n.loading[t].push(e);
            else {
                n.loading[t] = [e];
                var i = new Pusher.ScriptRequest(n.getPath(t)),
                    r = n.receivers.create(function(e) {
                        if (n.receivers.remove(r), n.loading[t]) {
                            var s = n.loading[t];
                            delete n.loading[t];
                            for (var o = function(t) {
                                    t || i.cleanup()
                                }, a = 0; a < s.length; a++) s[a](e, o)
                        }
                    });
                i.send(r)
            }
        }, e.getRoot = function(t) {
            var e, n = Pusher.Util.getDocument().location.protocol;
            return e = t && t.encrypted || "https:" === n ? this.options.cdn_https : this.options.cdn_http, e.replace(/\/*$/, "") + "/" + this.options.version
        }, e.getPath = function(t, e) {
            return this.getRoot(e) + "/" + t + this.options.suffix + ".js"
        }, Pusher.DependencyLoader = t
    }.call(this),
    function() {
        function t() {
            Pusher.ready()
        }

        function e(t) {
            document.body ? t() : setTimeout(function() {
                e(t)
            }, 0)
        }

        function n() {
            e(t)
        }
        Pusher.DependenciesReceivers = new Pusher.ScriptReceiverFactory("_pusher_dependencies", "Pusher.DependenciesReceivers"), Pusher.Dependencies = new Pusher.DependencyLoader({
            cdn_http: Pusher.cdn_http,
            cdn_https: Pusher.cdn_https,
            version: Pusher.VERSION,
            suffix: Pusher.dependency_suffix,
            receivers: Pusher.DependenciesReceivers
        }), window.JSON ? n() : Pusher.Dependencies.load("json2", n)
    }(),
    function() {
        for (var t = {
                encode: function(t) {
                    return u(a(t))
                }
            }, e = String.fromCharCode, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {}, r = 0, s = n.length; s > r; r++) i[n.charAt(r)] = r;
        var o = function(t) {
                var n = t.charCodeAt(0);
                return 128 > n ? t : 2048 > n ? e(192 | n >>> 6) + e(128 | 63 & n) : e(224 | n >>> 12 & 15) + e(128 | n >>> 6 & 63) + e(128 | 63 & n)
            },
            a = function(t) {
                return t.replace(/[^\x00-\x7F]/g, o)
            },
            c = function(t) {
                var e = [0, 2, 1][t.length % 3],
                    i = t.charCodeAt(0) << 16 | (t.length > 1 ? t.charCodeAt(1) : 0) << 8 | (t.length > 2 ? t.charCodeAt(2) : 0),
                    r = [n.charAt(i >>> 18), n.charAt(i >>> 12 & 63), e >= 2 ? "=" : n.charAt(i >>> 6 & 63), e >= 1 ? "=" : n.charAt(63 & i)];
                return r.join("")
            },
            u = window.btoa || function(t) {
                return t.replace(/[\s\S]{1,3}/g, c)
            };
        Pusher.Base64 = t
    }.call(this),
    function() {
        function t(t, e) {
            this.url = t, this.data = e
        }

        function e(t) {
            return Pusher.Util.mapObject(t, function(t) {
                return "object" == typeof t && (t = JSON.stringify(t)), encodeURIComponent(Pusher.Base64.encode(t.toString()))
            })
        }
        var n = t.prototype;
        n.send = function(t) {
            if (!this.request) {
                var n = Pusher.Util.filterObject(this.data, function(t) {
                        return void 0 !== t
                    }),
                    i = Pusher.Util.map(Pusher.Util.flatten(e(n)), Pusher.Util.method("join", "=")).join("&"),
                    r = this.url + "/" + t.number + "?" + i;
                this.request = new Pusher.ScriptRequest(r), this.request.send(t)
            }
        }, n.cleanup = function() {
            this.request && this.request.cleanup()
        }, Pusher.JSONPRequest = t
    }.call(this),
    function() {
        function t(t, e, n) {
            this.key = t, this.session = e, this.events = [], this.options = n || {}, this.sent = 0, this.uniqueID = 0
        }
        var e = t.prototype;
        t.ERROR = 3, t.INFO = 6, t.DEBUG = 7, e.log = function(t, e) {
            t <= this.options.level && (this.events.push(Pusher.Util.extend({}, e, {
                timestamp: Pusher.Util.now()
            })), this.options.limit && this.events.length > this.options.limit && this.events.shift())
        }, e.error = function(e) {
            this.log(t.ERROR, e)
        }, e.info = function(e) {
            this.log(t.INFO, e)
        }, e.debug = function(e) {
            this.log(t.DEBUG, e)
        }, e.isEmpty = function() {
            return 0 === this.events.length
        }, e.send = function(t, e) {
            var n = this,
                i = Pusher.Util.extend({
                    session: n.session,
                    bundle: n.sent + 1,
                    key: n.key,
                    lib: "js",
                    version: n.options.version,
                    cluster: n.options.cluster,
                    features: n.options.features,
                    timeline: n.events
                }, n.options.params);
            return n.events = [], t(i, function(t, i) {
                t || n.sent++, e && e(t, i)
            }), !0
        }, e.generateUniqueID = function() {
            return this.uniqueID++, this.uniqueID
        }, Pusher.Timeline = t
    }.call(this),
    function() {
        function t(t, e) {
            this.timeline = t, this.options = e || {}
        }
        var e = t.prototype;
        e.send = function(t, e) {
            var n = this;
            if (!n.timeline.isEmpty()) {
                var i = function(e, i) {
                    var r = "http" + (t ? "s" : "") + "://",
                        s = r + (n.host || n.options.host) + n.options.path,
                        o = new Pusher.JSONPRequest(s, e),
                        a = Pusher.ScriptReceivers.create(function(t, e) {
                            Pusher.ScriptReceivers.remove(a), o.cleanup(), e && e.host && (n.host = e.host), i && i(t, e)
                        });
                    o.send(a)
                };
                n.timeline.send(i, e)
            }
        }, Pusher.TimelineSender = t
    }.call(this),
    function() {
        function t(t) {
            this.strategies = t
        }

        function e(t, e, n) {
            var r = Pusher.Util.map(t, function(t, i, r, s) {
                return t.connect(e, n(i, s))
            });
            return {
                abort: function() {
                    Pusher.Util.apply(r, i)
                },
                forceMinPriority: function(t) {
                    Pusher.Util.apply(r, function(e) {
                        e.forceMinPriority(t)
                    })
                }
            }
        }

        function n(t) {
            return Pusher.Util.all(t, function(t) {
                return Boolean(t.error)
            })
        }

        function i(t) {
            t.error || t.aborted || (t.abort(), t.aborted = !0)
        }
        var r = t.prototype;
        r.isSupported = function() {
            return Pusher.Util.any(this.strategies, Pusher.Util.method("isSupported"))
        }, r.connect = function(t, i) {
            return e(this.strategies, t, function(t, e) {
                return function(r, s) {
                    return e[t].error = r, r ? void(n(e) && i(!0)) : (Pusher.Util.apply(e, function(t) {
                        t.forceMinPriority(s.transport.priority)
                    }), void i(null, s))
                }
            })
        }, Pusher.BestConnectedEverStrategy = t
    }.call(this),
    function() {
        function t(t, e, n) {
            this.strategy = t, this.transports = e, this.ttl = n.ttl || 18e5, this.encrypted = n.encrypted, this.timeline = n.timeline
        }

        function e(t) {
            return "pusherTransport" + (t ? "Encrypted" : "Unencrypted")
        }

        function n(t) {
            var n = Pusher.Util.getLocalStorage();
            if (n) try {
                var i = n[e(t)];
                if (i) return JSON.parse(i)
            } catch (s) {
                r(t)
            }
            return null
        }

        function i(t, n, i) {
            var r = Pusher.Util.getLocalStorage();
            if (r) try {
                r[e(t)] = JSON.stringify({
                    timestamp: Pusher.Util.now(),
                    transport: n,
                    latency: i
                })
            } catch (s) {}
        }

        function r(t) {
            var n = Pusher.Util.getLocalStorage();
            if (n) try {
                delete n[e(t)]
            } catch (i) {}
        }
        var s = t.prototype;
        s.isSupported = function() {
            return this.strategy.isSupported()
        }, s.connect = function(t, e) {
            var s = this.encrypted,
                o = n(s),
                a = [this.strategy];
            if (o && o.timestamp + this.ttl >= Pusher.Util.now()) {
                var c = this.transports[o.transport];
                c && (this.timeline.info({
                    cached: !0,
                    transport: o.transport,
                    latency: o.latency
                }), a.push(new Pusher.SequentialStrategy([c], {
                    timeout: 2 * o.latency + 1e3,
                    failFast: !0
                })))
            }
            var u = Pusher.Util.now(),
                h = a.pop().connect(t, function l(n, o) {
                    n ? (r(s), a.length > 0 ? (u = Pusher.Util.now(), h = a.pop().connect(t, l)) : e(n)) : (i(s, o.transport.name, Pusher.Util.now() - u), e(null, o))
                });
            return {
                abort: function() {
                    h.abort()
                },
                forceMinPriority: function(e) {
                    t = e, h && h.forceMinPriority(e)
                }
            }
        }, Pusher.CachedStrategy = t
    }.call(this),
    function() {
        function t(t, e) {
            this.strategy = t, this.options = {
                delay: e.delay
            }
        }
        var e = t.prototype;
        e.isSupported = function() {
            return this.strategy.isSupported()
        }, e.connect = function(t, e) {
            var n, i = this.strategy,
                r = new Pusher.Timer(this.options.delay, function() {
                    n = i.connect(t, e)
                });
            return {
                abort: function() {
                    r.ensureAborted(), n && n.abort()
                },
                forceMinPriority: function(e) {
                    t = e, n && n.forceMinPriority(e)
                }
            }
        }, Pusher.DelayedStrategy = t
    }.call(this),
    function() {
        function t(t) {
            this.strategy = t
        }
        var e = t.prototype;
        e.isSupported = function() {
            return this.strategy.isSupported()
        }, e.connect = function(t, e) {
            var n = this.strategy.connect(t, function(t, i) {
                i && n.abort(), e(t, i)
            });
            return n
        }, Pusher.FirstConnectedStrategy = t
    }.call(this),
    function() {
        function t(t, e, n) {
            this.test = t, this.trueBranch = e, this.falseBranch = n
        }
        var e = t.prototype;
        e.isSupported = function() {
            var t = this.test() ? this.trueBranch : this.falseBranch;
            return t.isSupported()
        }, e.connect = function(t, e) {
            var n = this.test() ? this.trueBranch : this.falseBranch;
            return n.connect(t, e)
        }, Pusher.IfStrategy = t
    }.call(this),
    function() {
        function t(t, e) {
            this.strategies = t, this.loop = Boolean(e.loop), this.failFast = Boolean(e.failFast), this.timeout = e.timeout, this.timeoutLimit = e.timeoutLimit
        }
        var e = t.prototype;
        e.isSupported = function() {
            return Pusher.Util.any(this.strategies, Pusher.Util.method("isSupported"))
        }, e.connect = function(t, e) {
            var n = this,
                i = this.strategies,
                r = 0,
                s = this.timeout,
                o = null,
                a = function(c, u) {
                    u ? e(null, u) : (r += 1, n.loop && (r %= i.length), r < i.length ? (s && (s = 2 * s, n.timeoutLimit && (s = Math.min(s, n.timeoutLimit))), o = n.tryStrategy(i[r], t, {
                        timeout: s,
                        failFast: n.failFast
                    }, a)) : e(!0))
                };
            return o = this.tryStrategy(i[r], t, {
                timeout: s,
                failFast: this.failFast
            }, a), {
                abort: function() {
                    o.abort()
                },
                forceMinPriority: function(e) {
                    t = e, o && o.forceMinPriority(e)
                }
            }
        }, e.tryStrategy = function(t, e, n, i) {
            var r = null,
                s = null;
            return n.timeout > 0 && (r = new Pusher.Timer(n.timeout, function() {
                s.abort(), i(!0)
            })), s = t.connect(e, function(t, e) {
                t && r && r.isRunning() && !n.failFast || (r && r.ensureAborted(), i(t, e))
            }), {
                abort: function() {
                    r && r.ensureAborted(), s.abort()
                },
                forceMinPriority: function(t) {
                    s.forceMinPriority(t)
                }
            }
        }, Pusher.SequentialStrategy = t
    }.call(this),
    function() {
        function t(t, e, n, i) {
            this.name = t, this.priority = e, this.transport = n, this.options = i || {}
        }

        function e(t, e) {
            return Pusher.Util.defer(function() {
                e(t)
            }), {
                abort: function() {},
                forceMinPriority: function() {}
            }
        }
        var n = t.prototype;
        n.isSupported = function() {
            return this.transport.isSupported({
                encrypted: this.options.encrypted
            })
        }, n.connect = function(t, n) {
            if (!this.isSupported()) return e(new Pusher.Errors.UnsupportedStrategy, n);
            if (this.priority < t) return e(new Pusher.Errors.TransportPriorityTooLow, n);
            var i = this,
                r = !1,
                s = this.transport.createConnection(this.name, this.priority, this.options.key, this.options),
                o = null,
                a = function() {
                    s.unbind("initialized", a), s.connect()
                },
                c = function() {
                    o = new Pusher.Handshake(s, function(t) {
                        r = !0, l(), n(null, t)
                    })
                },
                u = function(t) {
                    l(), n(t)
                },
                h = function() {
                    l(), n(new Pusher.Errors.TransportClosed(s))
                },
                l = function() {
                    s.unbind("initialized", a), s.unbind("open", c), s.unbind("error", u), s.unbind("closed", h)
                };
            return s.bind("initialized", a), s.bind("open", c), s.bind("error", u), s.bind("closed", h), s.initialize(), {
                abort: function() {
                    r || (l(), o ? o.close() : s.close())
                },
                forceMinPriority: function(t) {
                    r || i.priority < t && (o ? o.close() : s.close())
                }
            }
        }, Pusher.TransportStrategy = t
    }.call(this),
    function() {
        function t(t, e, n) {
            var i = t + (e.encrypted ? "s" : ""),
                r = e.encrypted ? e.hostEncrypted : e.hostUnencrypted;
            return i + "://" + r + n
        }

        function e(t, e) {
            var n = "/app/" + t,
                i = "?protocol=" + Pusher.PROTOCOL + "&client=js&version=" + Pusher.VERSION + (e ? "&" + e : "");
            return n + i
        }
        Pusher.URLSchemes = {
            ws: {
                getInitial: function(n, i) {
                    return t("ws", i, e(n, "flash=false"))
                }
            },
            flash: {
                getInitial: function(n, i) {
                    return t("ws", i, e(n, "flash=true"))
                }
            },
            sockjs: {
                getInitial: function(e, n) {
                    return t("http", n, n.httpPath || "/pusher", "")
                },
                getPath: function(t) {
                    return e(t)
                }
            },
            http: {
                getInitial: function(n, i) {
                    var r = (i.httpPath || "/pusher") + e(n);
                    return t("http", i, r)
                }
            }
        }
    }.call(this),
    function() {
        function t(t, e, n, i, r) {
            Pusher.EventsDispatcher.call(this), this.hooks = t, this.name = e, this.priority = n, this.key = i, this.options = r, this.state = "new", this.timeline = r.timeline, this.activityTimeout = r.activityTimeout, this.id = this.timeline.generateUniqueID()
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.EventsDispatcher.prototype), e.handlesActivityChecks = function() {
            return Boolean(this.hooks.handlesActivityChecks)
        }, e.supportsPing = function() {
            return Boolean(this.hooks.supportsPing)
        }, e.initialize = function() {
            var t = this;
            t.timeline.info(t.buildTimelineMessage({
                transport: t.name + (t.options.encrypted ? "s" : "")
            })), t.hooks.beforeInitialize && t.hooks.beforeInitialize(), t.hooks.isInitialized() ? t.changeState("initialized") : t.hooks.file ? (t.changeState("initializing"), Pusher.Dependencies.load(t.hooks.file, function(e, n) {
                t.hooks.isInitialized() ? (t.changeState("initialized"), n(!0)) : (e && t.onError(e), t.onClose(), n(!1))
            })) : t.onClose()
        }, e.connect = function() {
            var t = this;
            if (t.socket || "initialized" !== t.state) return !1;
            var e = t.hooks.urls.getInitial(t.key, t.options);
            try {
                t.socket = t.hooks.getSocket(e, t.options)
            } catch (n) {
                return Pusher.Util.defer(function() {
                    t.onError(n), t.changeState("closed")
                }), !1
            }
            return t.bindListeners(), Pusher.debug("Connecting", {
                transport: t.name,
                url: e
            }), t.changeState("connecting"), !0
        }, e.close = function() {
            return this.socket ? (this.socket.close(), !0) : !1
        }, e.send = function(t) {
            var e = this;
            return "open" === e.state ? (Pusher.Util.defer(function() {
                e.socket && e.socket.send(t)
            }), !0) : !1
        }, e.ping = function() {
            "open" === this.state && this.supportsPing() && this.socket.ping()
        }, e.onOpen = function() {
            this.hooks.beforeOpen && this.hooks.beforeOpen(this.socket, this.hooks.urls.getPath(this.key, this.options)), this.changeState("open"), this.socket.onopen = void 0
        }, e.onError = function(t) {
            this.emit("error", {
                type: "WebSocketError",
                error: t
            }), this.timeline.error(this.buildTimelineMessage({
                error: t.toString()
            }))
        }, e.onClose = function(t) {
            t ? this.changeState("closed", {
                code: t.code,
                reason: t.reason,
                wasClean: t.wasClean
            }) : this.changeState("closed"), this.unbindListeners(), this.socket = void 0
        }, e.onMessage = function(t) {
            this.emit("message", t)
        }, e.onActivity = function() {
            this.emit("activity")
        }, e.bindListeners = function() {
            var t = this;
            t.socket.onopen = function() {
                t.onOpen()
            }, t.socket.onerror = function(e) {
                t.onError(e)
            }, t.socket.onclose = function(e) {
                t.onClose(e)
            }, t.socket.onmessage = function(e) {
                t.onMessage(e)
            }, t.supportsPing() && (t.socket.onactivity = function() {
                t.onActivity()
            })
        }, e.unbindListeners = function() {
            this.socket && (this.socket.onopen = void 0, this.socket.onerror = void 0, this.socket.onclose = void 0, this.socket.onmessage = void 0, this.supportsPing() && (this.socket.onactivity = void 0))
        }, e.changeState = function(t, e) {
            this.state = t, this.timeline.info(this.buildTimelineMessage({
                state: t,
                params: e
            })), this.emit(t, e)
        }, e.buildTimelineMessage = function(t) {
            return Pusher.Util.extend({
                cid: this.id
            }, t)
        }, Pusher.TransportConnection = t
    }.call(this),
    function() {
        function t(t) {
            this.hooks = t
        }
        var e = t.prototype;
        e.isSupported = function(t) {
            return this.hooks.isSupported(t)
        }, e.createConnection = function(t, e, n, i) {
            return new Pusher.TransportConnection(this.hooks, t, e, n, i)
        }, Pusher.Transport = t
    }.call(this),
    function() {
        Pusher.WSTransport = new Pusher.Transport({
            urls: Pusher.URLSchemes.ws,
            handlesActivityChecks: !1,
            supportsPing: !1,
            isInitialized: function() {
                return Boolean(window.WebSocket || window.MozWebSocket)
            },
            isSupported: function() {
                return Boolean(window.WebSocket || window.MozWebSocket)
            },
            getSocket: function(t) {
                var e = window.WebSocket || window.MozWebSocket;
                return new e(t)
            }
        }), Pusher.FlashTransport = new Pusher.Transport({
            file: "flashfallback",
            urls: Pusher.URLSchemes.flash,
            handlesActivityChecks: !1,
            supportsPing: !1,
            isSupported: function() {
                try {
                    return Boolean(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))
                } catch (t) {
                    try {
                        var e = Pusher.Util.getNavigator();
                        return Boolean(e && e.mimeTypes && void 0 !== e.mimeTypes["application/x-shockwave-flash"])
                    } catch (n) {
                        return !1
                    }
                }
            },
            beforeInitialize: function() {
                void 0 === window.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR && (window.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR = !0), window.WEB_SOCKET_SWF_LOCATION = Pusher.Dependencies.getRoot() + "/WebSocketMain.swf"
            },
            isInitialized: function() {
                return void 0 !== window.FlashWebSocket
            },
            getSocket: function(t) {
                return new FlashWebSocket(t)
            }
        }), Pusher.SockJSTransport = new Pusher.Transport({
            file: "sockjs",
            urls: Pusher.URLSchemes.sockjs,
            handlesActivityChecks: !0,
            supportsPing: !1,
            isSupported: function() {
                return !0
            },
            isInitialized: function() {
                return void 0 !== window.SockJS
            },
            getSocket: function(t, e) {
                return new SockJS(t, null, {
                    js_path: Pusher.Dependencies.getPath("sockjs", {
                        encrypted: e.encrypted
                    }),
                    ignore_null_origin: e.ignoreNullOrigin
                })
            },
            beforeOpen: function(t, e) {
                t.send(JSON.stringify({
                    path: e
                }))
            }
        });
        var t = {
                urls: Pusher.URLSchemes.http,
                handlesActivityChecks: !1,
                supportsPing: !0,
                isInitialized: function() {
                    return Boolean(Pusher.HTTP.Socket)
                }
            },
            e = Pusher.Util.extend({
                getSocket: function(t) {
                    return Pusher.HTTP.getStreamingSocket(t)
                }
            }, t),
            n = Pusher.Util.extend({
                getSocket: function(t) {
                    return Pusher.HTTP.getPollingSocket(t)
                }
            }, t),
            i = {
                file: "xhr",
                isSupported: Pusher.Util.isXHRSupported
            },
            r = {
                file: "xdr",
                isSupported: function(t) {
                    return Pusher.Util.isXDRSupported(t.encrypted)
                }
            };
        Pusher.XHRStreamingTransport = new Pusher.Transport(Pusher.Util.extend({}, e, i)), Pusher.XDRStreamingTransport = new Pusher.Transport(Pusher.Util.extend({}, e, r)), Pusher.XHRPollingTransport = new Pusher.Transport(Pusher.Util.extend({}, n, i)), Pusher.XDRPollingTransport = new Pusher.Transport(Pusher.Util.extend({}, n, r))
    }.call(this),
    function() {
        function t(t, e, n) {
            this.manager = t, this.transport = e, this.minPingDelay = n.minPingDelay, this.maxPingDelay = n.maxPingDelay, this.pingDelay = void 0
        }
        var e = t.prototype;
        e.createConnection = function(t, e, n, i) {
            var r = this;
            i = Pusher.Util.extend({}, i, {
                activityTimeout: r.pingDelay
            });
            var s = r.transport.createConnection(t, e, n, i),
                o = null,
                a = function() {
                    s.unbind("open", a), s.bind("closed", c), o = Pusher.Util.now()
                },
                c = function(t) {
                    if (s.unbind("closed", c), 1002 === t.code || 1003 === t.code) r.manager.reportDeath();
                    else if (!t.wasClean && o) {
                        var e = Pusher.Util.now() - o;
                        e < 2 * r.maxPingDelay && (r.manager.reportDeath(), r.pingDelay = Math.max(e / 2, r.minPingDelay))
                    }
                };
            return s.bind("open", a), s
        }, e.isSupported = function(t) {
            return this.manager.isAlive() && this.transport.isSupported(t)
        }, Pusher.AssistantToTheTransportManager = t
    }.call(this),
    function() {
        function t(t) {
            this.options = t || {}, this.livesLeft = this.options.lives || 1 / 0
        }
        var e = t.prototype;
        e.getAssistant = function(t) {
            return new Pusher.AssistantToTheTransportManager(this, t, {
                minPingDelay: this.options.minPingDelay,
                maxPingDelay: this.options.maxPingDelay
            })
        }, e.isAlive = function() {
            return this.livesLeft > 0
        }, e.reportDeath = function() {
            this.livesLeft -= 1
        }, Pusher.TransportManager = t
    }.call(this),
    function() {
        function t(t) {
            return function(e) {
                return [t.apply(this, arguments), e]
            }
        }

        function e(t) {
            return "string" == typeof t && ":" === t.charAt(0)
        }

        function n(t, e) {
            return e[t.slice(1)]
        }

        function i(t, e) {
            if (0 === t.length) return [
                [], e
            ];
            var n = o(t[0], e),
                r = i(t.slice(1), n[1]);
            return [
                [n[0]].concat(r[0]), r[1]
            ]
        }

        function r(t, i) {
            if (!e(t)) return [t, i];
            var r = n(t, i);
            if (void 0 === r) throw "Undefined symbol " + t;
            return [r, i]
        }

        function s(t, r) {
            if (e(t[0])) {
                var s = n(t[0], r);
                if (t.length > 1) {
                    if ("function" != typeof s) throw "Calling non-function " + t[0];
                    var a = [Pusher.Util.extend({}, r)].concat(Pusher.Util.map(t.slice(1), function(t) {
                        return o(t, Pusher.Util.extend({}, r))[0]
                    }));
                    return s.apply(this, a)
                }
                return [s, r]
            }
            return i(t, r)
        }

        function o(t, e) {
            return "string" == typeof t ? r(t, e) : "object" == typeof t && t instanceof Array && t.length > 0 ? s(t, e) : [t, e]
        }
        var a = {
                build: function(t, e) {
                    var n = Pusher.Util.extend({}, h, e);
                    return o(t, n)[1].strategy
                }
            },
            c = {
                ws: Pusher.WSTransport,
                flash: Pusher.FlashTransport,
                sockjs: Pusher.SockJSTransport,
                xhr_streaming: Pusher.XHRStreamingTransport,
                xdr_streaming: Pusher.XDRStreamingTransport,
                xhr_polling: Pusher.XHRPollingTransport,
                xdr_polling: Pusher.XDRPollingTransport
            },
            u = {
                isSupported: function() {
                    return !1
                },
                connect: function(t, e) {
                    var n = Pusher.Util.defer(function() {
                        e(new Pusher.Errors.UnsupportedStrategy)
                    });
                    return {
                        abort: function() {
                            n.ensureAborted()
                        },
                        forceMinPriority: function() {}
                    }
                }
            },
            h = {
                extend: function(t, e, n) {
                    return [Pusher.Util.extend({}, e, n), t]
                },
                def: function(t, e, n) {
                    if (void 0 !== t[e]) throw "Redefining symbol " + e;
                    return t[e] = n, [void 0, t]
                },
                def_transport: function(t, e, n, i, r, s) {
                    var o = c[n];
                    if (!o) throw new Pusher.Errors.UnsupportedTransport(n);
                    var a, h = !(t.enabledTransports && -1 === Pusher.Util.arrayIndexOf(t.enabledTransports, e) || t.disabledTransports && -1 !== Pusher.Util.arrayIndexOf(t.disabledTransports, e) || "flash" === e && t.disableFlash === !0);
                    a = h ? new Pusher.TransportStrategy(e, i, s ? s.getAssistant(o) : o, Pusher.Util.extend({
                        key: t.key,
                        encrypted: t.encrypted,
                        timeline: t.timeline,
                        ignoreNullOrigin: t.ignoreNullOrigin
                    }, r)) : u;
                    var l = t.def(t, e, a)[1];
                    return l.transports = t.transports || {}, l.transports[e] = a, [void 0, l]
                },
                transport_manager: t(function(t, e) {
                    return new Pusher.TransportManager(e)
                }),
                sequential: t(function(t, e) {
                    var n = Array.prototype.slice.call(arguments, 2);
                    return new Pusher.SequentialStrategy(n, e)
                }),
                cached: t(function(t, e, n) {
                    return new Pusher.CachedStrategy(n, t.transports, {
                        ttl: e,
                        timeline: t.timeline,
                        encrypted: t.encrypted
                    })
                }),
                first_connected: t(function(t, e) {
                    return new Pusher.FirstConnectedStrategy(e)
                }),
                best_connected_ever: t(function() {
                    var t = Array.prototype.slice.call(arguments, 1);
                    return new Pusher.BestConnectedEverStrategy(t)
                }),
                delayed: t(function(t, e, n) {
                    return new Pusher.DelayedStrategy(n, {
                        delay: e
                    })
                }),
                "if": t(function(t, e, n, i) {
                    return new Pusher.IfStrategy(e, n, i)
                }),
                is_supported: t(function(t, e) {
                    return function() {
                        return e.isSupported()
                    }
                })
            };
        Pusher.StrategyBuilder = a
    }.call(this),
    function() {
        var t = {};
        t.decodeMessage = function(t) {
            try {
                var e = JSON.parse(t.data);
                if ("string" == typeof e.data) try {
                    e.data = JSON.parse(e.data)
                } catch (n) {
                    if (!(n instanceof SyntaxError)) throw n
                }
                return e
            } catch (n) {
                throw {
                    type: "MessageParseError",
                    error: n,
                    data: t.data
                }
            }
        }, t.encodeMessage = function(t) {
            return JSON.stringify(t)
        }, t.processHandshake = function(t) {
            if (t = this.decodeMessage(t), "pusher:connection_established" === t.event) {
                if (!t.data.activity_timeout) throw "No activity timeout specified in handshake";
                return {
                    action: "connected",
                    id: t.data.socket_id,
                    activityTimeout: 1e3 * t.data.activity_timeout
                }
            }
            if ("pusher:error" === t.event) return {
                action: this.getCloseAction(t.data),
                error: this.getCloseError(t.data)
            };
            throw "Invalid handshake"
        }, t.getCloseAction = function(t) {
            return t.code < 4e3 ? t.code >= 1002 && t.code <= 1004 ? "backoff" : null : 4e3 === t.code ? "ssl_only" : t.code < 4100 ? "refused" : t.code < 4200 ? "backoff" : t.code < 4300 ? "retry" : "refused"
        }, t.getCloseError = function(t) {
            return 1e3 !== t.code && 1001 !== t.code ? {
                type: "PusherError",
                data: {
                    code: t.code,
                    message: t.reason || t.message
                }
            } : null
        }, Pusher.Protocol = t
    }.call(this),
    function() {
        function t(t, e) {
            Pusher.EventsDispatcher.call(this), this.id = t, this.transport = e, this.activityTimeout = e.activityTimeout, this.bindListeners()
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.EventsDispatcher.prototype), e.handlesActivityChecks = function() {
            return this.transport.handlesActivityChecks()
        }, e.send = function(t) {
            return this.transport.send(t)
        }, e.send_event = function(t, e, n) {
            var i = {
                event: t,
                data: e
            };
            return n && (i.channel = n), Pusher.debug("Event sent", i), this.send(Pusher.Protocol.encodeMessage(i))
        }, e.ping = function() {
            this.transport.supportsPing() ? this.transport.ping() : this.send_event("pusher:ping", {})
        }, e.close = function() {
            this.transport.close()
        }, e.bindListeners = function() {
            var t = this,
                e = {
                    message: function(e) {
                        var n;
                        try {
                            n = Pusher.Protocol.decodeMessage(e)
                        } catch (i) {
                            t.emit("error", {
                                type: "MessageParseError",
                                error: i,
                                data: e.data
                            })
                        }
                        if (void 0 !== n) {
                            switch (Pusher.debug("Event recd", n), n.event) {
                                case "pusher:error":
                                    t.emit("error", {
                                        type: "PusherError",
                                        data: n.data
                                    });
                                    break;
                                case "pusher:ping":
                                    t.emit("ping");
                                    break;
                                case "pusher:pong":
                                    t.emit("pong")
                            }
                            t.emit("message", n)
                        }
                    },
                    activity: function() {
                        t.emit("activity")
                    },
                    error: function(e) {
                        t.emit("error", {
                            type: "WebSocketError",
                            error: e
                        })
                    },
                    closed: function(e) {
                        n(), e && e.code && t.handleCloseEvent(e), t.transport = null, t.emit("closed")
                    }
                },
                n = function() {
                    Pusher.Util.objectApply(e, function(e, n) {
                        t.transport.unbind(n, e)
                    })
                };
            Pusher.Util.objectApply(e, function(e, n) {
                t.transport.bind(n, e)
            })
        }, e.handleCloseEvent = function(t) {
            var e = Pusher.Protocol.getCloseAction(t),
                n = Pusher.Protocol.getCloseError(t);
            n && this.emit("error", n), e && this.emit(e)
        }, Pusher.Connection = t
    }.call(this),
    function() {
        function t(t, e) {
            this.transport = t, this.callback = e, this.bindListeners()
        }
        var e = t.prototype;
        e.close = function() {
            this.unbindListeners(), this.transport.close()
        }, e.bindListeners = function() {
            var t = this;
            t.onMessage = function(e) {
                t.unbindListeners();
                try {
                    var n = Pusher.Protocol.processHandshake(e);
                    "connected" === n.action ? t.finish("connected", {
                        connection: new Pusher.Connection(n.id, t.transport),
                        activityTimeout: n.activityTimeout
                    }) : (t.finish(n.action, {
                        error: n.error
                    }), t.transport.close())
                } catch (i) {
                    t.finish("error", {
                        error: i
                    }), t.transport.close()
                }
            }, t.onClosed = function(e) {
                t.unbindListeners();
                var n = Pusher.Protocol.getCloseAction(e) || "backoff",
                    i = Pusher.Protocol.getCloseError(e);
                t.finish(n, {
                    error: i
                })
            }, t.transport.bind("message", t.onMessage), t.transport.bind("closed", t.onClosed)
        }, e.unbindListeners = function() {
            this.transport.unbind("message", this.onMessage), this.transport.unbind("closed", this.onClosed)
        }, e.finish = function(t, e) {
            this.callback(Pusher.Util.extend({
                transport: this.transport,
                action: t
            }, e))
        }, Pusher.Handshake = t
    }.call(this),
    function() {
        function t(t, e) {
            Pusher.EventsDispatcher.call(this), this.key = t, this.options = e || {}, this.state = "initialized", this.connection = null, this.encrypted = !!e.encrypted, this.timeline = this.options.timeline, this.connectionCallbacks = this.buildConnectionCallbacks(), this.errorCallbacks = this.buildErrorCallbacks(), this.handshakeCallbacks = this.buildHandshakeCallbacks(this.errorCallbacks);
            var n = this;
            Pusher.Network.bind("online", function() {
                n.timeline.info({
                    netinfo: "online"
                }), ("connecting" === n.state || "unavailable" === n.state) && n.retryIn(0)
            }), Pusher.Network.bind("offline", function() {
                n.timeline.info({
                    netinfo: "offline"
                }), n.connection && n.sendActivityCheck()
            }), this.updateStrategy()
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.EventsDispatcher.prototype), e.connect = function() {
            if (!this.connection && !this.runner) {
                if (!this.strategy.isSupported()) return void this.updateState("failed");
                this.updateState("connecting"), this.startConnecting(), this.setUnavailableTimer()
            }
        }, e.send = function(t) {
            return this.connection ? this.connection.send(t) : !1
        }, e.send_event = function(t, e, n) {
            return this.connection ? this.connection.send_event(t, e, n) : !1
        }, e.disconnect = function() {
            this.disconnectInternally(), this.updateState("disconnected")
        }, e.isEncrypted = function() {
            return this.encrypted
        }, e.startConnecting = function() {
            var t = this,
                e = function(n, i) {
                    n ? t.runner = t.strategy.connect(0, e) : "error" === i.action ? (t.emit("error", {
                        type: "HandshakeError",
                        error: i.error
                    }), t.timeline.error({
                        handshakeError: i.error
                    })) : (t.abortConnecting(), t.handshakeCallbacks[i.action](i))
                };
            t.runner = t.strategy.connect(0, e)
        }, e.abortConnecting = function() {
            this.runner && (this.runner.abort(), this.runner = null)
        }, e.disconnectInternally = function() {
            if (this.abortConnecting(), this.clearRetryTimer(), this.clearUnavailableTimer(), this.connection) {
                var t = this.abandonConnection();
                t.close()
            }
        }, e.updateStrategy = function() {
            this.strategy = this.options.getStrategy({
                key: this.key,
                timeline: this.timeline,
                encrypted: this.encrypted
            })
        }, e.retryIn = function(t) {
            var e = this;
            e.timeline.info({
                action: "retry",
                delay: t
            }), t > 0 && e.emit("connecting_in", Math.round(t / 1e3)), e.retryTimer = new Pusher.Timer(t || 0, function() {
                e.disconnectInternally(), e.connect()
            })
        }, e.clearRetryTimer = function() {
            this.retryTimer && (this.retryTimer.ensureAborted(), this.retryTimer = null)
        }, e.setUnavailableTimer = function() {
            var t = this;
            t.unavailableTimer = new Pusher.Timer(t.options.unavailableTimeout, function() {
                t.updateState("unavailable")
            })
        }, e.clearUnavailableTimer = function() {
            this.unavailableTimer && this.unavailableTimer.ensureAborted()
        }, e.sendActivityCheck = function() {
            var t = this;
            t.stopActivityCheck(), t.connection.ping(), t.activityTimer = new Pusher.Timer(t.options.pongTimeout, function() {
                t.timeline.error({
                    pong_timed_out: t.options.pongTimeout
                }), t.retryIn(0)
            })
        }, e.resetActivityCheck = function() {
            var t = this;
            t.stopActivityCheck(), t.connection.handlesActivityChecks() || (t.activityTimer = new Pusher.Timer(t.activityTimeout, function() {
                t.sendActivityCheck()
            }))
        }, e.stopActivityCheck = function() {
            this.activityTimer && this.activityTimer.ensureAborted()
        }, e.buildConnectionCallbacks = function() {
            var t = this;
            return {
                message: function(e) {
                    t.resetActivityCheck(), t.emit("message", e)
                },
                ping: function() {
                    t.send_event("pusher:pong", {})
                },
                activity: function() {
                    t.resetActivityCheck()
                },
                error: function(e) {
                    t.emit("error", {
                        type: "WebSocketError",
                        error: e
                    })
                },
                closed: function() {
                    t.abandonConnection(), t.shouldRetry() && t.retryIn(1e3)
                }
            }
        }, e.buildHandshakeCallbacks = function(t) {
            var e = this;
            return Pusher.Util.extend({}, t, {
                connected: function(t) {
                    e.activityTimeout = Math.min(e.options.activityTimeout, t.activityTimeout, t.connection.activityTimeout || 1 / 0), e.clearUnavailableTimer(), e.setConnection(t.connection), e.socket_id = e.connection.id, e.updateState("connected", {
                        socket_id: e.socket_id
                    })
                }
            })
        }, e.buildErrorCallbacks = function() {
            function t(t) {
                return function(n) {
                    n.error && e.emit("error", {
                        type: "WebSocketError",
                        error: n.error
                    }), t(n)
                }
            }
            var e = this;
            return {
                ssl_only: t(function() {
                    e.encrypted = !0, e.updateStrategy(), e.retryIn(0)
                }),
                refused: t(function() {
                    e.disconnect()
                }),
                backoff: t(function() {
                    e.retryIn(1e3)
                }),
                retry: t(function() {
                    e.retryIn(0)
                })
            }
        }, e.setConnection = function(t) {
            this.connection = t;
            for (var e in this.connectionCallbacks) this.connection.bind(e, this.connectionCallbacks[e]);
            this.resetActivityCheck()
        }, e.abandonConnection = function() {
            if (this.connection) {
                this.stopActivityCheck();
                for (var t in this.connectionCallbacks) this.connection.unbind(t, this.connectionCallbacks[t]);
                var e = this.connection;
                return this.connection = null, e
            }
        }, e.updateState = function(t, e) {
            var n = this.state;
            this.state = t, n !== t && (Pusher.debug("State changed", n + " -> " + t), this.timeline.info({
                state: t,
                params: e
            }), this.emit("state_change", {
                previous: n,
                current: t
            }), this.emit(t, e))
        }, e.shouldRetry = function() {
            return "connecting" === this.state || "connected" === this.state
        }, Pusher.ConnectionManager = t
    }.call(this),
    function() {
        function t() {
            Pusher.EventsDispatcher.call(this);
            var t = this;
            void 0 !== window.addEventListener && (window.addEventListener("online", function() {
                t.emit("online")
            }, !1), window.addEventListener("offline", function() {
                t.emit("offline")
            }, !1))
        }
        Pusher.Util.extend(t.prototype, Pusher.EventsDispatcher.prototype);
        var e = t.prototype;
        e.isOnline = function() {
            return void 0 === window.navigator.onLine ? !0 : window.navigator.onLine
        }, Pusher.NetInfo = t, Pusher.Network = new t
    }.call(this),
    function() {
        function t() {
            this.reset()
        }
        var e = t.prototype;
        e.get = function(t) {
            return Object.prototype.hasOwnProperty.call(this.members, t) ? {
                id: t,
                info: this.members[t]
            } : null
        }, e.each = function(t) {
            var e = this;
            Pusher.Util.objectApply(e.members, function(n, i) {
                t(e.get(i))
            })
        }, e.setMyID = function(t) {
            this.myID = t
        }, e.onSubscription = function(t) {
            this.members = t.presence.hash, this.count = t.presence.count, this.me = this.get(this.myID)
        }, e.addMember = function(t) {
            return null === this.get(t.user_id) && this.count++, this.members[t.user_id] = t.user_info, this.get(t.user_id)
        }, e.removeMember = function(t) {
            var e = this.get(t.user_id);
            return e && (delete this.members[t.user_id], this.count--), e
        }, e.reset = function() {
            this.members = {}, this.count = 0, this.myID = null, this.me = null
        }, Pusher.Members = t
    }.call(this),
    function() {
        function t(t, e) {
            Pusher.EventsDispatcher.call(this, function(e) {
                Pusher.debug("No callbacks on " + t + " for " + e)
            }), this.name = t, this.pusher = e, this.subscribed = !1
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.EventsDispatcher.prototype), e.authorize = function(t, e) {
            return e(!1, {})
        }, e.trigger = function(t, e) {
            if (0 !== t.indexOf("client-")) throw new Pusher.Errors.BadEventName("Event '" + t + "' does not start with 'client-'");
            return this.pusher.send_event(t, e, this.name)
        }, e.disconnect = function() {
            this.subscribed = !1
        }, e.handleEvent = function(t, e) {
            0 === t.indexOf("pusher_internal:") ? "pusher_internal:subscription_succeeded" === t && (this.subscribed = !0, this.emit("pusher:subscription_succeeded", e)) : this.emit(t, e)
        }, e.subscribe = function() {
            var t = this;
            t.authorize(t.pusher.connection.socket_id, function(e, n) {
                e ? t.handleEvent("pusher:subscription_error", n) : t.pusher.send_event("pusher:subscribe", {
                    auth: n.auth,
                    channel_data: n.channel_data,
                    channel: t.name
                })
            })
        }, e.unsubscribe = function() {
            this.pusher.send_event("pusher:unsubscribe", {
                channel: this.name
            })
        }, Pusher.Channel = t
    }.call(this),
    function() {
        function t(t, e) {
            Pusher.Channel.call(this, t, e)
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.Channel.prototype), e.authorize = function(t, e) {
            var n = new Pusher.Channel.Authorizer(this, this.pusher.config);
            return n.authorize(t, e)
        }, Pusher.PrivateChannel = t
    }.call(this),
    function() {
        function t(t, e) {
            Pusher.PrivateChannel.call(this, t, e), this.members = new Pusher.Members
        }
        var e = t.prototype;
        Pusher.Util.extend(e, Pusher.PrivateChannel.prototype), e.authorize = function(t, e) {
            var n = Pusher.PrivateChannel.prototype.authorize,
                i = this;
            n.call(i, t, function(t, n) {
                if (!t) {
                    if (void 0 === n.channel_data) return Pusher.warn("Invalid auth response for channel '" + i.name + "', expected 'channel_data' field"), void e("Invalid auth response");
                    var r = JSON.parse(n.channel_data);
                    i.members.setMyID(r.user_id)
                }
                e(t, n)
            })
        }, e.handleEvent = function(t, e) {
            switch (t) {
                case "pusher_internal:subscription_succeeded":
                    this.members.onSubscription(e), this.subscribed = !0, this.emit("pusher:subscription_succeeded", this.members);
                    break;
                case "pusher_internal:member_added":
                    var n = this.members.addMember(e);
                    this.emit("pusher:member_added", n);
                    break;
                case "pusher_internal:member_removed":
                    var i = this.members.removeMember(e);
                    i && this.emit("pusher:member_removed", i);
                    break;
                default:
                    Pusher.PrivateChannel.prototype.handleEvent.call(this, t, e)
            }
        }, e.disconnect = function() {
            this.members.reset(), Pusher.PrivateChannel.prototype.disconnect.call(this)
        }, Pusher.PresenceChannel = t
    }.call(this),
    function() {
        function t() {
            this.channels = {}
        }

        function e(t, e) {
            return 0 === t.indexOf("private-") ? new Pusher.PrivateChannel(t, e) : 0 === t.indexOf("presence-") ? new Pusher.PresenceChannel(t, e) : new Pusher.Channel(t, e)
        }
        var n = t.prototype;
        n.add = function(t, n) {
            return this.channels[t] || (this.channels[t] = e(t, n)), this.channels[t]
        }, n.all = function() {
            return Pusher.Util.values(this.channels)
        }, n.find = function(t) {
            return this.channels[t]
        }, n.remove = function(t) {
            var e = this.channels[t];
            return delete this.channels[t], e
        }, n.disconnect = function() {
            Pusher.Util.objectApply(this.channels, function(t) {
                t.disconnect()
            })
        }, Pusher.Channels = t
    }.call(this),
    function() {
        Pusher.Channel.Authorizer = function(t, e) {
            this.channel = t, this.type = e.authTransport, this.options = e, this.authOptions = (e || {}).auth || {}
        }, Pusher.Channel.Authorizer.prototype = {
            composeQuery: function(t) {
                var e = "socket_id=" + encodeURIComponent(t) + "&channel_name=" + encodeURIComponent(this.channel.name);
                for (var n in this.authOptions.params) e += "&" + encodeURIComponent(n) + "=" + encodeURIComponent(this.authOptions.params[n]);
                return e
            },
            authorize: function(t, e) {
                return Pusher.authorizers[this.type].call(this, t, e)
            }
        };
        var t = 1;
        Pusher.auth_callbacks = {}, Pusher.authorizers = {
            ajax: function(t, e) {
                var n, i = this;
                n = Pusher.XHR ? new Pusher.XHR : window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), n.open("POST", i.options.authEndpoint, !0), n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (var r in this.authOptions.headers) n.setRequestHeader(r, this.authOptions.headers[r]);
                return n.onreadystatechange = function() {
                    if (4 === n.readyState)
                        if (200 === n.status) {
                            var t, i = !1;
                            try {
                                t = JSON.parse(n.responseText), i = !0
                            } catch (r) {
                                e(!0, "JSON returned from webapp was invalid, yet status code was 200. Data was: " + n.responseText)
                            }
                            i && e(!1, t)
                        } else Pusher.warn("Couldn't get auth info from your webapp", n.status), e(!0, n.status)
                }, n.send(this.composeQuery(t)), n
            },
            jsonp: function(e, n) {
                void 0 !== this.authOptions.headers && Pusher.warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP.");
                var i = t.toString();
                t++;
                var r = Pusher.Util.getDocument(),
                    s = r.createElement("script");
                Pusher.auth_callbacks[i] = function(t) {
                    n(!1, t)
                };
                var o = "Pusher.auth_callbacks['" + i + "']";
                s.src = this.options.authEndpoint + "?callback=" + encodeURIComponent(o) + "&" + this.composeQuery(e);
                var a = r.getElementsByTagName("head")[0] || r.documentElement;
                a.insertBefore(s, a.firstChild)
            }
        }
    }.call(this), window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
            window.setTimeout(t)
        }
    }(), document.body.style.margin = "0px", document.body.style.overflow = "hidden";
var width = window.innerWidth,
    height = window.innerHeight,
    canvas = document.getElementById("c"),
    mousex = width / 2,
    mousey = 65;
canvas.width = width, canvas.height = height;
var G = canvas.getContext("2d");
G.globalAlpha = .25;
for (var Rnd = Math.random, Sin = Math.sin, Floor = Math.floor, warpZ = 12, units = 1e3, stars = [], cycle = 0, Z = .01, i = 0, n; units > i; i++) n = {}, resetstar(n), stars.push(n);
var rf = function() {
    G.fillStyle = "#000", G.fillRect(0, 0, width, height);
    var t = mousex - width / 2 + width / 2,
        e = mousey - height / 2 + height / 2,
        n = Floor(500 * Z);
    n > 100 && (n = 100);
    for (var i = 0; units > i; i++) {
        var r = stars[i],
            s = r.x / r.z,
            o = r.y / r.z,
            a = 2 * (1 / r.z + 1);
        0 !== r.px && (G.strokeStyle = "hsl(" + cycle * i % 360 + "," + n + "%,80%)", G.lineWidth = a, G.beginPath(), G.moveTo(s + t, o + e), G.lineTo(r.px + t, r.py + e), G.stroke()), r.px = s, r.py = o, r.z -= Z, (r.z < Z || r.px > width || r.py > height) && resetstar(r)
    }
    cycle += .01, requestAnimFrame(rf)
};
requestAnimFrame(rf), $(function() {
    if (-1 == navigator.userAgent.indexOf("Chrome") && -1 == navigator.userAgent.indexOf("Firefox")) return void $("body").html("<h1>Please use Chrome or Firefox.</h1>");
    var t = 10,
        e = 1e3,
        n = 60 * e,
        i = 60 * n,
        r = 24 * i,
        s = 1 * r;
    if ("undefined" == typeof landing_time) return void console.log("landing_time not present");
    var o = new Date(landing_time);
    window.d1 = o;
    var a = function(t, e) {
            for (t = t.toString(); t.length < e;) t = "0" + t;
            return t
        },
        c = function() {
            var s = new Date,
                c = Math.max(o - s, 0),
                u = Math.floor(c / r);
            u = a(u, 2), c -= u * r;
            var h = Math.floor(c / i);
            h = a(h, 2), c -= h * i;
            var l = Math.floor(c / n);
            l = a(l, 2), c -= l * n;
            var p = Math.floor(c / e);
            p = a(p, 2), c -= p * e;
            var d = Math.floor(c / t);
            d = a(d, 2), $("#days").html(u), $("#hours").html(h), $("#minutes").html(l), $("#seconds").html(p), $("#centiseconds").html(d)
        },
        u = function() {
            var t = new Date,
                e = o - t,
                n = e / s * 100;
                //console.log('n = ' + n);
            n > 100 ? n = 100 : 0 > n && (n = 0, p()), $(".line, .rocket").css({
                top: n + "%"
            })
        },
        h = function() {
            var t = new Date,
                e = o - t,
                n = e / s * 100,
                i = 100 - n,
                i = Math.max(i, 0),
                r = Math.pow(i, 4) / 1e8 / 3;
            r = Math.max(r, .01), r = Math.min(r, .25), Z = r
        },
        l = function() {
            var t = new Date,
                e = o - t;
            3 * n > e && (/*b(),*/ clearInterval(v))
        },
        p = function() {
            clearInterval(move_rocket_interval),
            $(".rocket").addClass("landed"),
            $(".line").fadeOut()
            $('.popup').css("display","block");
            // $.post("/lunar/click", {
            //     dataType: "script"
            // })
        };
    window.land = p;
    var d = function() {
            $(".moon").addClass("loaded")
        },
        f = function() {
            $(".flight").addClass("loaded")
        },
        m = function() {
            $("#timer").addClass("loaded")
        };
    setInterval(c, 10), setInterval(m, 100), move_rocket_interval = setInterval(u, 1e3), setInterval(h, 2500);
    var v = setInterval(l, 2500),
        g = new Image;
    g.onload = d, g.src = "heartMoon.png";
    var y = new Image;
    y.onload = function() {
        setTimeout(f, 500)
    }, y.src = "rocket.png";
    var P = !0,
        b = function() {
            if (P) {
                var t = document.getElementById("themesong");
                t.currentTime = 0, t.play()
            } else src = $("#audio_iframe").data("src"), $("#audio_iframe").attr("src", src);
            $(".music").addClass("playing").fadeIn()
        },
        w = function() {
            if (P) {
                var t = document.getElementById("themesong");
                t.pause()
            } else $("#audio_iframe").attr("src", "");
            $(".music").removeClass("playing")
        };
    $(".music a").click(function(t) {
        t.preventDefault(), t.stopPropagation(), $(".music").hasClass("playing") ? w() : b()
    }), $(document).on("click", "a.wait", function(t) {
        t.preventDefault(), t.stopPropagation(), console.log("wait"), $(".popup").remove()
    }), $(document).on("click", "a.try-again", function(t) {
        t.preventDefault(), t.stopPropagation(), console.log("try again"), $.post("/lunar/click", {
            dataType: "script"
        })
    });
    var _ = function() {
        s = 3.5 * n, o = new Date, o = new Date(o.getTime() + s)
    };
    window.preview = _, location.search.indexOf("preview") >= 0, c(), u(), h();
    var k = null,
        S = $("#comm").css("color"),
        T = 10,
        C = new Pusher(pkey),
        U = C.subscribe("lunarcomm");
    U.bind("message", function(t) {
        if (t.text) {
            clearTimeout(k), t.color && $("#comm").css({
                color: t.color
            }), t.name ? $("#comm .operator").html(t.name).show() : $("#comm .operator").hide(), $("#comm .text").html(t.text), $("#comm").fadeIn();
            var e = 1e3 * (t.seconds || T);
            k = setTimeout(function() {
                $("#comm").fadeOut(), setTimeout(function() {
                    $("#comm").css({
                        color: S
                    })
                }, 1e3)
            }, e)
        }
    })
});