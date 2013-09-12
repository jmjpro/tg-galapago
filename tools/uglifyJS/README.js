var <?xml version="1 = <?xml version="1 || {};

(function() {


	<?xml version="1.0" encoding="utf-8"?> = ' \
<DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" \
               "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> \
<html xmlns="http://www.w3.org/1999/xhtml" \
lang="en" xml:lang="en"> \
<head> \
<title>UglifyJS &ndash; a JavaScript parser/compressor/beautifier</title> \
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/> \
<meta name="generator" content="Org-mode"/> \
<meta name="generated" content="2012-11-22 10:46:14 EET"/> \
<meta name="author" content="Mihai Bazon"/> \
<meta name="description" content="a JavaScript parser/compressor/beautifier in JavaScript"/> \
<meta name="keywords" content="javascript, js, parser, compiler, compressor, mangle, minify, minifier"/> \
<style type="text/css"> \
 <[CDATA[/*><--*/ \
  html { font-family: Times, serif; font-size: 12pt; } \
  .title  { text-align: center; } \
  .todo   { color: red; } \
  .done   { color: green; } \
  .tag    { background-color: #add8e6; font-weight:normal } \
  .target { } \
  .timestamp { color: #bebebe; } \
  .timestamp-kwd { color: #5f9ea0; } \
  .right  {margin-left:auto; margin-right:0px;  text-align:right;} \
  .left   {margin-left:0px;  margin-right:auto; text-align:left;} \
  .center {margin-left:auto; margin-right:auto; text-align:center;} \
  p.verse { margin-left: 3% } \
  pre { \
	border: 1pt solid #AEBDCC; \
	background-color: #F3F5F7; \
	padding: 5pt; \
	font-family: courier, monospace; \
        font-size: 90%; \
        overflow:auto; \
  } \
  table { border-collapse: collapse; } \
  td, th { vertical-align: top;  } \
  th.right  { text-align:center;  } \
  th.left   { text-align:center;   } \
  th.center { text-align:center; } \
  td.right  { text-align:right;  } \
  td.left   { text-align:left;   } \
  td.center { text-align:center; } \
  dt { font-weight: bold; } \
  div.figure { padding: 0.5em; } \
  div.figure p { text-align: center; } \
  div.inlinetask { \
    padding:10px; \
    border:2px solid gray; \
    margin:10px; \
    background: #ffffcc; \
  } \
  textarea { overflow-x: auto; } \
  .linenr { font-size:smaller } \
  .code-highlighted {background-color:#ffff00;} \
  .org-info-js_info-navigation { border-style:none; } \
  #org-info-js_console-label { font-size:10px; font-weight:bold; \
                               white-space:nowrap; } \
  .org-info-js_search-highlight {background-color:#ffff00; color:#000000; \
                                 font-weight:bold; } \
  /*]]>*/--> \
</style> \
<link rel="stylesheet" type="text/css" href="docstyle.css" /> \
<script type="text/javascript"> \
<[CDATA[/*><--*/ \
 function CodeHighlightOn(elem, id) \
 { \
   var target = document.getElementById(id); \
   if(null = target) { \
     elem.cacheClassElem = elem.className; \
     elem.cacheClassTarget = target.className; \
     target.className = "code-highlighted"; \
     elem.className   = "code-highlighted"; \
   } \
 } \
 function CodeHighlightOff(elem, id) \
 { \
   var target = document.getElementById(id); \
   if(elem.cacheClassElem) \
     elem.className = elem.cacheClassElem; \
   if(elem.cacheClassTarget) \
     target.className = elem.cacheClassTarget; \
 } \
/*]]>*///--> \
</script> \
</head> \
<body> \
<div id="preamble"> \
</div> \
<div id="content"> \
<h1 class="title">UglifyJS &ndash; a JavaScript parser/compressor/beautifier</h1> \
<div id="table-of-contents"> \
<h2>Table of Contents</h2> \
<div id="text-table-of-contents"> \
<ul> \
<li><a href="#sec-1">1 NEW: UglifyJS2 </a></li> \
<li><a href="#sec-2">2 UglifyJS &mdash; a JavaScript parser/compressor/beautifier </a> \
<ul> \
<li><a href="#sec-2-1">2.1 Unsafe transformations </a> \
<ul> \
<li><a href="#sec-2-1-1">2.1.1 Calls involving the global Array constructor </a></li> \
<li><a href="#sec-2-1-2">2.1.2 <code>obj.toString()</code> ==&gt; <code>obj+“”</code> </a></li> \
</ul> \
</li> \
<li><a href="#sec-2-2">2.2 Install (NPM) </a></li> \
<li><a href="#sec-2-3">2.3 Install latest code from GitHub </a></li> \
<li><a href="#sec-2-4">2.4 Usage </a> \
<ul> \
<li><a href="#sec-2-4-1">2.4.1 API </a></li> \
<li><a href="#sec-2-4-2">2.4.2 Beautifier shortcoming &ndash; no more comments </a></li> \
<li><a href="#sec-2-4-3">2.4.3 Use as a code pre-processor </a></li> \
</ul> \
</li> \
<li><a href="#sec-2-5">2.5 Compression &ndash; how good is it? </a></li> \
<li><a href="#sec-2-6">2.6 Bugs? </a></li> \
<li><a href="#sec-2-7">2.7 Links </a></li> \
<li><a href="#sec-2-8">2.8 License </a></li> \
</ul> \
</li> \
</ul> \
</div> \
</div> \
<div id="outline-container-1" class="outline-2"> \
<h2 id="sec-1"><span class="section-number-2">1</span> NEW: UglifyJS2 </h2> \
<div class="outline-text-2" id="text-1"> \
<p> \
I started working on UglifyJS's successor, version 2.  It's almost a full \
rewrite (except for the parser which is heavily modified, everything else \
starts from scratch).  I've detailed my reasons in the README, see the \
project page. \
</p> \
<p> \
<a href="https://github.com/mishoo/UglifyJS2">https://github.com/mishoo/UglifyJS2</a> \
</p> \
<p> \
Version 1 will continue to be maintained for fixing show-stopper bugs, but \
no new features should be expected. \
</p> \
</div> \
</div> \
<div id="outline-container-2" class="outline-2"> \
<h2 id="sec-2"><span class="section-number-2">2</span> UglifyJS &mdash; a JavaScript parser/compressor/beautifier </h2> \
<div class="outline-text-2" id="text-2"> \
<p> \
This package implements a general-purpose JavaScript \
parser/compressor/beautifier toolkit.  It is developed on <a href="http://nodejs.org/">NodeJS</a>, but it \
should work on any JavaScript platform supporting the CommonJS module system \
(and if your platform of choice doesn't support CommonJS, you can easily \
implement it, or discard the <code>exports.*</code> lines from UglifyJS sources). \
</p> \
<p> \
The tokenizer/parser generates an abstract syntax tree from JS code.  You \
can then traverse the AST to learn more about the code, or do various \
manipulations on it.  This part is implemented in <a href="../lib/parse-js.js">parse-js.js</a> and it's a \
port to JavaScript of the excellent <a href="http://marijn.haverbeke.nl/parse-js/">parse-js</a> Common Lisp library from <a href="http://marijn.haverbeke.nl/">Marijn Haverbeke</a>. \
</p> \
<p> \
( See <a href="http://github.com/mishoo/cl-uglify-js">cl-uglify-js</a> if you're looking for the Common Lisp version of \
UglifyJS. ) \
</p> \
<p> \
The second part of this package, implemented in <a href="../lib/process.js">process.js</a>, inspects and \
manipulates the AST generated by the parser to provide the following: \
</p> \
<ul> \
<li>ability to re-generate JavaScript code from the AST.  Optionally \
  indented&mdash;you can use this if you want to “beautify” a program that has \
  been compressed, so that you can inspect the source.  But you can also run \
  our code generator to print out an AST without any whitespace, so you \
  achieve compression as well. \
</li> \
<li>shorten variable names (usually to single characters).  Our mangler will \
  analyze the code and generate proper variable names, depending on scope \
  and usage, and is smart enough to deal with globals defined elsewhere, or \
  with <code>eval()</code> calls or <code>with{}</code> statements.  In short, if <code>eval()</code> or \
  <code>with{}</code> are used in some scope, then all variables in that scope and any \
  variables in the parent scopes will remain unmangled, and any references \
  to such variables remain unmangled as well. \
</li> \
<li>various small optimizations that may lead to faster code but certainly \
  lead to smaller code.  Where possible, we do the following: \
<ul> \
<li>foo["bar"]  ==&gt;  foo.bar \
</li> \
<li>remove block brackets <code>{}</code> \
</li> \
<li>join consecutive var declarations: \
    var a = 10; var b = 20; ==&gt; var a=10,b=20; \
</li> \
<li>resolve simple constant expressions: 1 +2 * 3 ==&gt; 7.  We only do the \
    replacement if the result occupies less bytes; for example 1/3 would \
    translate to 0.333333333333, so in this case we don't replace it. \
</li> \
<li>consecutive statements in blocks are merged into a sequence; in many \
    cases, this leaves blocks with a single statement, so then we can remove \
    the block brackets. \
</li> \
<li>various optimizations for IF statements: \
<ul> \
<li>if (foo) bar(); else baz(); ==&gt; foo?bar():baz(); \
</li> \
<li>if (bar(); \
</li> \
<li>if (foo) bar(); ==&gt; foo&amp;&amp;bar(); \
</li> \
<li>if (foo) bar(); ==&gt; foo||bar(); \
</li> \
<li>if (foo) return bar(); else return baz(); ==&gt; return foo?bar():baz(); \
</li> \
<li>if (foo) return bar(); else something(); ==&gt; {if(foo)return bar();something()} \
</li> \
</ul> \
</li> \
<li>remove some unreachable code and warn about it (code that follows a \
    <code>return</code>, <code>throw</code>, <code>break</code> or <code>continue</code> statement, except \
    function/variable declarations). \
</li> \
<li>act a limited version of a pre-processor (c.f. the pre-processor of \
    C/C++) to allow you to safely replace selected global symbols with \
    specified values.  When combined with the optimisations above this can \
    make UglifyJS operate slightly more like a compilation process, in \
    that when certain symbols are replaced by constant values, entire code \
    blocks may be optimised away as unreachable. \
</li> \
</ul> \
</li> \
</ul> \
</div> \
<div id="outline-container-2-1" class="outline-3"> \
<h3 id="sec-2-1"><span class="section-number-3">2.1</span> <span class="target">Unsafe transformations</span>  </h3> \
<div class="outline-text-3" id="text-2-1"> \
<p> \
The following transformations can in theory break code, although they're \
probably safe in most practical cases.  To enable them you need to pass the \
<code>--unsafe</code> flag. \
</p> \
</div> \
<div id="outline-container-2-1-1" class="outline-4"> \
<h4 id="sec-2-1-1"><span class="section-number-4">2.1.1</span> Calls involving the global Array constructor </h4> \
<div class="outline-text-4" id="text-2-1-1"> \
<p> \
The following transformations occur: \
</p> \
<pre class="src src-js"><span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3, 4)  =&gt; [1,2,3,4] \
Array(a, b, c)         =&gt; [a,b,c] \
<span class="org-keyword">new</span> <span class="org-type">Array</span>(5)           =&gt; Array(5) \
<span class="org-keyword">new</span> <span class="org-type">Array</span>(a)           =&gt; Array(a) \
</pre> \
<p> \
These are all safe if the Array name isn't redefined.  JavaScript does allow \
one to globally redefine Array (and pretty much everything, in fact) but I \
personally don't see why would anyone do that. \
</p> \
<p> \
UglifyJS does handle the case where Array is redefined locally, or even \
globally but with a <code>function</code> or <code>var</code> declaration.  Therefore, in the \
following cases UglifyJS <b>doesn't touch</b> calls or instantiations of Array: \
</p> \
<pre class="src src-js"><span class="org-comment-delimiter">// </span><span class="org-comment">case 1.  globally declared variable</span> \
  <span class="org-keyword">var</span> <span class="org-variable-name">Array</span>; \
  <span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3); \
  Array(a, b); \
  <span class="org-comment-delimiter">// </span><span class="org-comment">or (can be declared later)</span> \
  <span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3); \
  <span class="org-keyword">var</span> <span class="org-variable-name">Array</span>; \
  <span class="org-comment-delimiter">// </span><span class="org-comment">or (can be a function)</span> \
  <span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3); \
  <span class="org-keyword">function</span> <span class="org-function-name">Array</span>() { ... } \
<span class="org-comment-delimiter">// </span><span class="org-comment">case 2.  declared in a function</span> \
  (<span class="org-keyword">function</span>(){ \
    a = <span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3); \
    b = Array(5, 6); \
    <span class="org-keyword">var</span> <span class="org-variable-name">Array</span>; \
  })(); \
  <span class="org-comment-delimiter">// </span><span class="org-comment">or</span> \
  (<span class="org-keyword">function</span>(<span class="org-variable-name">Array</span>){ \
    <span class="org-keyword">return</span> Array(5, 6, 7); \
  })(); \
  <span class="org-comment-delimiter">// </span><span class="org-comment">or</span> \
  (<span class="org-keyword">function</span>(){ \
    <span class="org-keyword">return</span> <span class="org-keyword">new</span> <span class="org-type">Array</span>(1, 2, 3, 4); \
    <span class="org-keyword">function</span> <span class="org-function-name">Array</span>() { ... } \
  })(); \
  <span class="org-comment-delimiter">// </span><span class="org-comment">etc.</span> \
</pre> \
</div> \
</div> \
<div id="outline-container-2-1-2" class="outline-4"> \
<h4 id="sec-2-1-2"><span class="section-number-4">2.1.2</span> <code>obj.toString()</code> ==&gt; <code>obj+“”</code> </h4> \
<div class="outline-text-4" id="text-2-1-2"> \
</div> \
</div> \
</div> \
<div id="outline-container-2-2" class="outline-3"> \
<h3 id="sec-2-2"><span class="section-number-3">2.2</span> Install (NPM) </h3> \
<div class="outline-text-3" id="text-2-2"> \
<p> \
UglifyJS is now available through NPM &mdash; <code>npm install uglify-js@1</code> should \
do the job. \
</p> \
<p> \
<b>NOTE:</b> The NPM package has been upgraded to UglifyJS2.  If you need to \
install version 1.x you need to add `@1` to the command, as I did above.  I \
strongly suggest you to try to upgrade, though this might not be simple (v2 \
has a completely different AST structure and API). \
</p> \
</div> \
</div> \
<div id="outline-container-2-3" class="outline-3"> \
<h3 id="sec-2-3"><span class="section-number-3">2.3</span> Install latest code from GitHub </h3> \
<div class="outline-text-3" id="text-2-3"> \
<pre class="src src-sh"><span class="org-comment-delimiter">## </span><span class="org-comment">clone the repository</span> \
mkdir -p /where/you/wanna/put/it \
<span class="org-builtin">cd</span> /where/you/wanna/put/it \
git clone git://github.com/mishoo/UglifyJS.git \
<span class="org-comment-delimiter">## </span><span class="org-comment">make the module available to Node</span> \
mkdir -p ~/.node_libraries/ \
<span class="org-builtin">cd</span> ~/.node_libraries/ \
ln -s /where/you/wanna/put/it/UglifyJS/uglify-js.js \
<span class="org-comment-delimiter">## </span><span class="org-comment">and if you want the CLI script too:</span> \
mkdir -p ~/bin \
<span class="org-builtin">cd</span> ~/bin \
ln -s /where/you/wanna/put/it/UglifyJS/bin/uglifyjs \
  <span class="org-comment-delimiter"># </span><span class="org-comment">(then add ~/bin to your $PATH if it's not there already)</span> \
</pre> \
</div> \
</div> \
<div id="outline-container-2-4" class="outline-3"> \
<h3 id="sec-2-4"><span class="section-number-3">2.4</span> Usage </h3> \
<div class="outline-text-3" id="text-2-4"> \
<p> \
There is a command-line tool that exposes the functionality of this library \
for your shell-scripting needs: \
</p> \
<pre class="src src-sh">uglifyjs [ options... ] [ filename ] \
</pre> \
<p> \
<code>filename</code> should be the last argument and should name the file from which \
to read the JavaScript code.  If you don't specify it, it will read code \
from STDIN. \
</p> \
<p> \
Supported options: \
</p> \
<ul> \
<li><code>-b</code> or <code>--beautify</code> &mdash; output indented code; when passed, additional \
  options control the beautifier: \
<ul> \
<li><code>-i N</code> or <code>--indent N</code> &mdash; indentation level (number of spaces) \
</li> \
<li><code>-q</code> or <code>--quote-keys</code> &mdash; quote keys in literal objects (by default, \
    only keys that cannot be identifier names will be quotes). \
</li> \
</ul> \
</li> \
<li><code>-c</code> or <code>----consolidate-primitive-values</code> &mdash; consolidates null, Boolean, \
  and String values. Known as aliasing in the Closure Compiler. Worsens the \
  data compression ratio of gzip. \
</li> \
<li><code>--ascii</code> &mdash; pass this argument to encode non-ASCII characters as \
  <code>\uXXXX</code> sequences.  By default UglifyJS won't bother to do it and will \
  output Unicode characters instead.  (the output is always encoded in UTF8, \
  but if you pass this option you'll only get ASCII). \
</li> \
<li><code>-nm</code> or <code>--no-mangle</code> &mdash; don't mangle names. \
</li> \
<li><code>-nmf</code> or <code>--no-mangle-functions</code> &ndash; in case you want to mangle variable \
  names, but not touch function names. \
</li> \
<li><code>-ns</code> or <code>--no-squeeze</code> &mdash; don't call <code>ast_squeeze()</code> (which does various \
  optimizations that result in smaller, less readable code). \
</li> \
<li><code>-mt</code> or <code>--mangle-toplevel</code> &mdash; mangle names in the toplevel scope too \
  (by default we don't do this). \
</li> \
<li><code>--no-seqs</code> &mdash; when <code>ast_squeeze()</code> is called (thus, unless you pass \
  <code>--no-squeeze</code>) it will reduce consecutive statements in blocks into a \
  sequence.  For example, "a = 10; b = 20; foo();" will be written as \
  "a=10,b=20,foo();".  In various occasions, this allows us to discard the \
  block brackets (since the block becomes a single statement).  This is ON \
  by default because it seems safe and saves a few hundred bytes on some \
  libs that I tested it on, but pass <code>--no-seqs</code> to disable it. \
</li> \
<li><code>--no-dead-code</code> &mdash; by default, UglifyJS will remove code that is \
  obviously unreachable (code that follows a <code>return</code>, <code>throw</code>, <code>break</code> or \
  <code>continue</code> statement and is not a function/variable declaration).  Pass \
  this option to disable this optimization. \
</li> \
<li><code>-nc</code> or <code>--no-copyright</code> &mdash; by default, <code>uglifyjs</code> will keep the initial \
  comment tokens in the generated code (assumed to be copyright information \
  etc.).  If you pass this it will discard it. \
</li> \
<li><code>-o filename</code> or <code>--output filename</code> &mdash; put the result in <code>filename</code>.  If \
  this isn't given, the result goes to standard output (or see next one). \
</li> \
<li><code>--overwrite</code> &mdash; if the code is read from a file (not from STDIN) and you \
  pass <code>--overwrite</code> then the output will be written in the same file. \
</li> \
<li><code>--ast</code> &mdash; pass this if you want to get the Abstract Syntax Tree instead \
  of JavaScript as output.  Useful for debugging or learning more about the \
  internals. \
</li> \
<li><code>-v</code> or <code>--verbose</code> &mdash; output some notes on STDERR (for now just how long \
  each operation takes). \
</li> \
<li><code>-d SYMBOL[=VALUE]</code> or <code>--define SYMBOL[=VALUE]</code> &mdash; will replace \
  all instances of the specified symbol where used as an identifier \
  (except where symbol has properly declared by a var declaration or \
  use as function parameter or similar) with the specified value. This \
  argument may be specified multiple times to define multiple \
  symbols - if no value is specified the symbol will be replaced with \
  the value <code>true</code>, or you can specify a numeric value (such as \
  <code>1024</code>), a quoted string value (such as ="object"= or \
  ='https://github.com'<code>), or the name of another symbol or keyword   (such as =null</code> or <code>document</code>). \
  This allows you, for example, to assign meaningful names to key \
  constant values but discard the symbolic names in the uglified \
  version for brevity/efficiency, or when used wth care, allows \
  UglifyJS to operate as a form of <b>conditional compilation</b> \
  whereby defining appropriate values may, by dint of the constant \
  folding and dead code removal features above, remove entire \
  superfluous code blocks (e.g. completely remove instrumentation or \
  trace code for production use). \
  Where string values are being defined, the handling of quotes are \
  likely to be subject to the specifics of your command shell \
  environment, so you may need to experiment with quoting styles \
  depending on your platform, or you may find the option \
  <code>--define-from-module</code> more suitable for use. \
</li> \
<li><code>-define-from-module SOMEMODULE</code> &mdash; will load the named module (as \
  per the NodeJS <code>require()</code> function) and iterate all the exported \
  properties of the module defining them as symbol names to be defined \
  (as if by the <code>--define</code> option) per the name of each property \
  (i.e. without the module name prefix) and given the value of the \
  property. This is a much easier way to handle and document groups of \
  symbols to be defined rather than a large number of <code>--define</code> \
  options. \
</li> \
<li><code>--unsafe</code> &mdash; enable other additional optimizations that are known to be \
  unsafe in some contrived situations, but could still be generally useful. \
  For now only these: \
<ul> \
<li>foo.toString()  ==&gt;  foo+"" \
</li> \
<li>new Array(x,&hellip;)  ==&gt; [x,&hellip;] \
</li> \
<li>new Array(x) ==&gt; Array(x) \
</li> \
</ul> \
</li> \
<li><code>--max-line-len</code> (default 32K characters) &mdash; add a newline after around \
  32K characters.  I've seen both FF and Chrome croak when all the code was \
  on a single line of around 670K.  Pass &ndash;max-line-len 0 to disable this \
  safety feature. \
</li> \
<li><code>--reserved-names</code> &mdash; some libraries rely on certain names to be used, as \
  pointed out in issue #92 and #81, so this option allow you to exclude such \
  names from the mangler.  For example, to keep names <code>require</code> and <code>$super</code> \
  intact you'd specify &ndash;reserved-names "require,$super". \
</li> \
<li><code>--inline-script</code> &ndash; when you want to include the output literally in an \
  HTML <code>&lt;script&gt;</code> tag you can use this option to prevent <code>&lt;/script</code> from \
  showing up in the output. \
</li> \
<li><code>--lift-vars</code> &ndash; when you pass this, UglifyJS will apply the following \
  transformations (see the notes in API, <code>ast_lift_variables</code>): \
<ul> \
<li>put all <code>var</code> declarations at the start of the scope \
</li> \
<li>make sure a variable is declared only once \
</li> \
<li>discard unused function arguments \
</li> \
<li>discard unused inner (named) functions \
</li> \
<li>finally, try to merge assignments into that one <code>var</code> declaration, if \
    possible. \
</li> \
</ul> \
</li> \
</ul> \
</div> \
<div id="outline-container-2-4-1" class="outline-4"> \
<h4 id="sec-2-4-1"><span class="section-number-4">2.4.1</span> API </h4> \
<div class="outline-text-4" id="text-2-4-1"> \
<p> \
To use the library from JavaScript, you'd do the following (example for \
NodeJS): \
</p> \
<pre class="src src-js"><span class="org-keyword">var</span> <span class="org-variable-name">jsp</span> = require(<span class="org-string">"uglify-js"</span>).parser; \
<span class="org-keyword">var</span> <span class="org-variable-name">pro</span> = require(<span class="org-string">"uglify-js"</span>).uglify; \
<span class="org-keyword">var</span> <span class="org-variable-name">orig_code</span> = <span class="org-string">"... JS code here"</span>; \
<span class="org-keyword">var</span> <span class="org-variable-name">ast</span> = jsp.parse(orig_code); <span class="org-comment-delimiter">// </span><span class="org-comment">parse code and get the initial AST</span> \
ast = pro.ast_mangle(ast); <span class="org-comment-delimiter">// </span><span class="org-comment">get a new AST with mangled names</span> \
ast = pro.ast_squeeze(ast); <span class="org-comment-delimiter">// </span><span class="org-comment">get an AST with compression optimizations</span> \
<span class="org-keyword">var</span> <span class="org-variable-name">final_code</span> = pro.gen_code(ast); <span class="org-comment-delimiter">// </span><span class="org-comment">compressed code here</span> \
</pre> \
<p> \
The above performs the full compression that is possible right now.  As you \
can see, there are a sequence of steps which you can apply.  For example if \
you want compressed output but for some reason you don't want to mangle \
variable names, you would simply skip the line that calls \
<code>pro.ast_mangle(ast)</code>. \
</p> \
<p> \
Some of these functions take optional arguments.  Here's a description: \
</p> \
<ul> \
<li><code>jsp.parse(code, strict_semicolons)</code> &ndash; parses JS code and returns an AST. \
  <code>strict_semicolons</code> is optional and defaults to <code>false</code>.  If you pass \
  <code>true</code> then the parser will throw an error when it expects a semicolon and \
  it doesn't find it.  For most JS code you don't want that, but it's useful \
  if you want to strictly sanitize your code. \
</li> \
<li><code>pro.ast_lift_variables(ast)</code> &ndash; merge and move <code>var</code> declarations to the \
  scop of the scope; discard unused function arguments or variables; discard \
  unused (named) inner functions.  It also tries to merge assignments \
  following the <code>var</code> declaration into it. \
<p> \
  If your code is very hand-optimized concerning <code>var</code> declarations, this \
  lifting variable declarations might actually increase size.  For me it \
  helps out.  On jQuery it adds 865 bytes (243 after gzip).  YMMV.  Also \
  note that (since it's not enabled by default) this operation isn't yet \
  heavily tested (please report if you find issues). \
</p> \
<p> \
  Note that although it might increase the image size (on jQuery it gains \
  865 bytes, 243 after gzip) it's technically more correct: in certain \
  situations, dead code removal might drop variable declarations, which \
  would not happen if the variables are lifted in advance. \
</p> \
<p> \
  Here's an example of what it does: \
</p></li> \
</ul> \
<pre class="src src-js"><span class="org-keyword">function</span> <span class="org-function-name">f</span>(<span class="org-variable-name">a</span>, <span class="org-variable-name">b</span>, <span class="org-variable-name">c</span>, <span class="org-variable-name">d</span>, <span class="org-variable-name">e</span>) { \
    <span class="org-keyword">var</span> <span class="org-variable-name">q</span>; \
    <span class="org-keyword">var</span> <span class="org-variable-name">w</span>; \
    w = 10; \
    q = 20; \
    <span class="org-keyword">for</span> (<span class="org-keyword">var</span> <span class="org-variable-name">i</span> = 1; i &lt; 10; ++i) { \
        <span class="org-keyword">var</span> <span class="org-variable-name">boo</span> = foo(a); \
    } \
    <span class="org-keyword">for</span> (<span class="org-keyword">var</span> <span class="org-variable-name">i</span> = 0; i &lt; 1; ++i) { \
        <span class="org-keyword">var</span> <span class="org-variable-name">boo</span> = bar(c); \
    } \
    <span class="org-keyword">function</span> <span class="org-function-name">foo</span>(){ ... } \
    <span class="org-keyword">function</span> <span class="org-function-name">bar</span>(){ ... } \
    <span class="org-keyword">function</span> <span class="org-function-name">baz</span>(){ ... } \
} \
<span class="org-comment-delimiter">// </span><span class="org-comment">transforms into ==&gt;</span> \
<span class="org-keyword">function</span> <span class="org-function-name">f</span>(<span class="org-variable-name">a</span>, <span class="org-variable-name">b</span>, <span class="org-variable-name">c</span>) { \
    <span class="org-keyword">var</span> <span class="org-variable-name">i</span>, <span class="org-variable-name">boo</span>, <span class="org-variable-name">w</span> = 10, <span class="org-variable-name">q</span> = 20; \
    <span class="org-keyword">for</span> (i = 1; i &lt; 10; ++i) { \
        boo = foo(a); \
    } \
    <span class="org-keyword">for</span> (i = 0; i &lt; 1; ++i) { \
        boo = bar(c); \
    } \
    <span class="org-keyword">function</span> <span class="org-function-name">foo</span>() { ... } \
    <span class="org-keyword">function</span> <span class="org-function-name">bar</span>() { ... } \
} \
</pre> \
<ul> \
<li><code>pro.ast_mangle(ast, options)</code> &ndash; generates a new AST containing mangled \
  (compressed) variable and function names.  It supports the following \
  options: \
<ul> \
<li><code>toplevel</code> &ndash; mangle toplevel names (by default we don't touch them). \
</li> \
<li><code>except</code> &ndash; an array of names to exclude from compression. \
</li> \
<li><code>defines</code> &ndash; an object with properties named after symbols to \
    replace (see the <code>--define</code> option for the script) and the values \
    representing the AST replacement value. For example, \
    <code>{ defines: { DEBUG: ['name', 'false'], VERSION: ['string', '1.0'] } }</code> \
</li> \
</ul> \
</li> \
<li><code>pro.ast_squeeze(ast, options)</code> &ndash; employs further optimizations designed \
  to reduce the size of the code that <code>gen_code</code> would generate from the \
  AST.  Returns a new AST.  <code>options</code> can be a hash; the supported options \
  are: \
<ul> \
<li><code>make_seqs</code> (default true) which will cause consecutive statements in a \
    block to be merged using the "sequence" (comma) operator \
</li> \
<li><code>dead_code</code> (default true) which will remove unreachable code. \
</li> \
</ul> \
</li> \
<li><code>pro.gen_code(ast, options)</code> &ndash; generates JS code from the AST.  By \
  default it's minified, but using the <code>options</code> argument you can get nicely \
  formatted output.  <code>options</code> is, well, optional :-) and if you pass it it \
  must be an object and supports the following properties (below you can see \
  the default values): \
<ul> \
<li><code>beautify: false</code> &ndash; pass <code>true</code> if you want indented output \
</li> \
<li><code>indent_start: 0</code> (only applies when <code>beautify</code> is <code>true</code>) &ndash; initial \
    indentation in spaces \
</li> \
<li><code>indent_level: 4</code> (only applies when <code>beautify</code> is <code>true</code>) -- \
    indentation level, in spaces (pass an even number) \
</li> \
<li><code>quote_keys: false</code> &ndash; if you pass <code>true</code> it will quote all keys in \
    literal objects \
</li> \
<li><code>space_colon: false</code> (only applies when <code>beautify</code> is <code>true</code>) &ndash; wether \
    to put a space before the colon in object literals \
</li> \
<li><code>ascii_only: false</code> &ndash; pass <code>true</code> if you want to encode non-ASCII \
    characters as <code>\uXXXX</code>. \
</li> \
<li><code>inline_script: false</code> &ndash; pass <code>true</code> to escape occurrences of \
    <code>&lt;/script</code> in strings \
</li> \
</ul> \
</li> \
</ul> \
</div> \
</div> \
<div id="outline-container-2-4-2" class="outline-4"> \
<h4 id="sec-2-4-2"><span class="section-number-4">2.4.2</span> Beautifier shortcoming &ndash; no more comments </h4> \
<div class="outline-text-4" id="text-2-4-2"> \
<p> \
The beautifier can be used as a general purpose indentation tool.  It's \
useful when you want to make a minified file readable.  One limitation, \
though, is that it discards all comments, so you don't really want to use it \
to reformat your code, unless you don't have, or don't care about, comments. \
</p> \
<p> \
In fact it's not the beautifier who discards comments &mdash; they are dumped at \
the parsing stage, when we build the initial AST.  Comments don't really \
make sense in the AST, and while we could add nodes for them, it would be \
inconvenient because we'd have to add special rules to ignore them at all \
the processing stages. \
</p> \
</div> \
</div> \
<div id="outline-container-2-4-3" class="outline-4"> \
<h4 id="sec-2-4-3"><span class="section-number-4">2.4.3</span> Use as a code pre-processor </h4> \
<div class="outline-text-4" id="text-2-4-3"> \
<p> \
The <code>--define</code> option can be used, particularly when combined with the \
constant folding logic, as a form of pre-processor to enable or remove \
particular constructions, such as might be used for instrumenting \
development code, or to produce variations aimed at a specific \
platform. \
</p> \
<p> \
The code below illustrates the way this can be done, and how the \
symbol replacement is performed. \
</p> \
<pre class="src src-js">CLAUSE1: <span class="org-keyword">if</span> (<span class="org-keyword">typeof</span> DEVMODE === <span class="org-string">'undefined'</span>) { \
    DEVMODE = <span class="org-constant">true</span>; \
} \
<span class="org-function-name">CLAUSE2</span>: <span class="org-keyword">function</span> init() { \
    <span class="org-keyword">if</span> (DEVMODE) { \
        console.log(<span class="org-string">"init() called"</span>); \
    } \
    .... \
    DEVMODE &amp;amp;&amp;amp; console.log(<span class="org-string">"init() complete"</span>); \
} \
<span class="org-function-name">CLAUSE3</span>: <span class="org-keyword">function</span> reportDeviceStatus(<span class="org-variable-name">device</span>) { \
    <span class="org-keyword">var</span> <span class="org-variable-name">DEVMODE</span> = device.mode, <span class="org-variable-name">DEVNAME</span> = device.name; \
    <span class="org-keyword">if</span> (DEVMODE === <span class="org-string">'open'</span>) { \
        .... \
    } \
} \
</pre> \
<p> \
When the above code is normally executed, the undeclared global \
variable <code>DEVMODE</code> will be assigned the value <b>true</b> (see <code>CLAUSE1</code>) \
and so the <code>init()</code> function (<code>CLAUSE2</code>) will write messages to the \
console log when executed, but in <code>CLAUSE3</code> a locally declared \
variable will mask access to the <code>DEVMODE</code> global symbol. \
</p> \
<p> \
If the above code is processed by UglifyJS with an argument of \
<code>--define DEVMODE=false</code> then UglifyJS will replace <code>DEVMODE</code> with the \
boolean constant value <b>false</b> within <code>CLAUSE1</code> and <code>CLAUSE2</code>, but it \
will leave <code>CLAUSE3</code> as it stands because there <code>DEVMODE</code> resolves to \
a validly declared variable. \
</p> \
<p> \
And more so, the constant-folding features of UglifyJS will recognise \
that the <code>if</code> condition of <code>CLAUSE1</code> is thus always false, and so will \
remove the test and body of <code>CLAUSE1</code> altogether (including the \
otherwise slightly problematical statement <code>false = true;</code> which it \
will have formed by replacing <code>DEVMODE</code> in the body).  Similarly, \
within <code>CLAUSE2</code> both calls to <code>console.log()</code> will be removed \
altogether. \
</p> \
<p> \
In this way you can mimic, to a limited degree, the functionality of \
the C/C++ pre-processor to enable or completely remove blocks \
depending on how certain symbols are defined - perhaps using UglifyJS \
to generate different versions of source aimed at different \
environments \
</p> \
<p> \
It is recommmended (but not made mandatory) that symbols designed for \
this purpose are given names consisting of <code>UPPER_CASE_LETTERS</code> to \
distinguish them from other (normal) symbols and avoid the sort of \
clash that <code>CLAUSE3</code> above illustrates. \
</p> \
</div> \
</div> \
</div> \
<div id="outline-container-2-5" class="outline-3"> \
<h3 id="sec-2-5"><span class="section-number-3">2.5</span> Compression &ndash; how good is it? </h3> \
<div class="outline-text-3" id="text-2-5"> \
<p> \
Here are updated statistics.  (I also updated my Google Closure and YUI \
installations). \
</p> \
<p> \
We're still a lot better than YUI in terms of compression, though slightly \
slower.  We're still a lot faster than Closure, and compression after gzip \
is comparable. \
</p> \
<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides"> \
<caption></caption> \
<colgroup><col class="left" /><col class="left" /><col class="right" /><col class="left" /><col class="right" /><col class="left" /><col class="right" /> \
</colgroup> \
<thead> \
<tr><th scope="col" class="left">File</th><th scope="col" class="left">UglifyJS</th><th scope="col" class="right">UglifyJS+gzip</th><th scope="col" class="left">Closure</th><th scope="col" class="right">Closure+gzip</th><th scope="col" class="left">YUI</th><th scope="col" class="right">YUI+gzip</th></tr> \
</thead> \
<tbody> \
<tr><td class="left">jquery-1.6.2.js</td><td class="left">91001 (0:01.59)</td><td class="right">31896</td><td class="left">90678 (0:07.40)</td><td class="right">31979</td><td class="left">101527 (0:01.82)</td><td class="right">34646</td></tr> \
<tr><td class="left">paper.js</td><td class="left">142023 (0:01.65)</td><td class="right">43334</td><td class="left">134301 (0:07.42)</td><td class="right">42495</td><td class="left">173383 (0:01.58)</td><td class="right">48785</td></tr> \
<tr><td class="left">prototype.js</td><td class="left">88544 (0:01.09)</td><td class="right">26680</td><td class="left">86955 (0:06.97)</td><td class="right">26326</td><td class="left">92130 (0:00.79)</td><td class="right">28624</td></tr> \
<tr><td class="left">thelib-full.js (DynarchLIB)</td><td class="left">251939 (0:02.55)</td><td class="right">72535</td><td class="left">249911 (0:09.05)</td><td class="right">72696</td><td class="left">258869 (0:01.94)</td><td class="right">76584</td></tr> \
</tbody> \
</table> \
</div> \
</div> \
<div id="outline-container-2-6" class="outline-3"> \
<h3 id="sec-2-6"><span class="section-number-3">2.6</span> Bugs? </h3> \
<div class="outline-text-3" id="text-2-6"> \
<p> \
Unfortunately, for the time being there is no automated test suite.  But I \
ran the compressor manually on non-trivial code, and then I tested that the \
generated code works as expected.  A few hundred times. \
</p> \
<p> \
DynarchLIB was started in times when there was no good JS minifier. \
Therefore I was quite religious about trying to write short code manually, \
and as such DL contains a lot of syntactic hacks<sup><a class="footref" name="fnr.1" href="#fn.1">1</a></sup> such as “foo == bar ?  a \
= 10 : b = 20”, though the more readable version would clearly be to use \
“if/else”. \
</p> \
<p> \
Since the parser/compressor runs fine on DL and jQuery, I'm quite confident \
that it's solid enough for production use.  If you can identify any bugs, \
I'd love to hear about them (<a href="http://groups.google.com/group/uglifyjs">use the Google Group</a> or email me directly). \
</p> \
</div> \
</div> \
<div id="outline-container-2-7" class="outline-3"> \
<h3 id="sec-2-7"><span class="section-number-3">2.7</span> Links </h3> \
<div class="outline-text-3" id="text-2-7"> \
<ul> \
<li>Twitter: <a href="http://twitter.com/UglifyJS">@UglifyJS</a> \
</li> \
<li>Project at GitHub: <a href="http://github.com/mishoo/UglifyJS">http://github.com/mishoo/UglifyJS</a> \
</li> \
<li>Google Group: <a href="http://groups.google.com/group/uglifyjs">http://groups.google.com/group/uglifyjs</a> \
</li> \
<li>Common Lisp JS parser: <a href="http://marijn.haverbeke.nl/parse-js/">http://marijn.haverbeke.nl/parse-js/</a> \
</li> \
<li>JS-to-Lisp compiler: <a href="http://github.com/marijnh/js">http://github.com/marijnh/js</a> \
</li> \
<li>Common Lisp JS uglifier: <a href="http://github.com/mishoo/cl-uglify-js">http://github.com/mishoo/cl-uglify-js</a> \
</li> \
</ul> \
</div> \
</div> \
<div id="outline-container-2-8" class="outline-3"> \
<h3 id="sec-2-8"><span class="section-number-3">2.8</span> License </h3> \
<div class="outline-text-3" id="text-2-8"> \
<p> \
UglifyJS is released under the BSD license: \
</p> \
<pre class="example">Copyright 2010 (c) Mihai Bazon &lt;mihai.bazon@gmail.com&gt; \
Based on parse-js (http://marijn.haverbeke.nl/parse-js/). \
Redistribution and use in source and binary forms, with or without \
modification, are permitted provided that the following conditions \
are met: \
    * Redistributions of source code must retain the above \
      copyright notice, this list of conditions and the following \
      disclaimer. \
    * Redistributions in binary form must reproduce the above \
      copyright notice, this list of conditions and the following \
      disclaimer in the documentation and/or other materials \
      provided with the distribution. \
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY \
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE \
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR \
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE \
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, \
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, \
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR \
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY \
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR \
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF \
THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF \
SUCH DAMAGE. \
</pre> \
<div id="footnotes"> \
<h2 class="footnotes">Footnotes: </h2> \
<div id="text-footnotes"> \
<p class="footnote"><sup><a class="footnum" name="fn.1" href="#fnr.1">1</a></sup> I even reported a few bugs and suggested some fixes in the original \
    <a href="http://marijn.haverbeke.nl/parse-js/">parse-js</a> library, and Marijn pushed fixes literally in minutes. \
</p></div> \
</div> \
</div> \
</div> \
</div> \
</div> \
<div id="postamble"> \
<p class="date">Date: 2012-11-22 10:46:14 EET</p> \
<p class="author">Author: Mihai Bazon</p> \
<p class="creator">Org version 7.7 with Emacs version 24</p> \
<a href="http://validator.w3.org/check?uri=referer">Validate XHTML 1.0</a> \
</div> \
</body> \
</html> \
	';

})();
