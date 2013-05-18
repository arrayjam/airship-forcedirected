var width  = 800,
    height = 500;

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("airship.json", function(data) {
  var nodes = data.content;
  data.root.parents = [];
  data.root.fixed = true;
  data.root.x = width / 2;
  data.root.y = 10;
  nodes.push(data.root);

  var hash_to_node = {};
  nodes.forEach(function(node) {
    hash_to_node[node.hash] = node;
  });

  var links = [];
  nodes.forEach(function(node) {
    node.parents.forEach(function(parent) {
      links.push({source: node, target: hash_to_node[parent]});
    });
  });

  force.nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .call(force.drag);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  });
});
