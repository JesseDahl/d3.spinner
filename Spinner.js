var Spinner = function(el, cfg) {
    var running = false;
    var vis, arc, arcs, pie, path, text;
    var element = el;
    var deg = 0;
    var PI = 3.14159;
    var config = {
        data: (cfg !== undefined && "data" in cfg) ? cfg["data"] : ["El Tapatio", "Zen", "Thai BBQ", "In n Out"],
        w: (cfg !== undefined && "w" in cfg) ? cfg["w"] : 700,
        h: (cfg !== undefined && "h" in cfg) ? cfg["h"] : 700,
        outerR: (cfg !== undefined && "outerR" in cfg) ? cfg["outerR"] : 280,
        innerR: (cfg !== undefined && "innerR" in cfg) ? cfg["innerR"] : 8,
        color: (cfg !== undefined && "color" in cfg) ? cfg["color"] : d3.scale.category10(),
        minRotation: (cfg !== undefined && "minRotation" in cfg) ? cfg["minRotation"] : 1080,
        maxRotation: (cfg !== undefined && "maxRotation" in cfg) ? cfg["maxRotation"] : 3600
    };
   
    var update = function(newData) {
        spin(360, 0); // reset position of wheel
        config.data = newData;
        draw();
    };
    
    var init = function() {        
        vis = d3.select(element)
                .append("svg:svg") //create the SVG element        
                .attr("width", config.w) //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", config.h)
                .append("svg:g") //make a group to hold our pie chart
                .attr("transform", "translate(" + config.outerR + "," + config.outerR + ")") //move the center of the pie chart from 0, 0 to radius, radius

        arc = d3.svg.arc() //this will create <path> elements for us using arc data
                    .innerRadius(config.innerR)
                    .outerRadius(config.outerR);        

        pie = d3.layout.pie() //this will create arc data for us given a list of values
                       .startAngle(function(d, i) {
                           return deg%360 * (PI/180);                       
                       })
                       .value(function(d) { return  100/config.data.length; });
                  
        draw();
    };

    var draw = function() {
        pie = d3.layout.pie() //this will create arc data for us given a list of values
                       .startAngle(function(d, i) {
                           return deg%360 * (PI/180);                       
                       })
                       .value(function(d) { return  100/config.data.length; });

        arcs = vis.selectAll("g.slice")                         
                  .data(pie(config.data));

        arcs.exit().remove();
        d3.selectAll("path").remove();
        d3.selectAll("text").remove();
        
        arcs.enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("class", "slice") //allow us to style things in the slices (like text)

        arcs.append("svg:path")
            .attr("fill", function(d, i) { return config.color(i); } ) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        
        arcs.append("svg:text") //add a label to each slice
            .attr("transform", function(d) { //set the label's origin to the center of the arc
                d.innerRadius = config.innerR;
                d.outerRadius = config.outerR;
                return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle") //center the text on it's origin
            .text(function(d, i) { return config.data[i]; }) //get the label from our original data array  
    };
    
    var spin = function(degrees, duration) {
        running = !running;
        if (running) { spin(); }

        deg = degrees || Math.floor( (Math.random() * config.maxRotation) + config.minRotation);
        duration = (duration !== undefined) ? duration : (deg*1000)/360;

        vis.selectAll("g.slice").transition()
            .ease("quad-out")
            .duration(duration)
            .attrTween("transform", function() {
                return d3.interpolateString("rotate(0)", "rotate(" + deg + ")");
            });
    }
    
    return { init: init,
             update: update,
             spin: spin };
};