// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth + margin.left + margin.right)
  .attr("height", svgHeight + margin.top + margin.bottom);
// Add margins???

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params. Default values x and y axes.
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating x-scale var upon click on axis label
// For domain and range, multiply by offset to avoid elements overlapping axes.
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.95,
      d3.max(censusData, d => d[chosenXAxis]) * 1.05])
    .range([0, width]);
  return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label
// For domain and range, multiply by offset to avoid elements overlapping axes.
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.80,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]); // big difference with x. range is reversed.
  return yLinearScale;
}

// X AXIS - function used for updating xAxis var upon click on axis label
// create one for y
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);  

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

// Y AXIS function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return xAxis;
}

// Function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  // new cy?
  // need to update function, newYScale and new chosenYaxis.

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=> newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
    var label  = "";
    if (chosenXAxis === "poverty") {
        label = "Poverty %:";
    }
    else {
        label = "Age (Median):";
    }
    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.poverty}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
(async function(){
    var censusData = await d3.csv("assets/data/data.csv");
    console.log(censusData);

    // parse data
    // id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,
    // obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity; 
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // fix this up top --> need to change to yScale function.
    // Create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis)
    // var yLinearScale = d3.scaleLinear()
    //     .domain([d3.min(censusData, d => d[chosenYAxis]),
    //     d3.max(censusData, d => d[chosenYAxis])])
    //     // .domain([d3.extent(censusData, d => d[chosenYAxis])
    //     .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    // A group that will group both 1. circle shapes 2. text shapes
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("g")
    
    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true)
    
    // change this to circlesLables
    // var circleLabels = chartGroup.selectAll("text").
    // .data().
    // .enter()
    // .append
    circlesGroup.append("text")
        .classed("my-text stateText", true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+4);
        // .attr("fill", "#009294")
        // .attr("opacity", ".40");
/*    
    // append text group
    var textGroup = chartGroup.selectAll("text.my-text")
        .data(censusData)
        .enter()
        .append("text")
        .classed("my-text stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+3.8)
        .text(d => d.abbr);
        // .style("fill", "white");
*/
    // Create group for  2 x- axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active aText", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
        
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // append y axis
    // var ylabelsGroup = chartGroup.append("g")
    //     .attr("transform," `translate(${width / 2}, ${height + 20})`)
    //     .classed("active", true);

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare %");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // create y labels group
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        console.log(value);

        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            console.log("chosenXAxis is:" + chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxis(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
            // need x and y labels updated too.
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active aText", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active aText", true)
                    .classed("inactive", false);
            }
        }
    });
})()