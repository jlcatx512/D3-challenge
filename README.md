# D3-challenge
November 7, 2019

## OVERVIEW ##
* [Project repo](https://github.com/jlcatx512/D3-challenge)
* [Instructions](https://github.com/the-Coding-Boot-Camp-at-UT/UT-MCB-DATA-PT-07-2019-U-C/tree/master/homework-instructions/16-D3/Instructions)
* [d3 API Documentation](https://github.com/d3/d3/blob/master/API.md)

## Debrief ##
* Needed to literally refresh memory by redoing all videos.
* Change everything to a `var`! Because it breaks scope.
* NB import d3 tip js file.

## ACTION ITEMS ##
* [Dev Tools](https://developers.google.com/web/tools/chrome-devtools)
    * Core Workflows
    * > When you want to see logged messages or run JavaScript, press Command+Option+J (Mac) or Control+Shift+J (Windows, Linux, Chrome OS) to jump straight into the Console panel.
    * [JS Debuggin Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/javascript/)
* [UTAUS201901DATA3Wed, Nov 6 2019 at 6:18 PM](https://bootcampspot.com/sessions/591052/videos/62865)
* https://bootcampspot.com/sessions/591045/videos/63375
    *  Mon reviews text elements.
    * Adding `text` tag to `svg` element.  
    * Code for text should look almost identical to the circles.
        * NB do NOT select text tag. `selectAll(".my-text")`
    * `.append(text)` .. this appends the new `<text>` tag in the `chartGroup`.
    * `.classed("my-text", true)` add class of my-text
    * Fix x and y attributes.
    * No radius
    * No fill or opacity.
    * `.text(d=>d.num_hits)`
* ~~https://www.oreilly.com/learning/making-a-scatterplot-with-d3-js~~

## Text Group sample code ##
> `var textGroup = chartGroup.selectAll("text.my-text")
>         .data(hairData)
>         .enter()
>         .append("text")
>         .classed("my-text", true)
>         .attr("x", d => xLinearScale(d[chosenXAxis]))
>         .attr("y", d => yLinearScale(d.num_hits))
>         .text(d => d.num_hits)`

<hr>

## Setting up local web server ##
* On Windows
* > `python -m http.server 8000 --bind 127.0.0.1`
* > `python -m http.server 5000 --bind 127.0.0.1`
* Try ports `5001` or `3000`.

## Parse the data ##
* data.csv

    |variable| description | notes|
    | :---:    | ---             | ---    |
    | `id`  |   |
    | `state`   | e.g. "California"  |
    | `abbr`    |  e.g. "CA" |
    | `poverty`     |   |
    | `povertyMoe`  |   |
    | `age`     |   |
    | `ageMoe`  |   |
    | `income`  |   |
    | `incomeMoe`   |   |
    | `healthcare`  |   |
    | `healthcareLow`   |   |
    | `healthcareHigh`  |   |
    | `obesity`     |   |
    | `obesityLow`  |   |
    | `obesityHigh`     |   |
    | `smokes`  |   |
    | `smokesLow`   |   |
    | `smokesHigh`  |   |
    | `-0.385218228`    |   | A mistake?

## Axes ##
* [Adding a simple guide From Learning Data Visualization with D3.js](https://www.lynda.com/D3-js-tutorials/Adding-simple-guide/594451/619574-4.html)
* [D3 documentation](https://github.com/d3/d3-axis)

<hr>

## Data Join ##
* Definition
* https://github.com/d3/d3-selection#selection_enter
> Conceptually, the enter selection’s placeholders are pointers to the parent element (in this example, the document body). The enter selection is typically only used transiently to append elements, and is often merged with the update selection after appending, such that modifications can be applied to both entering and updating elements.
* [Lynda - D3 subselections](https://www.lynda.com/D3-js-tutorials/Creating-subselections/594451/619558-4.html)
    * How to think about `enter()`. A bit of time travel.
    * Acting on elements that don't exist yet.
    * 1. `select` element that DOES exist.  | somethign there. |
    * 2. `selectAll` elements that do NOT exist.    | somethign there. |
    * 3. `data()` bind data to selection.
    * 4. `enter()`  | somethign there. |
    * 5. `append()` element in selectAll that do not exist. NB referred to twice!
    * 6. `html()` and function. Act on the new data elements.
* NB --> set up data as an array of objects. Objects are like dicts. 
* > Using D3 you create a _____ for programmatically-created elements, and then queue up commands for these elements.

## SVG Review ##
* [Mozilla Reference SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes)
* [SVG Text Element](https://www.dashingd3js.com/svg-text-element)

## Importance of scaling ##
* Have the SVG shapes scale in size according to the size of the SVG canvas/container.
* [How Scales Work - Data Visualization and D3.js(]https://www.youtube.com/watch?v=0hnrHnrXWx4)
* [Generative Data Visualization in D3.js pt.2 (with Shirley Wu) — Learn With Jason](https://www.youtube.com/watch?v=S3TS6IGSUS4)
* `domain` input
* `range` output

## Event handling in d3 ##
* NB to target element with `this` keyword.
* https://github.com/d3/d3/blob/master/API.md#handling-events
* What element does it attach to?

## d3 Transitions ##
* Create a myChart `var`.
* https://www.dashingd3js.com/lessons/d3-transition-basics
* [D3 Scatterplot (Animations)](http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae)
    * NB uses version 3.

## Scatterplot Examples ##
* [Scatterplot - d3-graph-gallery](https://www.d3-graph-gallery.com/scatter.html)
* [D3 Scatterplot Example](http://bl.ocks.org/weiglemc/6185069)
* https://www.d3-graph-gallery.com/scatter.html
* [Interactive grouped scatterplot in d3.js](https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html)
* [Update X axis limits on scatterplot](https://www.d3-graph-gallery.com/graph/scatter_buttonXlim.html)
> This post describes how to update the X axis limit with a smooth transition. When the button on top of the scatter plot is updated, both the axis and circles position are smoothly updated. See more on scatter plot, animation and buttons if needed.
* [Adding buttons on d3.js charts](https://www.d3-graph-gallery.com/graph/interactivity_button.html)
* [Making a scatterplot with D3.js](https://www.oreilly.com/learning/making-a-scatterplot-with-d3-js)
    * Example of adding text to circles on a scatterplot.

## Circles and Labels ##
* https://stackoverflow.com/questions/36954426/adding-label-on-a-d3-scatter-plot-circles
* Create a group!
* Add circles and texts separately to that group.

## Tool Tips ##
* NB DON'T FORGET TO ADD .js to source index.html!
* >Check out David Gotz's example to see how you should implement tooltips with d3-tip.
* http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7

## d3 Axis ##
* https://github.com/d3/d3-axis
* http://bl.ocks.org/emmasaunders/cebb1837530c876def717c0e5c61da31

## d3 color scales ##
* http://bl.ocks.org/emmasaunders/52fa83767df27f1fc8b3ee2c6d372c74
*  lynda.com/D3-js-tutorials/Making-tree-from-JSON/504428/549433-4.html

## SVG `text` elements ##
* `text-anchor` to align horizontally and `dominant-baseline` to align vertically. ALong default position of lower left-hand corner.
* The x and y default position behavior of text element is the left hand bottom.
* To change where that x, y coordinate is, you need to use text-anchor and dominant-baseline. You can do this with attr or CSS.
* https://www.lynda.com/D3-js-tutorials/Adding-text/504428/549404-4.html/
> - [Instructor] In theory, all you need to add text to your SVG is the text itself because browsers default thex and y coordinates to zero. 
* debugging --> click on DOM. find your element. if you click on it while in the inspector, you should see something on the page. 
* Three ways to style svg text elements.
    1. `attr`
        *  e.g. attr(") fill stroke  
        * text is a shape
        * `fill`
        * `stroke`
        * `stroke-width`
    2. `style`
    3. CSS
* `dominant-baseline` --> `middle`
* https://bl.ocks.org/emmasaunders/0016ee0a2cab25a643ee9bd4855d3464
    * --> version3
* tspan --> to add a new line. Do a data join with tspan elements.
* selectAll("tspan").data(array).enter().append("tspan")
* https://www.dashingd3js.com/lessons/svg-text-elements
* https://stackoverflow.com/questions/36954426/adding-label-on-a-d3-scatter-plot-circles
* https://fcc.fiftykg.com/data-visualization-certification/data-visualization-with-d3/data-visualization-with-d3-add-labels-to-scatter-plot-circles.html
    * Good simple example.
    * NB how circle and text are added separately to the `svg` element.
    * NB how circle and text x-y coordinates are similar.
    * In my code, I added both circles and text to a group element first.
    * Other examples:
        * http://bl.ocks.org/WilliamQLiu/803b712a4d6efbf7bdb4
        * https://www.freecodecamp.org/forum/t/add-labels-to-scatter-plot-circles/199386  

<hr>

### Changelog ###
* [2019-11-14 12:35 AM] - `y-axis` transition wasn't working because didn't define `yAxis var`. 