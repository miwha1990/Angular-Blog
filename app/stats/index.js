import angular from 'angular';
import Template from './stats.html';
import menuComponemt from '../common/menu';
import './style.styl';
import * as d3 from "d3";

const NAME = 'stats';

class statsCtrl {
    constructor($cookies, $q, $http, $rootScope, $scope) {
        this.$cookies = $cookies;
        this.$q = $q;
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.createSVG();
    }
    createSVG(){
        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = 600 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;
        var drag_start, current_translate, current_scale;
        var zoomer = d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", function(){
                current_translate = d3.transform(d3.select('path').attr("transform")).translate;
                d3.select('path').attr("transform", "translate(" + current_translate + ")scale( " + d3.event.transform.k + " , 1)");
            });

        var  dragListener = d3.drag()
            .on("start", function(d){drag_start = d3.event.sourceEvent.offsetX;})
            .on("drag", function(d) {
                current_scale = d3.transform(d3.select('path').attr("transform")).scale;
                d3.select('path').attr("transform", "translate(" + (d3.event.x - drag_start - 48) + ", 1)scale( " + current_scale + " , 1)");
             // d3.select('path').attr("transform", "translate( " + (d3.event.x - drag_start - 48) + " , 1)");
               // d3.select('path').translate((d3.event.x - drag_start - 48), 1);
                //d3.select('path').attr(transform.translate((d3.event.x - drag_start - 48), 1));
                /*current_translate = d3.transform(svg.attr("transform")).translate;
                 dx = d3.event.wheelDeltaX + current_translate[0];
                 dy = d3.event.wheelDeltaY + current_translate[1];

                 svg.attr("transform", "translate(" + [dx,dy] + ")");
                 d3.event.stopPropagation();*/
            })
           .on('end', function(d){});
        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        var old_svg = document.getElementsByTagName('svg')[0];
        if(old_svg) old_svg.remove();
        // Adds the svg canvas
        var svg = d3
            .select(".svg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
            .call(dragListener)
            .call(zoomer);


        var  area = d3.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.close); });

// Define the axes
        var xAxis = d3.axisBottom().scale(x).ticks(5);
        var yAxis = d3.axisLeft().scale(y).ticks();

// Get the data
        d3.csv("app/stats/data.csv", function(error, data) {
            data.forEach(function(d) {
                d.date = Date.parse(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.close; })]);

            svg.append("linearGradient")
                .attr("id", "temperature-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0).attr("y1", y(300))
                .attr("x2", 0).attr("y2", y(700))
                .selectAll("stop")
                .data([
                    {offset: "20%", color: "#3e4b7d"},
                    {offset: "40%", color: "gray"},
                    {offset: "60%", color: "#a95151"},
                    {offset: "100%", color: "red"}
                ])
                .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

            // Add the valueline path.
            svg.append("path")
                .attr("class", "line")
                .attr("d", area(data));

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                 .attr("class", "y axis")
                 .call(yAxis)
                .append("text")
                 .attr("y", -11)
                 .attr('fill', '#000')
                 .attr("dy", ".71em")
                 .style("text-anchor", "end")
                 .text("$ (USD)");

            function showOnly(data, delta , domain, old_domain){
                var oneDay = 24*60*60*1000;
                var new_data = [];
                if(delta>0 && domain[0]/2<=old_domain) {
                    domain[0] = domain[0] + oneDay;
                    domain[1] = domain[1] - oneDay;
                } if(delta<0 && domain[0]>=old_domain) {
                    domain[0] = domain[0] - oneDay;
                    domain[1] = domain[1] + oneDay;
                }
                 x = d3
                    .scaleTime()
                    .range([0, width])
                    .domain(domain)
                 xAxis = d3
                    .axisBottom()
                    .scale(x)
                    .ticks(5);

                data.forEach(function(value,index){
                    if(domain[0] <= value.date && domain[1] >= value.date) {
                        new_data.push(value);
                    }
                });

                svg.select('path').attr("d", area(new_data));
                svg.select('.x.axis').call(xAxis);
                return domain;
            }
            var domain = d3.extent(data, function(d) { return d.date; });
            d3.select('svg').on("mousewheel", function(event) {
                console.log(event)
                var old_domain = domain[0];
                /*showOnly(data, event.deltaY, domain , old_domain)*/
            });

            d3.select('svg').on("drag", function( event ) {
                    console.log(event);
            });

        });
    }
}

angular
    .module(NAME, [
        menuComponemt
    ])
    .component(NAME, {
        template: Template,
        controller: 'statsCtrl as vm',
        bindToController: true
    })
    .controller('statsCtrl', statsCtrl)
    .config(($stateProvider, MenuProvider) => {
        $stateProvider
            .state(
                NAME,
                {
                    url: '',
                    template: `<${NAME}></${NAME}>`
                }
            );

        MenuProvider
            .registerMenu(NAME,
                {
                    label: 'Stats',
                    sref: NAME
                }
            )
        ;
    }
)
;

export default NAME;