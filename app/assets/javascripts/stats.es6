function generateChart(w, h, t, r, b, l) {
  var startDay = -1, index = data.length - 1
  var margin = {top: 30, right: 20, bottom: 50, left: 50},
      w = 700 - margin.left - margin.right,
      h = 250 - margin.bottom - margin.top

  var graph = d3.select('.graph')
              .attr('width', w + margin.left + margin.right)
              .attr('h', h + margin.left + margin.right)

  var svg = graph.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.append("defs").append("clipPath")
     .attr("id", "clip")
     .append('rect').attr('width', w + margin.left).attr('height', h)

  var x = d3.time.scale()
      .domain([d3.time.day.offset(new Date, startDay), d3.time.day.offset(new Date, startDay + 2)])
      .nice(d3.time.day)
      .range([margin.left, w]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return Math.round(d.time/5) * 5 })])
      .range([h, 0]);

  var xAxis = d3.svg.axis().scale(x).ticks(d3.time.day, 1).tickFormat(d3.time.format('%b %d')).orient('bottom')
  var yAxis = d3.svg.axis().scale(y).ticks(5).orient('left')

  var line = d3.svg.line()
      .interpolate('linear')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.time); });

  svg.append("g")
      .attr("class", "x axis")
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
      .append("text")
      .attr('class', 'x-label')
      .attr("x", (w + margin.left)/2)
      .attr("y", margin.top)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Date");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr('class', 'y-label')
      .attr("transform", "rotate(-90)")
      .attr("x", -h/2)
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Average Time (s)");
  d3.selectAll('.y.axis .tick').select('line').attr('x2', w + margin.left)

  var path = svg.append("g")
      .append("path")
      .attr("clip-path", "url(#clip)")
      .datum(data)
      .attr("class", "line")
      .attr('stroke', '#b6f5cb')
      .attr("d", line)

  var focus = svg.append('g').append('circle').attr('class', 'focus')
                 .attr('r', 3).attr('fill', '#8ed89c')
                 .attr('transform', 'translate(' + x(data[data.length - 1].date) + ',' + y(data[data.length - 1].time) +')')

  var mouseBoundary = svg.append('rect')
                         .attr('width', w)
                         .attr('height', h)
                         .style('fill', 'none')
                         .style('pointer-events', 'all')
                         .on('mousemove', mousemove)
                         .on('click', update)

  var bisectDate = d3.bisector(function(d) { return d.date }).left

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
    i = bisectDate(data, x0, 1),
    d0 = data[i - 1],
    d1 = data[i],
    d = x0 - d0.date > d1.date - x0 ? d1 : d0
    index = data.indexOf(d)

    focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.time) + ')')
  }

  function update() {
    if (data == data1) {
      data = data2
      updateData(true, false)
    } else {
      data = data1; updateData(true, true)
    }
  }

  function updateData(changed, time) {
    var svg = d3.select("body").transition()

    function updateAttributes(yScaleRoundUp, focusColor, lineColor, axisLabel) {
      y.domain([0, d3.max(data, function(d) { return Math.round(d.time/yScaleRoundUp) * yScaleRoundUp })])
      focus.attr('fill', focusColor)
      svg.select('.line').attr('stroke', lineColor)
      svg.select('.y-label').text(axisLabel);
    }
    if (changed) {
      if (time) {
        updateAttributes(5, '#8ed89c', '#b6f5cb', 'Average Time (s)')
      } else {
        updateAttributes(0.5, '#e57473', '#f58d9a', 'Accuracy (%)')
      }
      var d = data[index]
      focus.transition().duration(500).attr('transform', 'translate(' + x(d.date) + ',' + y(d.time) + ')').ease('elastic', 2, 3.5)
    }

    x.domain([d3.time.day.offset(new Date, startDay), d3.time.day.offset(new Date, startDay + 2)]).nice(d3.time.day)

    svg.select('.x.axis')
        .duration(750)
        .call(xAxis);
    svg.select('.y.axis')
        .duration(750)
        .call(yAxis);
    svg.select('.line')
       .duration(750)
       .attr('d', line(data))
    svg.selectAll('.y.axis .tick').select('line').duration(750).attr('x2', w + margin.left)
  }

  $(document).keydown(function(e) {
    var d = data[index]
    if (e.which === 37) {
      e.preventDefault()
      if (index - 1 >= 0)
        index--; d = data[index]
        if(x(d.date) < margin.left) {
          startDay--
          updateData(false)
        }
    } else if (e.which === 39) {
      e.preventDefault()
      if (index + 1 < data.length)
        index++; d = data[index]
        if (x(d.date) > w) {
          startDay++
          updateData(false)
        }
    } else if (e.which === 38) {
      e.preventDefault()
      data = data1; d = data[index]
      updateData(true, true)
    } else if (e.which === 40) {
      data = data2; d = data[index]
      e.preventDefault()
      updateData(true, false)
    }
    focus.transition().duration(500).attr('transform', 'translate(' + x(d.date) + ',' + y(d.time) + ')').ease('elastic', 2, 3.5)
  })
}