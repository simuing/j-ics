import * as d3 from 'd3';

// Another look at creation of SVG element 
// Use of viewBox ensures chart is responsive 
let viewBoxHeight = 100;
let viewBoxWidth = 200;
this.svg = d3.select(this.hostElement).append('svg')
 .attr('width', '100%')
 .attr('height', '100%')
 .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);