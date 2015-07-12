#Chrome Tiff viewer
A Chrome extension that enables tiff images, inline in your browser. As if they were supported for real.

The extension works by intercepting any attempt by the browser to load a URL that ends in .tiff (or variants) and handling that request instead. The handling consists of using a Javascript, LLVM/Emscripten, port of libtiff to render the tiff image onto an in memory canvas. The canvas has a method for getting its content as a dataurl and that is used to get a redirect URL for the original browser request.

So:

 1. Block original request
 2. Load requested URL using XHR
 3. Render recived image into canvas
 4. Get dataurl from canvas and redirect

The effect is that the tiff images appear on page as if the browser had native support for tiff images. There is a small delay though, due to the fact that we have to download and decode the image separately. But it's small enough that you won't notice it unless you look for it.

#Known limitations
The extension has a few limitations that might be worth knowing about. If you find an image it cant decode or if it decodes it incorrectly etc open an issue, include the url to the image and I'll have a look.
##Memory
The libtiff port has a limited amount of memory available for decoding the image. Currently it's set to 32MB, 33554432 bytes. This is pretty high and that is because the port doesn't really use memory efficiantly. It seems to be loading the entire image into memory before manipulating it. In my tests this was enough to decode a 1200x1600 pixel image and should be enough for most uses. I'm probably going to create an options panel where you can set this if you run in to any limits. But for now it's fixed at 32MB
##libtiff.js
I'm using Seikichis port of libtiff, [seikichi/tiff.js](https://github.com/seikichi/tiff.js/tree/master), and the extension has the same limitations as his port. Mainly it's the memory issue discussed above. But it also doesn't support JPEG compressed Tiffs since Seikichi didn't link libjpeg when he compiled libtiff :)

#Plans
It would be nice to have a real Javascript decoder for tiffs, instead of the LLVM port. G.P. Hemsley has that going over at Github as well, [GPHemsley/tiff-js](https://github.com/GPHemsley/tiff-js), so I might get into that if I have some time over (so probably not tbh).

A settings panel for things like switching debug output on and changing the memory limit would be nice.

Another approach for intercepting the image and decoding would also be nice sice it has to be syncronous now and that means I can't use the nice XHR bytearray return type but had to hack my own convertion that eats time as well...

#Thanks
To Seikichi for his port of libtiff. That saved me some serious time and effort.
To the Google chrome team for decent documentation that made it relatively simple to implement this.
To Mozilla for MDN, THE best resource when you want to quickly look up some Javascript API :)

#License
I'm using the MIT licens for this. See the LICENSE document for more info.