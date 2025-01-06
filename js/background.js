const width = window.innerWidth;
const height = window.innerHeight;

// Create an SVG canvas
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Generate random nodes and links
const nodeCount = 30;
const linkCount = 50;

const nodes = d3.range(nodeCount).map((d) => ({ id: d }));
const links = d3.range(linkCount).map(() => ({
  source: Math.floor(Math.random() * nodeCount),
  target: Math.floor(Math.random() * nodeCount),
}));

// Simulation with forces
const simulation = d3
  .forceSimulation(nodes)
  .force("link", d3.forceLink(links).distance(100).strength(0.5))
  .force("charge", d3.forceManyBody().strength(-50))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

// Draw the links
const link = svg
  .selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link");

// Draw the nodes
const node = svg
  .selectAll(".node")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("r", 8)
  .call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

// Update node and link positions on each tick
function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}

// Dragging behavior
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// Handle window resize
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  svg.attr("width", newWidth).attr("height", newHeight);
  simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
});
