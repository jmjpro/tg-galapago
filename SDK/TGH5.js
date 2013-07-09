///#source 1 1 /deployments/integration/deploymentSettings.js
var TGH5;
(function (TGH5) {
    TGH5.settings = {
        version: [
            0, 
            6, 
            3
        ],
        device: [
            "Generic Device", 
            null
        ],
        sdkHome: "..",
        inDemoMode: false,
        logging: {
            level: 4,
            console: "overlay",
            attachment: {
                top: "14pt",
                left: "24pt"
            }
        },
        adVendors: {
            internalPromo_KulaBlox: {
                className: "Promo",
                url: "media/promo/kula-blox.html"
            },
            testVideo: {
                className: "TestVideo",
                video: "media/promo/kula-blox-trailer"
            }
        },
        defaultVendor: "testVideo",
        ads: {
            preRoll: true,
            inGame: "internalPromo_KulaBlox",
            postRoll: "internalPromo_KulaBlox"
        },
        languages: [
            "en"
        ],
        reporting: {
            analyticsId: "UA-40406563-2",
            site: "take5.tv",
            virtualPageRoot: ".",
            initParams: {
                cookieDomain: "none"
            }
        },
        exitUrl: "about:blank"
    };
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/DeploymentAdapter.js
var TGH5;
(function (TGH5) {
    TGH5.settings;
    var DeploymentAdapter = (function () {
        function DeploymentAdapter(settings, api) {
            this._settings = settings;
            this._api = api;
        }
        DeploymentAdapter.prototype.chooseVendor = function (event) {
            var vendor, vendorConfig = this._settings.ads[event], total, random, copy, i, sofar = 0, result, p, candidate;
            if(vendorConfig instanceof Object) {
                total = 0;
                for(p in vendorConfig) {
                    candidate = parseFloat(vendorConfig[p]);
                    if(vendorConfig.hasOwnProperty(p) && !isNaN(candidate)) {
                        total += candidate;
                    }
                }
                random = Math.random() * total;
                copy = [];
                for(p in vendorConfig) {
                    if(vendorConfig.hasOwnProperty(p)) {
                        copy.push({
                            key: p,
                            weight: parseFloat(vendorConfig[p])
                        });
                    }
                }
                copy.sort(function (a, b) {
                    return a.weight - b.weight;
                });
                for(i = 0; i < copy.length; i++) {
                    sofar += copy[i].weight;
                    vendor = copy[i].key;
                    if(sofar >= random) {
                        break;
                    }
                }
            } else if(typeof vendorConfig == "string") {
                vendor = vendorConfig;
            } else if(vendorConfig) {
                vendor = this._settings.defaultVendor;
            } else {
                vendor = "none";
            }
            this._lastSelectedVendor = vendor;
            if(vendor == "none" || !(vendor in this._settings.adVendors) || !(this._settings.adVendors[vendor].className in TGH5.Ads.Vendors)) {
                if(vendor != "none") {
                    this._api.console.format(TGH5.LogLevel.Error, "Vendor \"%s\" was not found", vendor);
                }
                result = {
                    show: function (where, api) {
                        var d = new TGH5.Deferred(api);
                        return d.resolve("Dummy");
                    }
                };
            } else {
                vendorConfig = this._settings.adVendors[vendor];
                result = new TGH5.Ads.Vendors[vendorConfig.className](vendorConfig);
            }
            this._api.console.format(TGH5.LogLevel.Debug, "Selected %s for advertizing", result);
            return result;
        };
        DeploymentAdapter.prototype.languages = function () {
            return this._settings.languages;
        };
        DeploymentAdapter.prototype.analyticsInfo = function (f) {
            var reporting = TGH5.settings.reporting;
            f(reporting.analyticsId, TGH5.settings.version.join("."), reporting.initParams, {
                device: this.formatDeviceId(),
                adVendor: this._lastSelectedVendor
            });
        };
        DeploymentAdapter.prototype.siteDetails = function (f) {
            var reporting = this._settings.reporting, path = document.location.pathname;
            f(reporting.site, path.substring(0, Math.max(0, path.lastIndexOf("/"))) + "/" + (reporting.virtualPageRoot || ""));
        };
        DeploymentAdapter.prototype.isDemo = function () {
            return this._settings.inDemoMode;
        };
        DeploymentAdapter.prototype.sdkHome = function () {
            return this._settings.sdkHome;
        };
        DeploymentAdapter.prototype.formatDeviceId = function () {
            var name, version, device = this._settings.device;
            if(device) {
                name = device[0];
                version = device[1];
            }
            if(!name) {
                name = "unknown";
            }
            if(!version) {
                version = "unknown";
            }
            return name + "-" + version;
        };
        return DeploymentAdapter;
    })();
    TGH5.DeploymentAdapter = DeploymentAdapter;    
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/Persistency.js
var TGH5;
(function (TGH5) {
    (function (Persistency) {
        var hasStorage = ("localStorage" in window) && window.localStorage != null;
        function persist(api) {
            return function (key, value) {
                if(hasStorage) {
                    window.localStorage[key] = JSON.stringify(value);
                }
            };
        }
        Persistency.persist = persist;
        function retrieve(api) {
            return function (key) {
                return hasStorage && (key in window.localStorage) && JSON.parse(window.localStorage[key] || "null");
            };
        }
        Persistency.retrieve = retrieve;
    })(TGH5.Persistency || (TGH5.Persistency = {}));
    var Persistency = TGH5.Persistency;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/Log.js
var TGH5;
(function (TGH5) {
    (function (LogLevel) {
        LogLevel._map = [];
        LogLevel.Error = 1;
        LogLevel._map[2] = "Warn";
        LogLevel.Warn = 2;
        LogLevel._map[3] = "Log";
        LogLevel.Log = 3;
        LogLevel._map[4] = "Debug";
        LogLevel.Debug = 4;
    })(TGH5.LogLevel || (TGH5.LogLevel = {}));
    var LogLevel = TGH5.LogLevel;
    var MAX_LINES = 10, LEVELS = [
        "error", 
        "warn", 
        "log", 
        "debug"
    ];
    function getConsole(api) {
        var consoleId = "console" + Math.random();
        function htmlEntities(input) {
            return input.replace("<", "&lt;").replace(">", "&gt;").replace("&", "&amp;");
        }
        function createHtmlConsole(settings) {
            var wrapper = document.getElementById(consoleId), ul, bg, p, top, left;
            if("attachment" in settings) {
                left = settings.attachment.left || "0";
                top = settings.attachment.top || "0";
            } else {
                top = left = "0";
            }
            if(wrapper) {
                ul = wrapper.childNodes[2];
                bg = wrapper.childNodes[1];
                p = wrapper.childNodes[0];
            } else {
                wrapper = document.createElement("div");
                wrapper.setAttribute("class", "console-wrapper");
                wrapper.id = consoleId;
                wrapper.style.top = top;
                wrapper.style.left = left;
                document.body.appendChild(wrapper);
                p = document.createElement("p");
                p.innerHTML = ">>>";
                p.style.top = top;
                p.style.left = left;
                wrapper.appendChild(p);
                bg = document.createElement("div");
                bg.setAttribute("class", "console-background");
                wrapper.appendChild(bg);
                bg.innerHTML = new Array(MAX_LINES + 2).join("<br/>");
                ul = document.createElement("ul");
                ul.setAttribute("class", "console-lines");
                wrapper.appendChild(ul);
            }
            function appender(s, level) {
                var li = document.createElement("li");
                li.innerHTML = htmlEntities(s);
                li.setAttribute("class", [
                    "console-error", 
                    "console-warn", 
                    "console-log", 
                    "console-debug"
                ][level - 1]);
                ul.appendChild(li);
                if(ul.childNodes.length > MAX_LINES) {
                    ul.removeChild(ul.childNodes[0]);
                }
            }
            return {
                debug: function (s) {
                    appender(s, LogLevel.Debug);
                },
                log: function (s) {
                    appender(s, LogLevel.Log);
                },
                warn: function (s) {
                    appender(s, LogLevel.Warn);
                },
                error: function (s) {
                    appender(s, LogLevel.Warn);
                },
                show: function () {
                    bg.style.display = "block";
                    ul.style.display = "block";
                    ul.style.position = "fixed";
                    ul.style.top = top;
                    ul.style.left = left;
                    bg.style.position = "fixed";
                    bg.style.top = top;
                    bg.style.left = left;
                    p.style.display = "none";
                },
                hide: function () {
                    bg.style.display = "none";
                    ul.style.display = "none";
                    p.style.display = "block";
                    p.style.top = top;
                    p.style.left = left;
                }
            };
        }
        function format(format, args) {
            var i = 0;
            return htmlEntities(format.replace(/%./g, function (match) {
                var result;
                if(match[1] === "%") {
                    result = "%";
                } else if(i < args.length) {
                    result = String(args[i]);
                } else {
                    result = match;
                }
                return result;
            }));
        }
        return function (settings) {
            var result, original;
            if(((settings instanceof Object) && settings.console == "overlay") || !window.console) {
                original = createHtmlConsole(settings);
            } else {
                original = window.console;
            }
            result = {
                log: function (message) {
                    original.log(message);
                },
                debug: function (message) {
                    original.debug(message);
                },
                warn: function (message) {
                    original.warn(message);
                },
                error: function (message) {
                    original.error(message);
                },
                format: function (level, message) {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 2); _i++) {
                        args[_i] = arguments[_i + 2];
                    }
                    var setLevel = (settings instanceof Object) ? settings.level : Number(settings);
                    if(level >= setLevel) {
                        result[LEVELS[level - 1]](format(message, args));
                    }
                },
                show: function () {
                    if('show' in original) {
                        original.show();
                    }
                },
                hide: function () {
                    if('hide' in original) {
                        original.hide();
                    }
                }
            };
            return result;
        };
    }
    TGH5.getConsole = getConsole;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/Api.js
var TGH5;
(function (TGH5) {
    var Api = (function () {
        function Api(productId, productSettings, overrides) {
            var backup, loc = document.location, home;
            this._sdkSettings = JSON.parse(JSON.stringify(TGH5.settings));
            if(overrides) {
                if('logging' in overrides) {
                    if(overrides.logging) {
                        if(overrides.logging.level) {
                            this._sdkSettings.logging.level = overrides.logging.level;
                        }
                        if(overrides.logging.console) {
                            this._sdkSettings.logging.console = overrides.logging.console;
                        }
                        if(overrides.logging.attachment) {
                            this._sdkSettings.logging.attachment = overrides.logging.attachment;
                        }
                    } else {
                        this._sdkSettings.logging = false;
                    }
                }
                if('inDemoMode' in overrides) {
                    this._sdkSettings.inDemoMode = overrides.inDemoMode;
                }
                if('sdkHome' in overrides) {
                    this._sdkSettings.sdkHome = overrides.sdkHome;
                }
                if('exitUrl' in overrides) {
                    this._sdkSettings.exitUrl = overrides.exitUrl;
                }
                if('ads' in overrides) {
                    if('preRoll' in overrides.ads) {
                        this._sdkSettings.ads.preRoll = overrides.ads.preRoll;
                    }
                    if('inGame' in overrides.ads) {
                        this._sdkSettings.ads.inGame = overrides.ads.inGame;
                    }
                    if('postRoll' in overrides.ads) {
                        this._sdkSettings.ads.postRoll = overrides.ads.postRoll;
                    }
                }
                if('reporting' in overrides) {
                    if(overrides.reporting instanceof Object) {
                        if('analyticsId' in overrides.reporting) {
                            this._sdkSettings.reporting.analyticsId = overrides.reporting.analyticsId;
                        }
                        if('site' in overrides.reporting) {
                            this._sdkSettings.reporting.site = overrides.reporting.site;
                        }
                        if('virtualPageRoot' in overrides.reporting) {
                            this._sdkSettings.reporting.virtualPageRoot = overrides.reporting.virtualPageRoot;
                        }
                        if('initParams' in overrides.reporting) {
                            this._sdkSettings.reporting.initParams = overrides.reporting.initParams;
                        }
                    } else {
                        this._sdkSettings.reporting = overrides.reporting;
                    }
                }
            }
            this._adapter = new TGH5.DeploymentAdapter(this._sdkSettings, this);
            this.persist = TGH5.Persistency.persist(this);
            this.retrieve = TGH5.Persistency.retrieve(this);
            this.getUALanguage = TGH5.Language.getUALanguage(this);
            this.preferredLanguage = TGH5.Language.calculatedLanguage(this, this._adapter.languages(), productSettings.supportedLanguages, "en");
            this.changePlayersLanguage = TGH5.Language.changePlayersLanguage(this);
            this.getConsole = TGH5.getConsole(this);
            this._loadState = 0;
            this._deferred = new TGH5.Deferred(this);
            this._productId = productId;
            this._productSettings = productSettings;
            this._pagePrefix = loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "") + "/";
            home = this.sdkHome();
            if(home) {
                if(home.indexOf("//:") > -1 || home[0] == "/") {
                    this._sdkHome = home;
                } else {
                    backup = loc.pathname.split("/");
                    backup.pop();
                    this._sdkHome = TGH5.Reporting.appendPath(backup.join("/"), home);
                }
            } else {
                this._sdkHome = loc.pathname.substr(0, loc.pathname.lastIndexOf("/"));
            }
            TGH5.Reporting.initAnalytics(this, productSettings.page || "/");
            this.requestModalAd = TGH5.requestModalAd(this);
            this.load3rdPartyScripts(Api.requiredLibraries);
            this.verifySdkHome();
        }
        Api.requiredLibraries = [];
        Api.prototype.inDemoMode = function () {
            return this._adapter.isDemo();
        };
        Api.prototype.exit = function () {
            var location = this._sdkSettings.exitUrl;
            this.console.format(TGH5.LogLevel.Debug, "will exit to: \"%s\"", location);
            this.requestModalAd("postRoll").always(function () {
                document.location.href = location;
            });
        };
        Api.prototype.sdkHome = function () {
            return this._adapter.sdkHome();
        };
        Object.defineProperty(Api.prototype, "console", {
            get: function () {
                return this.getConsole(this._sdkSettings.logging);
            },
            enumerable: true,
            configurable: true
        });
        Api.prototype.onDevice = function () {
            return false;
        };
        Object.defineProperty(Api.prototype, "productId", {
            get: function () {
                return this._productId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Api.prototype, "deferred", {
            get: function () {
                return this._deferred;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Api.prototype, "productSettings", {
            get: function () {
                return this._productSettings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Api.prototype, "sdkSettings", {
            get: function () {
                return this._sdkSettings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Api.prototype, "adapter", {
            get: function () {
                return this._adapter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Api.prototype, "logging", {
            get: function () {
                return this._sdkSettings.logging;
            },
            enumerable: true,
            configurable: true
        });
        Api.prototype.resolve = function (path) {
            return this._pagePrefix + TGH5.Reporting.appendPath(this._sdkHome, path);
        };
        Api.prototype.toString = function () {
            return "[Api]";
        };
        Api.init = function init(productId, productSettings, overrides) {
            if(!productId) {
                throw "You must specify productId";
            }
            return (new Api(productId, productSettings, overrides)).deferred;
        };
        Api.prototype.verifySdkHome = function () {
            var css = document.createElement("link"), tester = document.createElement("div");
            css.href = this.resolve("css/tester.css");
            css.rel = "stylesheet";
            tester.setAttribute("class", "__take5__");
            document.body.appendChild(css);
            document.body.appendChild(tester);
            var attempts = 10, that = this;
            var watcher = setInterval(function () {
                var loadedColor;
                if(window.getComputedStyle) {
                    loadedColor = window.getComputedStyle(tester).getPropertyValue("color");
                } else if(tester.currentStyle) {
                    loadedColor = tester.currentStyle["color"];
                }
                if(loadedColor == "rgb(49, 65, 89)") {
                    that.incrementLoadState();
                    clearInterval(watcher);
                } else if(attempts > 0) {
                    attempts--;
                } else {
                    that._deferred.reject("SDK Home is set incorrectly to: " + css.href);
                    clearInterval(watcher);
                }
            }, 100);
        };
        Api.prototype.load3rdPartyScripts = function (requiredLibraries) {
            var loaded = 0, that = this, scriptOnLoad = function (element, api) {
                return function () {
                    if(!element.readyState || element.readyState === "loaded" || element.readyState === "complete") {
                        loaded++;
                        that._deferred.notify(loaded / requiredLibraries.length);
                        that.console.format(TGH5.LogLevel.Log, "Script \"%s\" loaded: %d", element.src, loaded);
                        if(loaded == requiredLibraries.length) {
                            that.incrementLoadState();
                        }
                    }
                };
            };
            if(requiredLibraries && requiredLibraries.length) {
                for(var i = 0; i < requiredLibraries.length; i++) {
                    var script = (document.createElement("script"));
                    script.onreadystatechange = script.onload = scriptOnLoad(script, this);
                    script.src = requiredLibraries[i];
                    document.body.appendChild(script);
                }
            } else {
                this.incrementLoadState();
            }
        };
        Api.prototype.incrementLoadState = function () {
            this._loadState++;
            if(this._loadState > 1 && this._deferred.state() == "pending") {
                this._deferred.resolve(this);
            }
        };
        return Api;
    })();
    TGH5.Api = Api;    
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/Deferred.js
var TGH5;
(function (TGH5) {
    var Deferred = (function () {
        function Deferred(api) {
            this._state = "pending";
            this._failCallbacks = [];
            this._doneCallbacks = [];
            this._progressCallbacks = [];
            this._api = api;
        }
        Deferred.prototype.always = function () {
            var callbacks = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                callbacks[_i] = arguments[_i + 0];
            }
            this.addUniqueCallbacks(callbacks, this._doneCallbacks, this._failCallbacks);
            if(this._state == "rejected") {
                this.applyAndPrune(this._failCallbacks, this._rejectArguments);
            } else if(this._state == "resolved") {
                this.applyAndPrune(this._doneCallbacks, this._resolveArguments);
            }
            return this;
        };
        Deferred.prototype.done = function () {
            var callbacks = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                callbacks[_i] = arguments[_i + 0];
            }
            this.addUniqueCallbacks(callbacks, this._doneCallbacks);
            if(this._state == "resolved") {
                this.applyAndPrune(this._doneCallbacks, this._resolveArguments);
            }
            return this;
        };
        Deferred.prototype.fail = function () {
            var callbacks = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                callbacks[_i] = arguments[_i + 0];
            }
            this.addUniqueCallbacks(callbacks, this._failCallbacks);
            if(this._state == "rejected") {
                this.applyAndPrune(this._doneCallbacks, this._rejectArguments);
            }
            return this;
        };
        Deferred.prototype.notify = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return this.applyAndPrune(this._progressCallbacks, args);
        };
        Deferred.prototype.progress = function () {
            var callbacks = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                callbacks[_i] = arguments[_i + 0];
            }
            return this.addUniqueCallbacks(callbacks, this._progressCallbacks);
        };
        Deferred.prototype.reject = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this._state = "rejected";
            return this.applyAndPrune(this._failCallbacks, this._rejectArguments = args);
        };
        Deferred.prototype.resolve = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this._api.console.format(TGH5.LogLevel.Debug, "Resolved by %s", args.join(""));
            this._state = "resolved";
            return this.applyAndPrune(this._doneCallbacks, this._resolveArguments = args);
        };
        Deferred.prototype.state = function () {
            return this._state;
        };
        Deferred.prototype.then = function (success, fail) {
            return (this.addUniqueCallbacks([
                success
            ], this._doneCallbacks)).addUniqueCallbacks([
                fail
            ], this._failCallbacks);
        };
        Deferred.prototype.applyAndPrune = function (callbacks, args) {
            for(var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(null, args);
            }
            callbacks.length = 0;
            return this;
        };
        Deferred.prototype.addUniqueCallbacks = function (callbacks) {
            var targets = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                targets[_i] = arguments[_i + 1];
            }
            var index;
            for(var i = 0; i < targets.length; i++) {
                for(var j = 0; j < callbacks.length; j++) {
                    index = targets[i].indexOf(callbacks[j]);
                    if(index < 0) {
                        targets[i].push(callbacks[j]);
                    }
                }
            }
            return this;
        };
        return Deferred;
    })();
    TGH5.Deferred = Deferred;    
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/Language.js
var TGH5;
(function (TGH5) {
    (function (Language) {
        var LANGUAGE_KEY = "language";
        function calculatedLanguage(api, platformLanguages, gameLanguages, fallback) {
            var deferred = new TGH5.Deferred(api);
            return function () {
                api.getUALanguage().always(function (language) {
                    var index;
                    if(!language) {
                        language = fallback;
                    }
                    index = platformLanguages.indexOf(language);
                    if(index < 0) {
                        platformLanguages.unshift(language);
                    } else if(index != 0) {
                        platformLanguages = platformLanguages.splice(index, 1);
                        platformLanguages.unshift(language);
                    }
                    deferred.resolve(languageForGame(platformLanguages, gameLanguages, fallback, api.retrieve(LANGUAGE_KEY)));
                });
                return deferred;
            };
        }
        Language.calculatedLanguage = calculatedLanguage;
        function getUALanguage(api) {
            var deferred = new TGH5.Deferred(api), language;
            return function () {
                if(language) {
                    deferred.resolve(language);
                } else {
                    language = api.retrieve(LANGUAGE_KEY);
                    if(language) {
                        deferred.resolve(language);
                    } else {
                        language = navigator["language"] || navigator.userLanguage;
                        if(language) {
                            language = language.substr(0, 2).toLowerCase();
                            deferred.resolve(language);
                        } else {
                            deferred.reject("Couldn't identify UA language");
                        }
                    }
                }
                return deferred;
            };
        }
        Language.getUALanguage = getUALanguage;
        function languageForGame(platformLanguages, gameLanguages, fallback, previous) {
            var result, i, hash;
            if(previous && gameLanguages.indexOf(previous) > -1) {
                result = previous;
            } else {
                hash = {
                };
                for(i = 0; i < gameLanguages.length; i++) {
                    hash[gameLanguages[i]] = i;
                }
                for(i = 0; i < platformLanguages.length; i++) {
                    if(platformLanguages[i] in hash) {
                        result = platformLanguages[i];
                        break;
                    }
                }
                if(!result) {
                    result = fallback;
                }
            }
            return result;
        }
        function changePlayersLanguage(api) {
            return function (newLanguage) {
                api.persist(LANGUAGE_KEY, newLanguage);
            };
        }
        Language.changePlayersLanguage = changePlayersLanguage;
    })(TGH5.Language || (TGH5.Language = {}));
    var Language = TGH5.Language;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/reporting/Reporting.js
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TGH5;
(function (TGH5) {
    (function (Reporting) {
                        (function (i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments);
            } , i[r].l = new Date().getTime();
            a = s.createElement(o) , m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
        function initAnalytics(api, page) {
            var sitePrefix;
            function kindOfEvent(kind) {
                var result;
                switch(kind) {
                    case Impression:
                        result = "impression";
                        break;
                    case ClickThrough:
                        result = "click-through";
                        break;
                    case LanguageChange:
                        result = "language-change";
                        break;
                    default:
                        throw "Unrecognized event type: " + kind;
                }
                return result;
            }
            function reportPageView(api) {
                return function (page) {
                    var p;
                    for(p in Page) {
                        if(Page[p] === page) {
                            ga("set", "productId", api.productId);
                            api.console.format(TGH5.LogLevel.Debug, "Reporting page view: \"%s\"", appendPath(sitePrefix, page));
                            ga("send", "pageview", appendPath(sitePrefix, page));
                            return;
                        }
                    }
                    throw "Unrecognized page: " + page;
                };
            }
            function reportVideoEvent(api) {
                return function (kind, completed) {
                    if (typeof completed === "undefined") { completed = false; }
                    ga("set", "productId", api.productId);
                    api.console.format(TGH5.LogLevel.Debug, "Reporting video event: \"%s\"", kind + (completed ? "Completed" : ""));
                    ga("send", "event", "video", kind + (completed ? "Completed" : ""));
                };
            }
            function reportEvent(api) {
                return function (kind, event) {
                    var p;
                    for(p in kind) {
                        if(kind[p] === event && EventKind.prototype.isPrototypeOf(kind.prototype)) {
                            ga("set", "productId", api.productId);
                            api.console.format(TGH5.LogLevel.Debug, "Reporting event: \"%s\"", kind);
                            ga("send", "event", kindOfEvent(kind), kind);
                            return;
                        }
                    }
                    throw "Unrecognized event: " + event;
                };
            }
            ;
            api.adapter.analyticsInfo(function (id, version, initArgs, variables) {
                api.adapter.siteDetails(function (site, prefix) {
                    sitePrefix = prefix;
                    api.reportPageView = reportPageView(api);
                    api.reportVideoEvent = reportVideoEvent(api);
                    api.reportEvent = reportEvent(api);
                    ga("create", id, site, initArgs);
                    var settings = {
                        apiVersion: version,
                        productId: api.productId
                    };
                    for(var p in variables) {
                        if(variables.hasOwnProperty(p)) {
                            settings[p] = variables[p];
                        }
                    }
                    ga("set", settings);
                    ga("send", "pageview", appendPath(sitePrefix, page));
                });
            });
        }
        Reporting.initAnalytics = initAnalytics;
        var Page = (function () {
            function Page() { }
            Page.MainScreen = "main-screen";
            Page.Help = "help";
            Page.Options = "options";
            Page.Played = "played";
            Page.Loading = "loading";
            Page.MainMenu = "main-menu";
            Page.GameMenu = "game-menu";
            Page.Profile = "profile";
            Page.Leaderboard = "leaderboard";
            Page.NewGame = "new-game";
            return Page;
        })();
        Reporting.Page = Page;        
        var EventKind = (function () {
            function EventKind() { }
            return EventKind;
        })();
        Reporting.EventKind = EventKind;        
        var Impression = (function (_super) {
            __extends(Impression, _super);
            function Impression() {
                _super.apply(this, arguments);

            }
            Impression.PromoSplash = "promo-splash";
            Impression.Loading = "loading";
            Impression.Main = "main";
            Impression.Options = "options";
            Impression.GameInfo = "info";
            Impression.Promotion = "promo";
            Impression.ComingSoon = "coming-soon";
            Impression.PostRoll = "postroll";
            Impression.PreRoll = "preroll";
            Impression.InGame = "ingame";
            return Impression;
        })(EventKind);
        Reporting.Impression = Impression;        
        var ClickThrough = (function (_super) {
            __extends(ClickThrough, _super);
            function ClickThrough() {
                _super.apply(this, arguments);

            }
            return ClickThrough;
        })(EventKind);
        Reporting.ClickThrough = ClickThrough;        
        var LanguageChange = (function (_super) {
            __extends(LanguageChange, _super);
            function LanguageChange() {
                _super.apply(this, arguments);

            }
            return LanguageChange;
        })(EventKind);
        Reporting.LanguageChange = LanguageChange;        
        function appendPath(prefix, suffix) {
            var result;
            if(suffix[0] === "/") {
                result = suffix;
            } else {
                result = prefix + "/" + suffix;
            }
            return normalizePath(result);
        }
        Reporting.appendPath = appendPath;
        function normalizePath(path) {
            var parts = path.split("/"), backup = document.location.pathname.split("/"), i, j, result = [], part;
            for(i = parts.length - 1 , j = 0; i >= 0; i--) {
                part = parts[i];
                if(part === "" || part === ".") {
                    continue;
                } else if(part === "..") {
                    j++;
                } else {
                    if(j > 0) {
                        j--;
                    } else {
                        result.unshift(part);
                    }
                }
            }
            if(j > 0) {
                result = backup.slice(0, backup.length - j).concat(result);
            }
            return result.join("/");
        }
    })(TGH5.Reporting || (TGH5.Reporting = {}));
    var Reporting = TGH5.Reporting;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/ads/Vendor.js
var TGH5;
(function (TGH5) {
    (function (Ads) {
        var Vendor = (function () {
            function Vendor(settings, className) {
                this.settings = settings;
                this.className = className;
            }
            Vendor.prototype.toString = function () {
                return "[" + this.className + "]";
            };
            return Vendor;
        })();
        Ads.Vendor = Vendor;        
    })(TGH5.Ads || (TGH5.Ads = {}));
    var Ads = TGH5.Ads;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/ads/vendors/TestVideo.js
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TGH5;
(function (TGH5) {
    (function (Ads) {
        (function (Vendors) {
            var TestVideo = (function (_super) {
                __extends(TestVideo, _super);
                function TestVideo(settings) {
                                _super.call(this, settings, "TestVideo");
                }
                TestVideo.prototype.show = function (where, api) {
                    this.where = where;
                    this.api = api;
                    this.deferred = new TGH5.Deferred(api);
                    this.create();
                    return this.deferred;
                };
                TestVideo.prototype.suspend = function (andResolve) {
                    if(this._videoElement && this._videoElement.parentNode) {
                        this._videoElement.pause();
                        this._videoElement.src = "";
                        this._videoElement.parentNode.removeChild(this._videoElement);
                    }
                    if(andResolve) {
                        this.deferred.resolve(this);
                    }
                };
                TestVideo.prototype.createVideo = function (where) {
                    this.suspend(false);
                    this._videoElement = document.createElement("video");
                    this._videoElement.width = window.innerWidth;
                    this._videoElement.height = window.innerHeight;
                    this._videoElement.id = "video" + Math.random();
                    if(this._videoElement.canPlayType) {
                        if(this._videoElement.canPlayType('video/mp4; codecs="mp4v.20.8"') || this._videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"') || this._videoElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
                            this._videoElement.setAttribute("src", this.api.resolve(this.settings.video + ".mp4"));
                            this.api.console.debug("Selected MP4 container");
                        } else if(this._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"')) {
                            this._videoElement.setAttribute("src", this.api.resolve(this.settings.video + ".webm"));
                            this.api.console.debug("Selected WEBM container");
                        } else {
                            this.api.console.error("Device cannot play video");
                        }
                    } else {
                        this.api.console.error("Device cannot play video");
                    }
                    where.appendChild(this._videoElement);
                };
                TestVideo.prototype.create = function () {
                    var that = this, handler = function () {
                        that.deferred.resolve(that);
                    };
                    this.createVideo(this.where);
                    if(this._videoElement.addEventListener) {
                        this._videoElement.addEventListener("ended", handler);
                        this._videoElement.addEventListener("error", handler);
                    } else {
                        this._videoElement.onended = this._videoElement.onerror = handler;
                    }
                    this._videoElement.play();
                };
                return TestVideo;
            })(Ads.Vendor);
            Vendors.TestVideo = TestVideo;            
        })(Ads.Vendors || (Ads.Vendors = {}));
        var Vendors = Ads.Vendors;
    })(TGH5.Ads || (TGH5.Ads = {}));
    var Ads = TGH5.Ads;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/ads/vendors/Promo.js
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TGH5;
(function (TGH5) {
    (function (Ads) {
        (function (Vendors) {
            function addHandler(event, handler, dispatcher) {
                if(!dispatcher) {
                    dispatcher = document.body;
                }
                if(typeof event == "string") {
                    if(dispatcher.addEventListener) {
                        dispatcher.addEventListener(event, handler);
                    } else if(dispatcher.attachEvent) {
                        (handler).__handler__ = function () {
                            handler(window.event);
                        };
                        dispatcher.attachEvent("on" + event, (handler).__handler__);
                    }
                } else {
                    for(var i = 0; i < event.length; i++) {
                        addHandler(event[i], handler, dispatcher);
                    }
                }
            }
            function removeHandler(event, handler, dispatcher) {
                if(!dispatcher) {
                    dispatcher = document.body;
                }
                if(typeof event == "string") {
                    if(dispatcher.removeEventListener) {
                        dispatcher.removeEventListener(event, handler);
                    } else if(dispatcher.detatchEvent) {
                        dispatcher.detatchEvent("on" + event, (handler).__handler__);
                    }
                } else {
                    for(var i = 0; i < event.length; i++) {
                        removeHandler(event[i], handler, dispatcher);
                    }
                }
            }
            var Promo = (function (_super) {
                __extends(Promo, _super);
                function Promo(settings) {
                                _super.call(this, settings, "Promo");
                }
                Promo.prototype.show = function (where, api) {
                    this.where = where;
                    this.api = api;
                    this.deferred = new TGH5.Deferred(api);
                    this.api.console.debug("Will create promo");
                    this.create();
                    this.api.console.debug("Displaying promo");
                    return this.deferred;
                };
                Promo.prototype.suspend = function (andResolve) {
                    if(this._container && this._container.parentNode) {
                        this._container.parentNode.removeChild(this._container);
                    }
                    if(this._msieDiv && this._msieDiv.parentNode) {
                        this._msieDiv.parentNode.removeChild(this._msieDiv);
                    }
                    if(andResolve) {
                        this.deferred.resolve(this);
                    }
                };
                Promo.prototype.createIFrame = function (where) {
                    this.suspend(false);
                    this._iFrame = document.createElement("iframe");
                    this._iFrame.width = window.innerWidth + "px";
                    this._iFrame.height = window.innerHeight + "px";
                    this._iFrame.id = "iframe" + Math.random();
                    this._iFrame.src = this.api.resolve(this.settings.url);
                    this._iFrame.style.pointerEvents = "none";
                    where.appendChild(this._iFrame);
                };
                Promo.prototype.create = function () {
                    var that = this, handler = function (event) {
                        that.suspend(true);
                        that.api.console.debug("Promo clicked:");
                        if('stopImmediatePropagation' in event) {
                            event.stopImmediatePropagation();
                        }
                        if('stopPropagation' in event) {
                            event.stopPropagation();
                        }
                        if('preventDefault' in event) {
                            event.preventDefault();
                        }
                        removeHandler([
                            "click", 
                            "keydown"
                        ], handler);
                        return false;
                    };
                    this.suspend(false);
                    this._container = document.createElement("div");
                    this._container.setAttribute("style", "width:" + window.innerWidth + "px;" + "height:" + window.innerHeight + "px;" + "background-color:#FFF;" + "position:absolute;top:0;left:0;z-index:987;");
                    this.createIFrame(this._container);
                    document.body.appendChild(this._container);
                    this._msieDiv = document.createElement("div");
                    this._msieDiv.setAttribute("style", "width:" + window.innerWidth + "px;" + "height:" + window.innerHeight + "px;" + "background-color:rgba(255,0,0,0);" + "position:absolute;top:0;left:0;z-index:988;");
                    document.body.appendChild(this._msieDiv);
                    addHandler([
                        "click", 
                        "keydown"
                    ], handler);
                };
                return Promo;
            })(TGH5.Ads.Vendor);
            Vendors.Promo = Promo;            
        })(Ads.Vendors || (Ads.Vendors = {}));
        var Vendors = Ads.Vendors;
    })(TGH5.Ads || (TGH5.Ads = {}));
    var Ads = TGH5.Ads;
})(TGH5 || (TGH5 = {}));

///#source 1 1 /src/ads/requestModalAd.js
var TGH5;
(function (TGH5) {
    function requestModalAd(api) {
        var where, deferred;
        return function (event) {
            var vendor, resolvedImmediately, result;
            api.console.format(TGH5.LogLevel.Debug, "Will process video event: \"%s\"", event);
            if(!deferred) {
                vendor = api.adapter.chooseVendor(event);
                if(vendor) {
                    try  {
                        document.body.removeChild(where);
                    } catch (e) {
                    }
                    where = document.createElement("div");
                    where.id = "background" + Math.random();
                    where.setAttribute("style", "position:absolute;top:0;left:0;z-index:999");
                    document.body.appendChild(where);
                    api.reportVideoEvent(event);
                    deferred = (vendor.show(where, api).always(function () {
                        try  {
                            document.body.removeChild(where);
                        } catch (e) {
                        }
                        api.reportVideoEvent(event, true);
                        resolvedImmediately = true;
                        deferred = null;
                        api.console.debug("Finished displaying an ad");
                    }));
                    if(resolvedImmediately) {
                        result = deferred;
                        deferred = null;
                    }
                } else {
                    deferred = new TGH5.Deferred(api);
                    deferred.resolve("requestModalAd");
                }
            } else {
                api.console.format(TGH5.LogLevel.Debug, "Skipped \"%s\" ad due to another ad being displayed", event);
            }
            return deferred || result;
        };
    }
    TGH5.requestModalAd = requestModalAd;
})(TGH5 || (TGH5 = {}));

