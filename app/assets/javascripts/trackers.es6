$(document).on('ready page:load', function() {
  $(window).resize(resizeCanvas)
  function resizeCanvas() {
    var canvasWidth = $('.canvas').width()
  }

  // SVG Script
  var testCanvas = d3.select('.canvas'),
      canvasWidth = $('.canvas').width(),
      canvasHeight = $('.canvas').height(),
      pointer

  function makePointer(cx, cy, r) {
    var data = [{'x': cx, 'y': cy, 'r': r}]
    var pointer =  testCanvas.selectAll('circle').data(data).enter().append('circle');
    pointer.attr('cx', function(d) { return d.x })
           .attr('cy', function(d) { return d.y })
           .attr('r', function(d) { return d.r })
           .attr('fill', '#202020')
    return pointer
  }

  // Tracker Script
  var testTracker = function(e) {
    var rawData = JSON.parse(e.data)
    var parsedData = JSON.parse(rawData.data)
    $('.x').html(parsedData.X)
    $('.y').html(parsedData.Y)
    $('.size').html(parsedData.Size)
    var x = canvasWidth * parsedData.X / 1000,
        y = canvasHeight * parsedData.Y / 800,
        r = parsedData.Size * 7

    if (pointer === undefined) pointer = makePointer(x, y, r)

    pointer.transition().attr('cx', x).attr('cy', y).attr('r', r).ease('cubic-in')
  }

  var eventSource = new EventSource(`https://api.particle.io/v1/devices/${ gon.test_id }/events/?access_token=${ gon.test_token }`)
  eventSource.addEventListener('Coordinates', testTracker, false)

  $(window).on('page:before-change', function() {
    eventSource.removeEventListener('Coordinates', testTracker, false)
  })
})
