const pc = new PowerCircuit();
const width = 900;
const height = 500;
const marginW = 50;
const marginH = 50;

const svg = d3.select('graph')
  .append('svg')
  //.attr('oncontextmenu', 'return false;')
  .attr('width', width + marginW * 2)
  .attr('height', height + marginH * 2);

svg.append('svg:defs').append('svg:marker')
	  .attr('id', 'end-arrow')
	  .attr('viewBox', '0 -5 10 10')
	  .attr('refX', 6)
	  .attr('markerWidth', 3)
	  .attr('markerHeight', 3)
	  .attr('orient', 'auto')
	.append('svg:path')
	  .attr('d', 'M0,-5L10,0L0,5')
	  .attr('fill', '#000');

function render(nodes, edges) {

	// clear all
	svg.selectAll('g').remove();

	// handles to link and node element groups
	let path = svg.append('svg:g').selectAll('path');
  let circle = svg.append('svg:g').selectAll('circle');

	// circle (node) group
	// NB: the function arg is crucial here! nodes are known by id, not by index!
	circle = circle.data(nodes, (d) => { return d.id; });
	
	circle.enter().append('svg:circle')
		.attr('class', 'node')
	  .attr('r', 12)
	  .attr('cx', (d) => {return d.x})
	  .attr('cy', (d) => {return d.y})
	  .style('fill', function(d) { return d.marked ? '#888' : '#FFF'; });

	// path (link) group
	path = path.data(edges);

	path.enter().append('svg:path')
	  .attr('class', 'edge')
	  .style('marker-end', function(d) { return 'url(#end-arrow)'; })
	  .attr('d', function(d) {
		  const deltaX = d.terminus.x - d.origin.x;
		  const deltaY = d.terminus.y - d.origin.y;
		  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		  const normX = deltaX / dist;
		  const normY = deltaY / dist;
		  const sourcePadding = 12;
		  const targetPadding = 17;
		  const sourceX = d.origin.x + (sourcePadding * normX);
		  const sourceY = d.origin.y + (sourcePadding * normY);
		  const targetX = d.terminus.x - (targetPadding * normX);
		  const targetY = d.terminus.y - (targetPadding * normY);
		  return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
		});
}

function calXYofNodes(nodes, edges) {
	const biggestLv = getBiggestLevel(nodes);

	console.log(nodes);
	console.log(edges);

	const difH = height / biggestLv;

	for(let n of nodes) {
		// lv 0 -> 500
		n.y = marginH + (height - difH * n.lv);
		n.x = width / 2;
	}
}

function getBiggestLevel(ns) {
	let biggest = 1;
	for(let n of ns) {
		if (n.lv > biggest) biggest = n.lv;
	}
	return biggest;
}


$("#power2").keyup(function() {
  const pow2 = $(this).val();
  const dec = pc.parse(pow2);
  if (dec !== null) {
  	$("#decimal").val(dec);
		//const ne = pc.getNodeEdge();
  }
});

$("#decimal").keyup(function() {
  const dec = $(this).val();
  const pow2 = pc.getPow2(dec);
  if (pow2 !== null) {
  	$("#power2").val(dec);
  }
});

$("#drawBtn").click(() => {
	const ne = pc.getNodeEdge();
	calXYofNodes(ne.nodes, ne.edges);
	render(ne.nodes, ne.edges);
});