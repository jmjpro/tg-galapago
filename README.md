Galapago, the game (not [Galapagos](http://en.wikipedia.org/wiki/Gal%C3%A1pagos_Islands), the island)
=============================================

Overview
--------
Galapago is an HTML5 game for interactive television. Time Savers (TS) is developing Galapago for TransGaming (TG), a maker of interactive games. Galapago already exists as a PC game. This Galapago is mostly just a rewrite of the existing PC game, with some additions such as such as support for Google ads. The game is required to be built using the HTML5 hardware-accelerated ```<canvas>``` tag. New generations of interactive televisions such Sony Blu-Ray (Opera), Dish Network Hopper (Webkit?), and Toshiba (Espial Webkit) support HTML5 specs in general, and in particular ```<canvas>```. These devices are generally focus on TV watching and don't allocate a lot of memory or CPU to there integrated web browser. As such, Galapago code must be highly memory and CPU efficient. We must assume that the browser executing the game has less memory and CPU power than even an average Android phone.

Tools
-----
<dl>
  <dt>Version control</dt>
  <dd>[Github] (https://github.com/jmjpro/tg-galapago)</dd>
  <dt>Issue tracking</dt>
  <dd>[Github] (https://github.com/jmjpro/tg-galapago)</dd>
  <dt>Time tracking and invoicing</dt>
  <dd>TBD. See below</dd>
</dl>

Some options to consider for GitHub issue integrated time tracking:
* [Freckle] (http://timesavers.letsfreckle.com) add [f:15] to a GitHub checkin comment to log 15 minutes of work against an issue
* [Harvest] (http://blog.klokantech.com/2012/12/github-time-tracking-and-invoicing.html) browser plugin decorates GitHub page with mini form for entering Harvest time. I couldn't see the mini form after installing the plugin in both Chrome and Firefox
* [TimeHub] (https://timehub.me/) This couldn't see my the tg-galapago repo. The site maintainer is investigating the issue.
