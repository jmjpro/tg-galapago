/*
adapted from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
<!-- Copyright (c) 2012 Google Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Author: Ilmari Heikkinen <ilmari@google.com>
   *
   * 
   *
  -->
*/
Filters = {};

Filters.filterImage = function(filter, ctx, img, x, y, width, height, var_args) {
  var pixels, args;
  pixels = ctx.getImageData(x,y,width,height);
  args = [pixels];
  for (var i=5; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};

Filters.brightness = function(pixels, adjustment) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
  return pixels;
};