// define variables for spacing, margins, etc.
centreSpacing = 25; // spacing in between the male and female bars
margin = { left: 10, right: 10, top: 30, bottom: 25 };
h = 680 - margin.top - margin.bottom;
w = 1400 - margin.left - margin.right;

// set up SVG
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom);

// set up three g (group) elements to help position things and organise our chart
// g element for the bars for the male population
var gM = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// g element for the bars for the female population
var gF = svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (margin.left + (w - centreSpacing) / 2 + centreSpacing) +
      "," +
      margin.top +
      ")"
  );
// g element for the labels
var gLabels = svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (margin.left + (w - centreSpacing) / 2 + "," + margin.top + ")")
  );

// scale functions to map data to width/height/position
y = d3.scaleBand().range([h, 0]).padding(0.1);

x = d3.scaleLinear().range([0, (w - centreSpacing) / 2]);

// we will use this to create a reversed axis (right to left) for the male population later
xReverse = d3.scaleLinear().range([0, (w - centreSpacing) / 2]);

// Load data
// Everything that we need the data for has to happen inside of this function
d3.csv("Maried.csv").then(function (data) {
  // prepare the data
  data = data.map((d) => ({
    age: d.Age,
    females: +d.Females,
    males: +d.Males,
  }));

  // to complete our scale functions, we need to set their domains based on the values in the data
  // largest value out of all male or female counts for all years
  maxVal = d3.max(data, (d) => d3.max([d.males, d.females]));
  x.domain([0, maxVal]);
  xReverse.domain([maxVal, 0]);
  y.domain(data.map((d) => d.age));

  // create bars for male population
  gM.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => (w - centreSpacing) / 2 - x(d.males))
    .attr("y", (d) => y(d.age))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d.males))
    .style("fill", "Aqua");

  // create bars for female population
  gF.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => y(d.age))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d.females))
    .style("fill", "LightPink");

  // add labels for age groups in the centre of the chart
  gLabels
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", centreSpacing / 2)
    .attr("y", (d) => y(d.age) + y.bandwidth() / 2)
    .text((d, i) => (i != data.length - 1 ? (i % 5 == 0 ? d.age : "") : "90+"));

  // add an axis for female pop values
  gF.append("g")
    .attr("transform", "translate(0," + (h + 3) + ")")
    .call(d3.axisBottom(x).ticks(w / 80, "s"));

  // add an axis for male pop values
  gM.append("g")
    .attr("transform", "translate(0," + (h + 3) + ")")
    .call(d3.axisBottom(xReverse).ticks(w / 80, "s"));
});

// Additional labeling (we do not need the data for this)

// add a little 'Age' header at the top
gLabels
  .append("text")
  .text("Age")
  .attr("x", centreSpacing / 2)
  .attr("y", -14)
  .style("font-weight", "bold");

// add Male/Female labels
gF.append("text")
  .text("Female Population")
  .attr("x", (w - centreSpacing) / 2)
  .attr("y", h - 7)
  .style("text-anchor", "end");
gM.append("text")
  .text("Male Population")
  .attr("x", 0)
  .attr("y", h - 7)
  .style("text-anchor", "start");