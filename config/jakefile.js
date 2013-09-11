/*
 * npm install jake
 * documentation: https://github.com/mde/jake
 */

(function () {

	var fs = require('fs'),
		toolsDir = './../tools/',
		uglify = require(toolsDir + 'uglifyJS/uglify-js.js'),
		path = require('path'),
		cssmin = require(toolsDir + 'yui_cssmin/node-cssmin-master/cssmin'),
		less = require(toolsDir + 'less/lib/less');

	var appConfig = {
		"common"  : {
			version : "1.10",

			doNotMergeMinifiedFiles : false,

			// JS files, will be placed first and in order
			orderedJavaScriptFiles : [
				"ext/lodash.min.js",
				"ext/imgpreload.js",
				"ext/queryString.js",
				"ext/q.min.js",
				"ext/zepto-1.0.min.js",
				"ext/zepto-touch-1.0.js",
				"ext/gal.js",
				"ext/i18next-1.6.3.min.js",
				"js/game.js",
				"js/dialogMenu.js",
				"js/dialogHelp.js",
				"js/mainMenuScreen.js",
				"js/score.js",
				"js/blobCollection.js",
				"js/tilesEventProcessor.js",
				"js/imageCollage.js",
				"js/mapScreen.js",
				"js/levelAnimation.js",
				"js/loadingScreen.js",
				"js/canvasUtil.js",
				"js/powerUp.js",
				"js/bonusFrenzy.js",
				"js/bubbleTip.js",
				"js/audioPlayer.js",
				"js/priorityQueue.js"

			],

			reBuildResources : {
				less : [  ]
			}
		},

		// configurations
		"release" : {
			// list of files to copy
			copy_files : [
				'../sdk/**/*.*',
				'js/.htaccess',
				'js/loadingScreen.manifest',
				'js/levels.json',
				'js/audioPriority.json',
				'locales/**/*.*',
				'res/**/*.*',
				'index.build.html'
			],

			js : {
				javaScriptConcatenatedFileName : "js/galapago.js",
				javaScriptMinifiedFileName : "js/galapago.min.js",
				includeDirectories : [ 'js', 'ext' ],
				excludeFiles       : [ 'debugConsole.js', 'imageFilters.js', 'jserrlog-min.js', 'profiler.js', 'stacktrace-min-0.4.js' ]
			},

			css : {
				cssMinifiedFileName : "css/galapago.min.css",
				includeFiles : [ 'css/*.css' ]
			}
		},
		"cheat"   : {
			// list of files to copy
			copy_files : [
				'../sdk/**/*.*',
				'js/.htaccess',
				'js/loadingScreen.manifest',
				'js/levels.json',
				'js/audioPriority.json',
				'locales/**/*.*',
				'res/**/*.*',
				'index.build.html'
			],

			js : {
				javaScriptConcatenatedFileName : "js/galapago.js",
				javaScriptMinifiedFileName : "js/galapago.min.js",
				includeDirectories : [ 'js', 'ext' ],
				excludeFiles       : [ 'debugConsole.js', 'imageFilters.js', 'jserrlog-min.js', 'stacktrace-min-0.4.js' ]
			},

			css : {
				cssMinifiedFileName : "css/galapago.min.css",
				includeFiles : [ 'css/*.css' ]
			}
		},

		"debug" : {
			// list of files to copy
			copy_files : [
				'../sdk/**/*.*',
				'css/**/*.*',
				'ext/**/*.*',
				'locales/**/*.*',
				'js/**/*.*',
				'res/**/*.*',
				'index.html'
			],

			js  : null,
			css : null
		}
	};

	var UGLIFY_OPTIONS = {
		/*strict_semicolons: true,
		 mangle_options: {except: ['$super']},
		 gen_options: {ascii_only: true},*/
		ast                 : false,
		consolidate         : false,
		mangle              : true,
		mangle_toplevel     : false,
		no_mangle_functions : false,
		squeeze             : true,
		make_seqs           : true,
		dead_code           : true,
		verbose             : false,
		show_copyright      : true,
		out_same_file       : false,
		max_line_length     : 32 * 1024,
		unsafe              : false,
		reserved_names      : null,
		defines             : { },
		lift_vars           : false,
		codegen_options     : {
			ascii_only    : false,
			beautify      : false,
			indent_level  : 4,
			indent_start  : 0,
			quote_keys    : false,
			space_colon   : false,
			inline_script : false
		},
		make                : false
		//output: true            // stdout
	};

	// My Settings
	UGLIFY_OPTIONS.show_copyright = false;
	UGLIFY_OPTIONS.mangle_toplevel = true;
	UGLIFY_OPTIONS.unsafe = true;
	UGLIFY_OPTIONS.lift_vars = true;

	var LESS_OPTIONS = {
		depends       : false,
		compress      : false,
		yuicompress   : false,
		max_line_len  : -1,
		optimization  : 1,
		silent        : false,
		verbose       : false,
		lint          : false,
		paths         : [],
		color         : true,
		strictImports : false,
		rootpath      : '',
		relativeUrls  : false,
		ieCompat      : true,
		strictMath    : false,
		strictUnits   : false
	};

	// My Tools
	var myTools = {

		build : function (configName) {
			var config = appConfig[configName],
				p, buildPath = path.join('build/', configName);

			// cleanup
			jake.rmRf(buildPath);

			if (config.js) {
				// merge files
				var mergedCode = myTools.mergeJSFiles(config);
				p = path.join(buildPath, '/' + config.js.javaScriptConcatenatedFileName);
				jake.mkdirP(path.dirname(p));
				fs.writeFileSync(p, mergedCode, 'utf8');

				//minify
				var minifiedCode = uglify(mergedCode, UGLIFY_OPTIONS);
				p = path.join(buildPath, '/' + config.js.javaScriptMinifiedFileName);
				jake.mkdirP(path.dirname(p));
				fs.writeFileSync(p, minifiedCode, 'utf8');
			}

			// copy resources
			myTools.copyResources(buildPath, config);

			if (config.css) {
				// minify css
				myTools.minifyCss(buildPath, config);
			}
		},

		mergeJSFiles : function (config) {
			var list = new jake.FileList(),
				i, j;
			config.js.includeDirectories.forEach(function (dirName) {
				list.include(dirName + '/**/*.js');
			});
			config.js.excludeFiles.forEach(function (fileName) {
				list.exclude(new RegExp('.*' + myTools.escapeRegExp(fileName) + '.*'));
			});
			if (appConfig["common"].doNotMergeMinifiedFiles) {
				list.exclude(new RegExp('.*' + myTools.escapeRegExp(".min.js") + '.*'));
			}
			list = list.toArray();

			var orderedFilesArray = appConfig["common"].orderedJavaScriptFiles.slice();

			for (j = orderedFilesArray.length - 1; j >= 0; j--) {
				var el = null,
					p1 = path.normalize(orderedFilesArray[j]);
				for (i = list.length - 1; i >= 0; i--) {
					var p2 = path.normalize(list[i]);
					if (p2.indexOf(p1) >= 0) {
						//loaderFound = true;
						el = list.splice(i, 1);
						//list.unshift(el.toString());
						break;
					}
				}
				if (el === null) {
					console.log("can't find ORDERED JS FILE: " + orderedFilesArray[j]);
					throw "can't find ORDERED JS FILE: " + orderedFilesArray[j];
				} else {
					orderedFilesArray[j] = el;
				}
			}
			for (i = orderedFilesArray.length - 1; i >= 0; i--) {
				list.unshift(orderedFilesArray[i].toString());
			}

			return this.mergeFiles(list, ';\n');
		},

		mergeFiles : function (filesArray, joinSeparator) {
			var code = [];
			for (var l = filesArray.length, i = 0; i < l; i++) {
				console.log("merge: " + filesArray[i] + ", " + (typeof filesArray[i]));
				code[i] = fs.readFileSync(filesArray[i], 'utf8');
			}

			if(typeof joinSeparator === 'undefined') {
				joinSeparator = "\n";
			}
			return code.join(joinSeparator);
		},

		createDirectories : function (buildDirectory, directoryArray) {
			for (var l = directoryArray.length, i = 0; i < l; i++) {
				jake.mkdirP(path.join(buildDirectory, directoryArray[i]));
			}
		},

		copyResources : function (buildDirectory, config) {
			var l, i, list = new jake.FileList();
			config.copy_files.forEach(function (fileName) {
				list.include(fileName);
			});
			list = list.toArray();
			for (l = list.length, i = 0; i < l; i++) {
				var destinationFile = path.join(path.dirname(path.join(buildDirectory, list[i])), path.basename(list[i]));
				jake.mkdirP(path.dirname(destinationFile));

				var fileStatistics = fs.statSync(list[i]);
				jake.cpR(list[i], destinationFile);

				fs.utimesSync(destinationFile, fileStatistics.atime, fileStatistics.mtime);
			}
			//jake.cpR("index.html", buildDirectory);
		},

		minifyCss : function (buildDirectory, config) {
			var list = new jake.FileList();
			config.css.includeFiles.forEach(function (file) {
				list.include(path.normalize(file));
			});
			if (appConfig["common"].doNotMergeMinifiedFiles) {
				list.exclude(new RegExp('.*' + myTools.escapeRegExp(".min.css") + '.*'));
			}
			list = list.toArray();

			// merge files
			var mergedCss = this.mergeFiles(list);

			// minify
			var minifiedCss = cssmin(mergedCss);

			// write minified css file
			var p = path.join(buildDirectory, config.css.cssMinifiedFileName);
			jake.mkdirP(path.dirname(p));
			fs.writeFileSync(p, minifiedCss, 'utf8');
		},

		escapeRegExp : function (str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
	};

	// build configuration
	desc('DEFAULT');
	task('default', function () {
		jake.Task['clean'].invoke();
		jake.Task['re_build_css'].invoke();
		jake.Task['build'].invoke();
	});

	desc('CLEAN UP');
	task('clean', function () {
		//console.log("!! prepare!");
		jake.rmRf('build');
	});

	desc('REBUILD CSS');
	task('re_build_css', function () {
		console.log("LESS TO CSS RE-BUILDING...");

		var config = appConfig["common"].reBuildResources;

		var list = new jake.FileList();
		config.less.forEach(function (file) {
			list.include(path.normalize(file));
		});
		list = list.toArray();

		var originalDirectory = process.cwd();
		for (var i = list.length - 1; i >= 0; i--) {
			process.chdir(originalDirectory);

			var inFile = list[i],
				outFile = list[i].replace(".less", ".css");

			console.log(inFile);
			var contents = fs.readFileSync(inFile, 'utf8');

			(function (outFile, contents) {
				process.chdir(path.dirname(outFile));
				var parser = new less.Parser(LESS_OPTIONS);
				parser.parse(contents, function (err, tree) {
					if (err) {
						//less.writeError(err, options);
						//throw new Error("LESS TO CSS PARSE ERROR: " + err);
						console.log("LESS TO CSS ERROR: " + err);
						process.exit(1);
						//fail('', 1);
					} else {
						try {
							var css = tree.toCSS({
								silent      : LESS_OPTIONS.silent,
								verbose     : LESS_OPTIONS.verbose,
								ieCompat    : LESS_OPTIONS.ieCompat,
								compress    : LESS_OPTIONS.compress,
								yuicompress : LESS_OPTIONS.yuicompress,
								maxLineLen  : LESS_OPTIONS.maxLineLen,
								strictMath  : LESS_OPTIONS.strictMath,
								strictUnits : LESS_OPTIONS.strictUnits
							});
							process.chdir(originalDirectory);
							fs.writeFileSync(outFile, css, 'utf8');
						} catch (e) {
							console.log("LESS TO CSS EXCEPTION: " + e);
							process.exit(2);
						}
					}
				});
			})(outFile, contents);
		}
		process.chdir(originalDirectory);
	});

	desc('BUILD ALL');
	task('build', ['release', 'cheat', 'debug'], function () {
		/*jake.Task['release'].invoke();
		 jake.Task['cheat'].invoke();*/
	}, {async : true});

	// BUILD CONFIGURATIONS
	desc('build RELEASE');
	task('release', [], function () {
		myTools.build("release");
	});

	desc('build CHEAT');
	task('cheat', [], function () {
		myTools.build("cheat");
	});

	desc('build DEBUG');
	task('debug', [], function () {
		myTools.build("debug");
	});

})();
