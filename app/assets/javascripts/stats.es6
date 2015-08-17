function getData(userPath) {
  $.ajax({
    url: `http://localhost:3000/${ userPath }/stats`,
    type: 'get',
    dataType: 'json',
    success: function(response) {
      $('.graph-container').append('<svg class="graph"></svg>')
      var timeData = response.average_time
      timeData.forEach(function(d) {
        d.date = new Date(d.date * 1000)
        d.value = d.value
      })

      var accuracyData = response.accuracy
      accuracyData.forEach(function(d) {
        d.date = new Date(d.date * 1000)
        d.value = d.value
      })

      generateChart(700, 250, 30, 20, 50, 50, timeData, accuracyData)
    },
    error: function() {
      $('.graph-container').append('<p>Oh no! Something went wrong.</p>')
    }
  });
}


function generateChart(width, height, t, r, b, l, timeD, accuracyD) {
  var data = timeD,
      startDay = -1
  var margin = {top: t, right: r, bottom: b, left: l},
      w = width - margin.left - margin.right,
      h = height - margin.bottom - margin.top

  var graph = d3.select('.graph')
              .attr('width', w + margin.left + margin.right)
              .attr('height', h + margin.left + margin.right)

  var svg = graph.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.append("defs").append("clipPath")
     .attr("id", "clip")
     .append('rect').attr('width', w + margin.left).attr('height', h)

  var x = d3.time.scale()
      .domain([d3.time.day.offset(new Date, startDay), d3.time.day.offset(new Date, startDay + 2)])
      .nice(d3.time.day)
      .range([margin.left, w]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return Math.round(d.value/3) * 3 })])
      .range([h, 0]);

  var xAxis = d3.svg.axis().scale(x).ticks(d3.time.day, 1).tickFormat(d3.time.format('%b %d')).orient('bottom')
  var yAxis = d3.svg.axis().scale(y).ticks(3).orient('left')

  var line = d3.svg.line()
      .interpolate('linear')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

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
                 .attr('transform', 'translate(' + x(data[data.length - 1].date) + ',' + y(data[data.length - 1].value) +')')
  updateTooltip(250, data[data.length - 1])

  // $('.tooltip').css('left', -330 + x(data[data.length - 1].date) + 'px')

  var mouseBoundary = svg.append('rect')
                         .attr('width', w)
                         .attr('height', h)
                         .style('fill', 'none')
                         .style('pointer-events', 'all')
                         .on('mousemove', mousemove)
                         .on('click', update)

  var bisectDate = d3.bisector(function(d) { return d.date }).left

  function updateTooltip(speed, d) {
    $('.tooltip').animate({left: (x(d.date) - 10) + 'px'}, speed)
    if (data == timeD) {
      $('.tooltip').html(`<p>Date: ${ d.date.toDateString() }</p> <p>Average Time: ${ Math.round(d.value * 100) / 100 } s</p>`)
      $('.tooltip').css('color', '#f4fff5').css('background-color', '#f4fff5')
    } else {
      $('.tooltip').html(`<p>Date: ${ d.date.toDateString() }</p> <p>Accuracy: ${ d.value } %</p>`)
      $('.tooltip').css('color', '#ffeff0').css('background-color', '#ffeff0')
    }
  }

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
    i = bisectDate(data, x0, 1),
    d0 = data[i - 1],
    d1 = data[i],
    d = x0 - d0.date > d1.date - x0 ? d1 : d0
    index = data.indexOf(d)

    focus.transition().duration(500).attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')').ease('elastic', 2, 3.5)
    updateTooltip(15, d)
  }

  function update() {
    if (data == timeD) {
      data = accuracyD; updateData(true, false, data, index)
    } else {
      data = timeD; updateData(true, true, data, index)
    }
  }

  function updateData(changed, time, dat, i) {
    var svg = d3.select("body").transition()

    function updateAttributes(tickCount, focusColor, lineColor, axisLabel) {
      yAxis.ticks(tickCount)
      focus.attr('fill', focusColor)
      svg.select('.line').attr('stroke', lineColor)
      svg.select('.y-label').text(axisLabel);
    }
    if (changed) {
      if (time) {
        y.domain([0, d3.max(dat, function(d) { return Math.round(d.value / 3) * 3 })])
        updateAttributes(3, '#8ed89c', '#b6f5cb', 'Average Time (s)')
      } else {
        y.domain([0, 100])
        updateAttributes(5, '#e57473', '#f58d9a', 'Accuracy (%)')
      }
      var d = dat[i]
      focus.transition().duration(500).attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')').ease('elastic', 2, 3.5)
      updateTooltip(250, d)
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

  var index = data.length - 1

  $(document).unbind('keydown').keydown(function(e) {
    var d
    if (e.which === 37) {
      e.preventDefault()
      if (index - 1 >= 0) {
        d = data[index - 1]
        if(x(d.date) < margin.right) {
          startDay--
          updateData(false, null, data, index - 1)
        }
        index--
      }
    } else if (e.which === 39) {
      e.preventDefault()
      if (index + 1 < data.length) {
        d = data[index + 1]
        if (x(d.date) > w) {
          startDay++
          updateData(false, null, data, index + 1)
        }
        index++
      }
    } else if (e.which === 40) {
      e.preventDefault()
      data = timeD; d = data[index]
      updateData(true, true, data, index)
    } else if (e.which === 38) {
      data = accuracyD; d = data[index]
      e.preventDefault()
      updateData(true, false, data, index)
    }
    focus.transition().duration(500).attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')').ease('elastic', 2, 3.5)
    updateTooltip(250, d)
  })
}