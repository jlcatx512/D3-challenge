// Jadd Cheng
// November 13, 2019

// Define initial width and height of svg container.
var svgWidth = 960;
var svgHeight = 500;

// Define margins.
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of chart area.
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

// Append a chartGroup element to svg.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial default values of x and y axes.
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

  return yAxis;
}

// Functions for updating circles and text groups upon transition event.
// One each for change of x-axis and another for change of y-axis.

// RENDER X-AXIS - 1. circlesGroup 2. textGroup
function renderCirclesXAxis(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
  return circlesGroup;

}

function renderTextGroupXAxis(textGroup, newXScale, chosenXAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
  return textGroup;

}

// RENDER Y-AXIS - 1. circlesGroup 2. textGroup
function renderCirclesYAxis(circlesGroup, newYScale, chosenYAxis) {
  
  circlesGroup.transition()
  .duration(1000)
  .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
}

function renderTextGroupYAxis(textGroup, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])*1.015) // Multiply by offset
  return textGroup;

}

// Function to update tool tip upon transition event.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // var label  = "";
  var xLabel = chosenXAxis;
  var yLabel = chosenYAxis;

  if (chosenXAxis === "poverty") {
      xLabel = "Poverty (%):";
  } else if(chosenXAxis === "age"){
    xLabel = "Age (Median):";
  }
  else {
      xLabel = "Household Income (Median): ";
  }

  if (chosenYAxis === "obesity") {
      yLabel = "Obese (%):";
  } else if(chosenYAxis === "smokes"){
    yLabel = "Smokes (%):";
  }
  else {
      yLabel = "Lacks Healthcare (%): ";
  }

  var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([80, -60])
      .html(function(d) {
          return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });

  circlesGroup.call(toolTip);
  
  // onmouseover event --> show 
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
  })

  // onmouseout event --> hide
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
  });
return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
(async function(){
    var censusData = await d3.csv("assets/data/data.csv");
    console.log(censusData);

    // Parse data. Convert into numerical data types.
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

    // xLinearScale function above csv import.
    var xLinearScale = xScale(censusData, chosenXAxis);

    // yLinearScale
    var yLinearScale = yScale(censusData, chosenYAxis)

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append initial circles and text.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true)
        
    // Append text elements to circles. Do NOT select tag. Select class.
    var textGroup = chartGroup.selectAll(".textLabels")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+4)
        .classed("textLabels stateText", true);

    // x-axis labels
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
          .classed("inactive aText", true)
          .text("Age (Median)");

      var incomeLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "income") // value to grab for event listener
          .classed("inactive aText", true)
          .text("Household Income (Median)");

    // y-axis labels Two group elements needed!
    // Cannot transform twice on the same group. It's an attribute.
    var yLabelsGroup = chartGroup.append('g')
        .attr("transform", `translate(0, ${height / 2})`)
        .append("g")
        .attr("transform", "rotate(-90)");
        
      var obeseLabel = yLabelsGroup.append("text")
        .attr("y", -100)
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive aText", true)
        .text("Obese (%)");
        
        var smokesLabel = yLabelsGroup.append("text")
        .attr("y", -80)
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)");
        
        var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", -60)
        .attr("dy", "1em")
        .classed("active aText", true)
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    // add chosenYAxis here!
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Update xLabelsGroup. Event listener.
    xLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        console.log("Value of chosenXAxis before click was: " + chosenXAxis)
        var value = d3.select(this).attr("value");
        console.log("Value of clicked label is: " + value);

        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            console.log("chosenXAxis is now:" + chosenXAxis)

            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxis(xLinearScale, xAxis);
            // xAxis = renderXAxis(xLinearScale, chosenXAxis); // doesn't work

            // updates circles with new x values
            circlesGroup = renderCirclesXAxis(circlesGroup, xLinearScale, chosenXAxis);
            // circlesGroup = renderCirclesXAxis(circlesGroup, xLinearScale, xAxis);

            textGroup = renderTextGroupXAxis(textGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            // circlesGroup = updateToolTip(chosenXAxis, circlesGroup); // works
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
            } else if (chosenXAxis === "age"){
                  povertyLabel
                      .classed("active aText", false)
                      .classed("inactive", true);
                  ageLabel
                      .classed("active aText", true)
                      .classed("inactive", false);
                  incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
            }
            else {
              povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
              ageLabel
                  .classed("active aText", false)
                  .classed("inactive", true);
              incomeLabel
                  .classed("active aText", true)
                  .classed("inactive", false);
            }
        }
    });

    // Update yLabelsGroup. Event listener.
    yLabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        console.log("Value of chosenYAxis before click was: " + chosenYAxis)
        var value = d3.select(this).attr("value");
        console.log("Value of clicked label is: " + value);

        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            console.log("chosenYAxis is now:" + chosenYAxis)

            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);

            // Update circlesGroup and textGroup with new y values
            circlesGroup = renderCirclesYAxis(circlesGroup, yLinearScale, chosenYAxis);
            textGroup = renderTextGroupYAxis(textGroup, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            // circlesGroup = updateToolTip(chosenXAxis, circlesGroup); // works
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            // need x and y labels updated too.
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active aText", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenYAxis === "smokes"){
                  healthcareLabel
                      .classed("active aText", false)
                      .classed("inactive", true);
                  smokesLabel
                      .classed("active aText", true)
                      .classed("inactive", false);
                  obeseLabel
                      .classed("active", false)
                      .classed("inactive", true);
            }
            else {
              healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
              smokesLabel
                  .classed("active aText", false)
                  .classed("inactive", true);
              obeseLabel
                  .classed("active aText", true)
                  .classed("inactive", false);
            }
        }
    });
})()