// create global nameSpace.
// To be sure, that there is no javascript files Before TGModuleLoader
// we create nameSpace object without checking if it is already exists!

var ns = {};

var TGModuleLoader;
(function() {

	/**
	 * @type {Array.<{requirementsArray:number, callBack:function}>}
	 */
	var modules = [];

	function loadModule(index) {
		modules[index].callBack();
		modules.splice(index, 1);
	}

	function isNameSpaceExists(nameSpace) {
		var parts = nameSpace.split('.'),
			l = parts.length,
			currentNameSpace = ns;

		if(l < 1) {
			return true;
		}

		if(parts[0] !== 'ns') {
			console.log('custom namespaces unsupported');
			return false;
		}

		for(var i = 1; i < l; i++) {
			if(typeof currentNameSpace[parts[i]] !== 'undefined' && currentNameSpace[parts[i]] !== undefined) {
				currentNameSpace = currentNameSpace[parts[i]];
			} else {
				return false;
			}
		}
		return true;
	}

	function isAllNameSpacesExist(nameSpacesArray) {
		if(!nameSpacesArray || nameSpacesArray.length === 0) {
			return true;
		}

		var result = true;
		for(var j = nameSpacesArray.length - 1; j >= 0; j--) {
			if(!isNameSpaceExists(nameSpacesArray[j])) {
				result = false;
				break;
			}
		}
		return result;
	}

	function tryResolveModulesRequirements() {
		var loadedModulesNum = 0;

		for(var i = modules.length - 1; i >= 0; i--) {
			var module = modules[i];
			if(isAllNameSpacesExist(module.requirementsArray)) {
				//console.log(module.requirementsArray);
				loadModule(i);
				loadedModulesNum++;
			}
		}
		return loadedModulesNum;
	}

	TGModuleLoader = {
		/**
		 * @public
		 * @param {Array.<string>} requirementsArray
		 * @param {Function} callBack
		 */
		add : function(requirementsArray, callBack) {
			if(isAllNameSpacesExist(requirementsArray)) {
				callBack();
			} else {
				modules.push({
					requirementsArray : requirementsArray,
					callBack          : callBack
				});

				// try resolve immediately to keep stack of modules as small as possible
				while(tryResolveModulesRequirements() > 0) {}
			}
		},

		/**
		 * @public
		 */
		resolve : function() {
			while(true) {
				if(modules.length === 0) {
					console.log("TGModuleLoader: all dependencies successfully resolved");
					break;
				}
				var num = tryResolveModulesRequirements();
				if(num === 0) {
					throw "TGModuleLoader: can't resolve dependencies for all modules";
					break;
				}
			}
		}
	};

})();

/* Simple JavaScript Inheritance by John Resig http://ejohn.org/ MIT Licensed. Inspired by base2 and Prototype */
/* description: http://blog.buymeasoda.com/understanding-john-resigs-simple-javascript-i/ */

/**
 * @version 0.1
 * - original John Resig inheritance
 * - added checking for ABSTRACT_METHOD
 * - added checking for ABSTRACT_CLASS
 * (if child/base class has any property that equals Class.ABSTRACT_METHOD, new Class will throw error)
 */
TGModuleLoader.add(null, function () {
	ns.frameWork = ns.frameWork || {};

	var initializing = false, fnTest = /xyz/.test(function () {xyz;}) ? /\b_super\b/ : /.*/;

	/**
	 *  The base Class implementation (does nothing)
	 *  @class
	 *  @constructor
	 */
	function Class() {
	}

	ns.frameWork.Class = Class;

	/**
	 * @public
	 * @type {function}
	 */
	Class.ABSTRACT_METHOD = function() {};

	/**
	 * Create a new Class that inherits from this class
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @param {boolean} [isClassAbstract=false] mark class Abstract
	 * @returns {Function} new constructed Class
	 */
	Class.extend = function (childPrototype, isClassAbstract) {
		var _super = this.prototype,
			isClassContainsAbstractMethod = false,
			NewClass,
			name;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (name in childPrototype) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof childPrototype[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(childPrototype[name]) ?
				(function (name, fn) {
					return function () {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, childPrototype[name]) :
				childPrototype[name];
		}

		for (name in prototype) {
			if (prototype[name] === Class.ABSTRACT_METHOD) {
				isClassContainsAbstractMethod = true;
			}
		}

		// The dummy class constructor
		NewClass = function () {
			if (!initializing) {
				if (isClassContainsAbstractMethod) {
					throw "Can't create instance of class with at least one non-implemented abstract method!";
				} else if (isClassAbstract === true) {
					throw "Can't create instance of Abstract Class!";
				} else if (this.init) {
					// All construction is actually done in the init method
					this.init.apply(this, arguments);
				}
			}
		};

		// Populate our constructed prototype object
		NewClass.prototype = prototype;

		// Enforce the constructor to be what we expect
		NewClass.prototype.constructor = NewClass;

		// And make this class extendable
		NewClass.extend = this.extend;//arguments.callee;
		NewClass.createAbstractChild = this.createAbstractChild;
		NewClass.createChild = this.createChild;


		return NewClass;
	};

	/**
	 * Create a new Class that inherits from this class
	 * Constructed Class will be Abstract (it is impossible to create instance of new class!)
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @returns {Function} new constructed Class
	 */
	Class.createAbstractChild = function(childPrototype) {
		return this.extend(childPrototype, true);
	};

	/**
	 * Create a new Class that inherits from this class
	 * Constructed Class will be Abstract (it is impossible to create instance of new class!)
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @returns {Function} new constructed Class
	 */
	Class.createChild = function(childPrototype) {
		return this.extend(childPrototype, false);
	};

});

TGModuleLoader.add([ 'ns.frameWork.Class' ], function () {
	ns.frameWork = ns.frameWork || {};

	/**
	 * @class Utils
	 */
	var Utils = ns.frameWork.Class.extend(/** @lends {Utils} */ {
		/**
		 @param {function} callBackFunc
		 @param {T} thisArg
		 @param {...*} [args]
		 @return {function(this:T)}
		 @template T
		 */
		bind : function (callBackFunc, thisArg, args) {
			return function () {
				callBackFunc.call(thisArg, args);
			}
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isFunction : function (param) {
			return !!(param && ((typeof param === 'function') || Object.prototype.toString.apply(param) === '[object Function]'));
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isObject : function (param) {
			var otherType = this.isString(param) || this.isNumber(param) || this.isArray(param) || this.isBoolean(param);
			return param !== null && (typeof param === 'object') && !otherType;
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isNumber : function (param) {
			return typeof param === 'number';
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isArray : function (param) {
			return param && typeof param === 'object' && (param instanceof Array);
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isBoolean : function (param) {
			return typeof param === 'boolean';
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isUndefined : function (param) {
			return typeof param === 'undefined';
		},

		/**
		 * @public
		 * @param {*} param
		 * @returns {boolean}
		 */
		isString : function (param) {
			return typeof param === 'string';
		},

		/**
		 * @public
		 * @param {object} destinationObject
		 * @param {object} sourceObject
		 */
		augmentObject : function (destinationObject, sourceObject) {
			if (!sourceObject || !destinationObject) {
				throw "Utils.prototype.augmentObject: sourceObject or destinationObject is null";
			}
			for (var propertyName in sourceObject) {
				// commented for Profiler! if (Object.prototype.hasOwnProperty.call(sourceObject, propertyName)) {
				if (!(propertyName in destinationObject)) {
					destinationObject[propertyName] = sourceObject[propertyName];
				}
				//}
			}
		},

		/**
		 * @public
		 * @param {function(this:T)} callBackFunc
		 * @param {T} thisArg
		 * @param {object} callBackData
		 * @param {number} timeOutMS
		 * @template T
		 */
		processLater : function (callBackFunc, thisArg, callBackData, timeOutMS) {
			var timerId = null, startTime = Date.now();

			var listener = function () {
				if (timerId !== null) {
					clearTimeout(timerId);
					timerId = null;
					callBackFunc.call(thisArg, callBackData);
					thisArg = callBackData = callBackFunc = listener = null;
				}
			};

			timerId = setTimeout(listener, timeOutMS);
		},

		/**
		 * @public
		 */
		exitToPreviousApp : function() {
			ns.tgh5api.exit();
		}

	});

	/**
	 * Instance of class Utils
	 * @public
	 * @type {Utils}
	 */
	ns.frameWork.utils = new Utils();

});

TGModuleLoader.add( [ 'ns.frameWork.utils', 'ns.frameWork.Class' ], function () {
	ns.frameWork = ns.frameWork || {};
	ns.frameWork.debug = ns.frameWork.debug || {};

	/**
	 * Sort Methods for widget
	 * @enum {function(a:ProfilerRecord, b:ProfilerRecord) : number}
	 */
	var profilerWidgetSortMethods = {
		bySelfTotalTime : function (a, b) {
			if (a.own.total > b.own.total) {
				return -1;
			}
			return 1;
		},
		byTotalTime     : function (a, b) {
			if (a.all.total > b.all.total) {
				return -1;
			}
			return 1;
		},
		byCalls         : function (a, b) {
			if (a.calls > b.calls) {
				return -1;
			}
			return 1;
		}
	};

	/**
	 * @public
	 * @class ProfilerWidgetConfiguration
	 * @constructor
	 */
	var ProfilerWidgetConfiguration = ns.frameWork.Class.extend(/** @lends {ProfilerWidgetConfiguration} */ {
		/**
		 * @private
		 */
		init : function () {
			/**
			 * @public
			 * @type {number}
			 */
			this.x = 0;

			/**
			 * @public
			 * @type {number}
			 */
			this.y = 0;

			/**
			 * @public
			 * @type {number}
			 */
			this.rows = 20;

			/**
			 * @public
			 * @type {boolean}
			 */
			this.showChangedRows = true;

			/**
			 * @public
			 * @type {number}
			 */
			this.timeChangedRowsShown = 2000;

			/**
			 * @public
			 * @type {profilerWidgetSortMethods}
			 */
			this.sortMethod = profilerWidgetSortMethods.bySelfTotalTime;
		}
	});

	/**
	 * @public
	 * @class ProfilerTimings
	 * @constructor
	 */
	var ProfilerTimings = ns.frameWork.Class.extend(/** @lends {ProfilerTimings} */ {
		/**
		 * @private
		 */
		init : function () {
			/**
			 * Min execution time since last clear(), milliseconds
			 * @public
			 * @type {number}
			 */
			this.min = 0;

			/**
			 * Max execution time since last clear(), milliseconds
			 * @public
			 * @type {number}
			 */
			this.max = 0;

			/**
			 * Total execution time since last clear(), milliseconds
			 * @public
			 * @type {number}
			 */
			this.total = 0;
		}
	});
	/**
	 * @public
	 * @class ProfilerRecord
	 * @param {string} name
	 * @constructor
	 */
	var ProfilerRecord = ns.frameWork.Class.extend(/** @lends {ProfilerRecord} */ {
		/**
		 * @private
		 * @param name
		 */
		init : function (name) {
			/**
			 * Function name with full namespace
			 * @public
			 * @type {string}
			 */
			this.id = name;

			/**
			 * Total SELF execution time since last clear(), milliseconds
			 * @public
			 * @type {ProfilerTimings}
			 */
			this.own = new ProfilerTimings();

			/**
			 * Total execution time including all internal calls since last clear(), milliseconds
			 * @public
			 * @type {ProfilerTimings}
			 */
			this.all = new ProfilerTimings();

			/**
			 * Number of function calls since last clear(), milliseconds
			 * @public
			 * @type {number}
			 */
			this.calls = 0;

			/**
			 * @public
			 * @type {number}
			 */
			this.lastCallTime = Date.now();
		}
	});

	/** @type {boolean} */
	var isProfilerPaused = false;

	/** @type {Array.<ProfilerRecord>} */
	var profilerRecords = [];

	var getPropertyDescriptorAvailable = !!(typeof Object.getOwnPropertyDescriptor !== 'undefined' && Object.getOwnPropertyDescriptor);

	// Widget data
	var isWidgetAttached = false,
		widgetId = "profilerWidgetV1.4",
		widgetIntervalId = null,
		widgetConfiguration = new ProfilerWidgetConfiguration();
		//profilerErrorLogText = "";

	var timeStack = [];

	/**
	 * @public
	 * @class Profiler
	 * @constructor
	 */
	var Profiler = ns.frameWork.Class.extend(/** @lends {Profiler} */ {
		/**
		 * @public
		 * @returns {ProfilerWidgetConfiguration}
		 */
		getProfilerWidgetConfiguration : function () {
			return widgetConfiguration;
		},
		/**
		 * @public
		 */
		pauseProfiler                  : function () {
			isProfilerPaused = true;
		},

		/**
		 * @public
		 */
		continueProfiler : function () {
			isProfilerPaused = false;
		},

		/**
		 * @public
		 */
		clear : function () {
			for (var i = profilerRecords.length - 1; i >= 0; i--) {
				profilerRecords[i] = new ProfilerRecord(profilerRecords[i].id);
			}
		},

		/**
		 * @public
		 * @param {function(ProfilerRecord):boolean} [filterFn]
		 * @returns {Array.<ProfilerRecord>}
		 */
		getReport : function (filterFn) {
			var result = [];

			if (!ns.frameWork.utils.isFunction(filterFn)) {
				filterFn = function () {
					return true;
				};
			}

			for (var i = profilerRecords.length - 1; i >= 0; i--) {
				if (filterFn(profilerRecords[i])) {
					result.push(profilerRecords[i]);
				}
			}

			return result;
		},

		/**
		 * @public
		 * @param {string} name
		 * @param {object} owner
		 * @param {boolean} profilePrototype
		 */
		profileFunction : function (name, owner, profilePrototype) {
			var functionName = (name.indexOf(".") >= 0 ? name.substr(name.lastIndexOf(".") + 1) : name),
				originalFunction, prototype;

			originalFunction = owner[functionName];
			if(typeof originalFunction === 'undefined') {
				return;
			}

			prototype = originalFunction.prototype;

			// exclude already added functions
			if (ns.frameWork.utils.isFunction(originalFunction) && !originalFunction.____PPROFILED) {
				owner[functionName] = this.getFixedFunction(name, originalFunction);

				if (profilePrototype) {
					this.profileObject(name + ".prototype", prototype);
					this.profileObject(name, originalFunction);
				}
			}
		},

		/**
		 * @public
		 * @param {string} name Name of owner object (for report)
		 * @param {object} object
		 * @param {boolean} [recursively]
		 */
		profileObject : function (name, object, recursively) {
			for (var propertyName in object) {
				if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
					// we can't profile properties defined with defineProperty
					// also we can't access to getters because in this case we
					// can't provide getter with correct "this" and getter will crash within application.
					var canBeProfiled = true;
					if (getPropertyDescriptorAvailable) {
						var desc = Object.getOwnPropertyDescriptor(object, propertyName);
						canBeProfiled = (typeof desc.writable === 'undefined' || desc.writable === true) && (typeof desc.get === 'undefined' || desc.get === undefined) && (typeof desc.set === 'undefined' || desc.set === undefined) && !desc.get && !desc.set;
					}

					if (canBeProfiled) {
						if (ns.frameWork.utils.isFunction(object[propertyName])) {
							if (propertyName != "constructor" && propertyName != "_super") {
								this.profileFunction(name + "." + propertyName, object, typeof object[propertyName]["prototype"] === "object");
							}
						} else if (recursively && ns.frameWork.utils.isObject(object[propertyName]) && !object[propertyName].____PPROFILED) {
							try {
								// mark object as profiled
								object[propertyName].____PPROFILED = true;

								// if it is property returned by get or native property/array, "profiled" flag will not be set - skip this object!
								if (object[propertyName].____PPROFILED) {
									this.profileObject(name + "." + propertyName, object[propertyName], recursively);
								}
							} catch (e) {
								console.log("profiler exception: " + e);
							}
						}
					}
				}
			}
		},

		/**
		 * @public
		 */
		widgetSortMethods : profilerWidgetSortMethods,

		getPreparedReport : function() {
			var report = ns.frameWork.debug.profiler.getReport(function (record) {
					return record.calls > 0;
				});

			// sort by total execution time
			if (widgetConfiguration.sortMethod) {
				report.sort(widgetConfiguration.sortMethod);
			}

			return report;
		},

		/**
		 * @public
		 * @param {number} updateInterval
		 */
		attachWidget : function (updateInterval) {
			var changedColors = ["#ffe4e4", "#ffd4d4"],
				notChangedColors = ["#e2f4ff", "#d2e4ff"],
				widgetRows = 0, x = 0, y = 0;

			if (isWidgetAttached) {
				this.detachWidget();
			}
			isWidgetAttached = true;

			var el = document.createElement('div');
			el.id = widgetId;
			el.style.position = "fixed";
			el.style.zIndex = 99999;
			el.style.top = '0';
			el.style.left = '0';

			document.body.appendChild(el);

			function createTableRow (rowIndex) {
				var elRow = document.createElement('tr'),
					args = [].slice.apply(arguments);

				for (var l = args.length, i = 1; i < l; i++) {
					var elCell = document.createElement('td');

					if (rowIndex === null) {
						elCell.setAttribute('style', 'padding: 2px; background-color: #0055aa; color: #ffa700; font-weight: bold;');
					} else if (rowIndex & 1) {
						elCell.setAttribute('style', 'padding: 2px; background-color: #e2f4ff;');
					} else {
						elCell.setAttribute('style', 'padding: 2px; background-color: #d2e4ff;');
					}
					// align text to center for all columns except first
					if (rowIndex === null || i > 1) {
						elCell.style.textAlign = 'center'
					}
					if (rowIndex !== null) {
						elCell.id = widgetId + rowIndex + "." + (i - 1);
					}

					if(args[i]) {
						var parts = args[i].split('|');
						if(parts.length === 1) {
							elCell.innerHTML = args[i];
						} else {
							elCell.colSpan = parseInt(parts[0]);
							elCell.innerHTML = parts[1];
						}
					} else {
						elCell.innerHTML = args[i];
					}
					elRow.appendChild(elCell);
				}
				return elRow;
			}

			function updateTableRow (changed, rowIndex) {
				for (var l = arguments.length, i = 2; i < l; i++) {
					var el = document.getElementById(widgetId + rowIndex + "." + (i - 2)),
						color = changedColors[rowIndex & 1];

					if (!changed) {
						color = notChangedColors[rowIndex & 1];
					}
					el.innerHTML = arguments[i] + "";
					el.style.backgroundColor = color;
				}
			}

			// create table
			var elTable = document.createElement('table');
			elTable.setAttribute('style', 'color: #000000; background-color: #FFFFFF; top: 0; left: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px;');
			elTable.id = widgetId + ".table";

			function updateTableCoordinates () {
				var el = document.getElementById(widgetId);
				if (typeof widgetConfiguration.x !== 'undefined' && widgetConfiguration.x !== x) {
					x = widgetConfiguration.x;
					el.style.left = x + 'px';
				}
				if (typeof widgetConfiguration.y !== 'undefined' && widgetConfiguration.y !== y) {
					y = widgetConfiguration.y;
					el.style.top = y + 'px';
				}
			}

			el.appendChild(elTable);
			updateTableCoordinates();

			/*var elLogText = document.createElement('textarea');
			elLogText.id = widgetId + ".logText";
			elLogText.rows = 10;
			elLogText.columns = 100;
			elLogText.disabled = true;
			elLogText.readonly = true;
			elLogText.style.fontSize = '16px';
			elLogText.style.color = '#FFFFFF';
			elLogText.style.backgroundColor = '#444444';
			el.appendChild(elLogText); */

			// widget handler/updater
			widgetIntervalId = setInterval(function () {
				var i, time = Date.now(),
					report = ns.frameWork.debug.profiler.getReport(function (record) {
						return record.calls > 0;
					});

				updateTableCoordinates();

				// update rows according to current number
				if (widgetRows !== widgetConfiguration.rows) {
					widgetRows = widgetConfiguration.rows;
					var elTable = document.getElementById(widgetId + ".table");
					elTable.innerHTML = null;
					// create header
					elTable.appendChild(createTableRow(null, "name", "4|self time, ms", "4|all time, ms", "calls"));
					elTable.appendChild(createTableRow(null, "", "total", "max", "min", "avg", "total", "max", "min", "avg", ""));
					// create rows
					for (i = 0; i < widgetRows; i++) {
						elTable.appendChild(createTableRow(i, "-", null, null, null, null, null, null, null, null, null));
					}
				}

				// sort by total execution time
				if (widgetConfiguration.sortMethod) {
					report.sort(widgetConfiguration.sortMethod);
				}

				// update rows text
				for (i = 0; i < widgetRows; i++) {
					if (i < report.length) {
						var d = report[i], allAvg = 0, ownAvg = 0;
						if(d.calls > 0) {
							allAvg = (d.all.total / d.calls) | 0;
							ownAvg = (d.own.total / d.calls) | 0;
						}

						updateTableRow(
							widgetConfiguration.showChangedRows && (time - d.lastCallTime < widgetConfiguration.timeChangedRowsShown),
							i, d.id, d.own.total, d.own.max, d.own.min, ownAvg, d.all.total, d.all.max, d.all.min, allAvg, d.calls
						);
						d.updated = false;
					} else {
						updateTableRow(false, i, "-", "", "", "", "", "", "", "", "", "");
					}
				}

				//el = document.getElementById(widgetId + ".logText");
				//el.innerHTML = profilerErrorLogText;
				//el.scrollTop = el.scrollHeight;
			}, updateInterval);
		},

		/**
		 * @public
		 */
		detachWidget : function () {
			if (isWidgetAttached) {
				var wDiv = document.getElementById(widgetId);
				if (wDiv && wDiv.parentNode) {
					wDiv.parentNode.removeChild(wDiv);
				}
				isWidgetAttached = false;
			}
			if (widgetIntervalId !== null) {
				clearInterval(widgetIntervalId);
				widgetIntervalId = null;
			}
		},

		/**
		 * @private
		 * @param {string} name
		 * @param {function} originalFunction
		 * @returns {function}
		 */
		getFixedFunction : function (name, originalFunction) {
			var indexInProfileRecords = profilerRecords.length;

			var fixedFunction = function () {
				var start, result, stop, duration, notSelfTime;
				timeStack.push(0);

				start = Date.now();
				try {
					result = originalFunction.apply(this, arguments);
				} catch(e) {
					console.error(e);
					//var s = printStackTrace();
					/*for(var i = s.length - 1; i >= 0; i--) {
						if(s[i].indexOf('profiler.js') >= 0) {
							s.splice(i, 1);
						}
					} */
					//profilerErrorLogText += e + "\n" + /*"[" + start + "] " + e + "\n" + */s.join("\n") + "\n";
					throw e;
				}

				stop = Date.now();
				duration = stop - start;
				notSelfTime = timeStack.pop();

				if (!isProfilerPaused) {
					/** @type {ProfilerRecord} */
					var profilerRecord = profilerRecords[indexInProfileRecords];

					var selfDuration = duration - notSelfTime;

					profilerRecord.calls++;
					profilerRecord.own.total += selfDuration;
					profilerRecord.all.total += duration;

					profilerRecord.lastCallTime = stop;
					if (profilerRecord.calls > 1) {
						profilerRecord.all.min = Math.min(profilerRecord.all.min, duration);
						profilerRecord.all.max = Math.max(profilerRecord.all.max, duration);

						profilerRecord.own.min = Math.min(profilerRecord.own.min, selfDuration);
						profilerRecord.own.max = Math.max(profilerRecord.own.max, selfDuration);
					} else {
						profilerRecord.all.min = duration;
						profilerRecord.all.max = duration;

						profilerRecord.own.min = duration;
						profilerRecord.own.max = duration;
					}
				}

				var l = timeStack.length;
				if (l > 0) {
					timeStack[l - 1] += Date.now() - start;
				}
				return result;
			};

			ns.frameWork.utils.augmentObject(fixedFunction, originalFunction);
			fixedFunction.____PPROFILED = true;
			fixedFunction.prototype = originalFunction.prototype;

			profilerRecords[indexInProfileRecords] = new ProfilerRecord(name);
			return fixedFunction;
		}

	});

	window.onerror = function(msg, url, line) {
		// You can view the information in an alert to see things working
		// like so:
		//alert("Error: " + msg + "\nurl: " + url + "\nline #: " + line);
		//profilerErrorLogText += "Error: " + msg + "\nurl: " + url + "\nline #: " + line + "\n";
		console.log("window.onerror: " + msg + "\nurl: " + url + "\nline #: " + line + "\n");
		// TODO: Report this error via ajax so you can keep track
		//       of what pages have JS issues

		var suppressErrorAlert = true;
		// If you return true, then error alerts (like in older versions of
		// Internet Explorer) will be suppressed.
		return suppressErrorAlert;
	};

	/**
	 * @public
	 * @type {Profiler}
	 */
	ns.frameWork.debug.profiler = new Profiler();

});

TGModuleLoader.resolve();

(function() {
	var p = ns.frameWork.debug.profiler;
	//p.profileObject('window', window, true);
	p.profileFunction('Galapago', window, true);
	p.profileFunction('LevelMap', window, true);
	p.profileFunction('MatrixUtil', window, true);
	p.profileFunction('ArrayUtil', window, true);
	p.profileFunction('MatchFinder', window, true);

	p.profileFunction('BlobCollection', window, true);
	p.profileFunction('BonusFrenzy', window, true);
	p.profileFunction('BubbleTip', window, true);
	p.profileFunction('CanvasUtil', window, true);
	p.profileFunction('DialogHelp', window, true);
	p.profileFunction('DialogMenu', window, true);


	p.profileFunction('Level', window, true);
	p.profileFunction('Board', window, true);
	p.profileFunction('DangerBar', window, true);
	p.profileFunction('Tile', window, true);
	p.profileFunction('ReshuffleService', window, true);

	p.profileFunction('ImageCollage', window, true);
	p.profileFunction('LevelAnimation', window, true);
	p.profileFunction('MainMenuScreen', window, true);
	p.profileFunction('MapScreen', window, true);
	p.profileFunction('Powerup', window, true);
	p.profileFunction('SpriteSheet', window, true);
	p.profileFunction('TilesMovedEventProcessorResult', window, true);

	p.profileFunction('loadGame', window, true);
	//p.profileFunction('TGH5', TGH5, true);
	p.profileFunction('GameAssetLoader', window, true);
	p.profileFunction('LoadingScreen', window, true);
	p.profileFunction('i18n', window, true);


	//p.profileObject("GameAssetLoader", window.GameAssetLoader, true);
	/*document.addEventListener('DOMContentLoaded', function() {
		p.attachWidget(500);
	});*/

	window.addEventListener("load", function() {
		setTimeout(function() {
			p.attachWidget(500);
		}, 50);
	}, true);
	//};


})();
