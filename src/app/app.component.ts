import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface HistogramDistribution {
  dateRange: string;
  total: number;
  delivered: number;
  undeliverable: number;
  expired: number;
  enroute: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  data: HistogramDistribution[];

  title = 'stacked-barchart-example';

  ngOnInit() {

     this.data = [
        { dateRange : '2019-12-11' , total: 450, delivered : 200, undeliverable: 150, enroute: 25, expired: 75 },
        { dateRange : '2019-12-12' , total: 1000, delivered : 300, undeliverable: 250, enroute: 300, expired: 150 },
        { dateRange : '2019-12-13' , total: 3000, delivered : 2000, undeliverable: 100, enroute: 900, expired: 0 },
        { dateRange : '2019-12-14' , total: 5500, delivered : 3500, undeliverable: 500, enroute: 500, expired: 1000 },
        { dateRange : '2019-12-15' , total: 5000, delivered : 2000, undeliverable: 1000, enroute: 1500, expired: 500}]

    this.drawSvg(this.data);

  }

  drawSvg( data: HistogramDistribution[]) {

    const margin = {top: 10, right: 20, bottom: 60, left: 60};
    const width = 960 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select('div#histogramHolder').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g');
    g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).paddingOuter(0.5).align(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const z = d3.scaleOrdinal().range([ 'msgdelivered' ,  'msgundelivered', 'msgenroute', 'msgexpired' ]);
    const keys = [ 'delivered', 'undeliverable' , 'enroute', 'expired' ];

    x.domain(data.map( d =>  d.dateRange));
    y.domain([0, d3.max(data, d => d.total )]).nice();
    z.domain(keys);

    g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(keys)(data))
    .enter().append('g')
    .attr('class', function(d) { 
      return z(d.key);
     })
    .selectAll('rect')
        .data(function(d) { return d; })
        .enter().append('rect')
        .attr('x', function(d) { 
          return x(d.data.dateRange); }
          )
        .attr('y', function(d) { 
          return y(d[1]); }
          )
        .attr('height', function(d) { return y(d[0]) - y(d[1]); })
        .attr('width', x.bandwidth())
        .attr('y', (d: any) => {
          return y(d[1])
        })

  }



}
