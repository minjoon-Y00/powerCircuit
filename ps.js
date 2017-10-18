const pc = new PowerCircuit();
const width = 900;
const height = 500;
const marginW = 50;
const marginH = 50;

const svg = d3.select('graph')
  .append('svg')
  .attr('oncontextmenu', 'return false;')
  .attr('width', width + marginW * 2)
  .attr('height', height + marginH * 2);

let nodes = [
  {id: 0, x: 100, y: 200},
  {id: 1, x: 200, y: 300},
  {id: 2, x: 300, y: 100}
];

let links = [
  {source: nodes[0], target: nodes[1], left: false, right: true },
  {source: nodes[1], target: nodes[2], left: false, right: true }
];

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

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// handles to link and node element groups
let path = svg.append('svg:g').selectAll('path');
let circle = svg.append('svg:g').selectAll('g');

function draw(ns, es) {
	const biggestLv = getBiggestLevel(ns);

	console.log(ns);
	console.log(es);



	const difH = height / biggestLv;

	for(let n of ns) {
		// lv 0 -> 500
		n.y = marginH + (height - difH * n.lv);
		n.x = width / 2;
	}

	// path (link) group
	path = path.data(es);

	 // update existing links
  path.classed('selected', function(d) { return false; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


	// add new links
	path.enter().append('svg:path')
  .attr('class', 'edge')
  .classed('selected', function(d) {
  	return false; 
  })
  .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
  .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
  .attr('d', function(d) {
		console.log(d);
	  var deltaX = d.terminus.x - d.origin.x,
	      deltaY = d.terminus.y - d.origin.y,
	      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
	      normX = deltaX / dist,
	      normY = deltaY / dist,
	      sourcePadding = d.left ? 17 : 12,
	      targetPadding = d.right ? 17 : 12,
	      sourceX = d.origin.x + (sourcePadding * normX),
	      sourceY = d.origin.y + (sourcePadding * normY),
	      targetX = d.terminus.x - (targetPadding * normX),
	      targetY = d.terminus.y - (targetPadding * normY);

	      console.log('M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY);

	  return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	});

  path.exit().remove();


	// circle (node) group
	// NB: the function arg is crucial here! nodes are known by id, not by index!
	circle = circle.data(ns, function(d) { return d.id; });

	// update existing nodes (reflexive & selected visual states)
	circle.selectAll('circle')
	  .style('fill', function(d) { return '#9F9'})
	  .classed('reflexive', function(d) { return false; });

	// add new nodes
	let g = circle.enter().append('svg:g');

	g.append('svg:circle')
	  .attr('class', 'node')
	  .attr('r', 12)
	  .attr('cx', (d) => {return d.x})
	  .attr('cy', (d) => {return d.y})
	  .style('fill', function(d) { return d.marked ? '#888' : '#FFF'; })
	  .classed('reflexive', function(d) { return false; });
	    
	path = svg.append('svg:g').selectAll('path');

	path.attr('d', function(d) {
		console.log(d);
	});
	console.log('hele?');


	path.attr('d', function(d) {
		console.log(d);
	  var deltaX = d.terminus.x - d.origin.x,
	      deltaY = d.terminus.y - d.origin.y,
	      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
	      normX = deltaX / dist,
	      normY = deltaY / dist,
	      sourcePadding = d.left ? 17 : 12,
	      targetPadding = d.right ? 17 : 12,
	      sourceX = d.origin.x + (sourcePadding * normX),
	      sourceY = d.origin.y + (sourcePadding * normY),
	      targetX = d.terminus.x - (targetPadding * normX),
	      targetY = d.terminus.y - (targetPadding * normY);

	      console.log('M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY);

	  return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	});

  circle.exit().remove();


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
	draw(ne.ns, ne.es);

	console.log('clicked.');
});
