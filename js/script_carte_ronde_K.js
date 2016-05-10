// Code goes here

var diameter = 1000;

var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  },
  width = diameter,
  height = diameter;

var i = 0,
  duration = 350,
  root;

var tree = d3.layout.tree()
  .size([360, diameter / 2 - 80])
  .separation(function(a, b) {
    return (a.parent == b.parent ? 1 : 10) / a.depth;
  });

var diagonal = self.diagonal = d3.svg.line().interpolate('step')
  .x(function(d) {
    return d.x;
  })
  .y(function(d) {
    return d.y;
  });

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

// load the external data
d3.json("data/data_arbre.json", function(error, dataFile) {
  root = dataFile;
	root.x0 = height / 2;
	root.y0 = 0;
	update(root);
});

//d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 80;
  });

  // Update the nodes.
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      console.log(d)
      return d.id || (d.id = ++i);
    });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    .on("click", click);

  nodeEnter.append("circle")
    .attr("r", 3)
    .style("fill", function(d) {
      return d._children ? "#FFA500" : "#fff";
    });

  nodeEnter.append("text")
    .attr("x", 10)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    //.attr("transform", "translate(3,0)")
    .attr("transform", function(d) { return d.x == 180 ? "translate(5)" : "rotate("+ (-d.x + 90) +")translate(5)"; })
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    })

  nodeUpdate.select("circle")
    .attr("r", 8)
    .style("fill", function(d) {
      return d._children ? "#FFA500" : "#fff";
    })

    ;

  nodeUpdate.select("text")
    .style("fill-opacity", 1)

  // TODO: appropriate transform
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "diagonal(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 7);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links.
  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    })

    ;

  // Enter any new links at the parent's previous position.
  link.enter().append('svg:path', 'g')
    .duration(self.duration)
    .attr('d', function(d) {
      return self.diagonal([{
        y: d.source.x,
        x: d.source.y
      }, {
        y: d.target.x,
        x: d.target.y
      }]);
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update(d);
}

// Collapse nodes
function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}
