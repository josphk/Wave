function makeCircle(cx, cy, r, color) {
  canvas.attr('viewBox', '0 0 ' + width + ' ' + height)
  var circle = canvas.append('circle')

  circle.attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .attr('fill', color)
  return circle
}

function generateArc(innerR, outerR, startA, x, y, fill) {
  function arcTween(transition, newAngle) {
    transition.attrTween('d', function(d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle)
      return function(t) {
        d.endAngle = interpolate(t)
        return arc(d)
      }
    })
  }
  var arc = d3.svg.arc().innerRadius(innerR).outerRadius(outerR).startAngle(startA)
  var g = canvas.append('g').attr('transform', 'translate(' + x + ',' + y + ')')
  var p = g.append('path').datum({endAngle: 0}).attr('d', arc).attr('fill', fill)
  p.attr('opacity', 0).transition().duration(2500).ease('cubic-out').attr('opacity', 1).call(arcTween, Math.PI * 2)
  return g
}

function pulse(x, y, initSize, circleMax, waveMax, waveSpeed, infinite, circleColor, waveColor, circleClass) {
  var wave = makeCircle(x, y, 0, waveColor)
  var circle = makeCircle(x, y, 50, circleColor)
      circle.attr('class', circleClass)

  function wavePulse() {
    wave.attr('r', initSize)
        .attr('opacity', 0.7)
        .transition().duration(waveSpeed).ease('cubic-out')
        .attr('r', waveMax)
        .attr('opacity', 0)
  }

  function circlePulse() {
    if (infinite) {
      circle.attr('r', initSize)
            .attr('fill', circleColor)
            .transition().duration(2000).ease('cubic-out').each(wavePulse)
            .attr('r', circleMax)
            .attr('fill', waveColor)
            .transition().duration(3000).ease('cubic-in')
            .attr('r', initSize)
            .attr('fill', circleColor)
            .each('end', circlePulse)
    } else {
      circle.attr('r', initSize)
            .attr('fill', circleColor)
            .attr('opacity', 1)
            .transition().duration(2000).ease('cubic-out').each(wavePulse)
            .attr('r', circleMax)
            .attr('fill', waveColor)
            .attr('opacity', 0)
    }
  }
  circlePulse()
}

function generateTarget(width, height, waveColor, circleColor) {
  var s = (Math.random() * 75) + 25,
      r = s + 25,
      x = Math.random() * (width - (2 * r)) + r,
      y = Math.random() * (height - (2 * r)) + r
  pulse(x, y, s, r, 300, 3000, true, waveColor, circleColor)

  var coordinates = new Object()
  coordinates['x'] = x; coordinates['y'] = y; coordinates['r'] = r
  return coordinates
}

function start(buttonColor, waveColor) {
  pulse(width / 2, height / 2, 75, 85, 700, 5000, true, buttonColor, waveColor, 'wave-test-start')
  var text =  canvas.append('text').text('Start')
             .attr('class', 'canvas-text start')
             .attr('x', width / 2)
             .attr('y', (height / 2) + 10)
             .style('text-anchor', 'middle')
}

function results(timeD, accuracyD) {
  var time = generateArc(40, 50, 0, width / 3, height / 3, '#b6f5cb')
  var accuracy = generateArc(40, 50, 0, width / 3, height / 3 * 2, '#f58d9a')
  time.append('text').text('Average Time: ' + timeD + 's').attr('class', 'canvas-text').attr('dy', '11').attr('dx', '100')
  accuracy.append('text').text('Accuracy: ' + accuracyD + '%').attr('class', 'canvas-text').attr('dy', '11').attr('dx', '100')
}

function clear() {
  canvas.selectAll('*').remove()
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function timer(t1, t2) {
  return t2 - t1
}

function accuracy(d1, d2) {
  d2 *= 2
  return (d2 - d1) / d2
}

// function materialBorder() {
//   var defs = canvas.append('defs')
//   var filter = defs.append('filter')
//                    .attr('id', 'material')
//                    .attr('height', '150%')

//   filter.append('feGaussianBlur')
//         .attr('in', 'SourceGraphic')
//         .attr('stdDeviation', 1)
//         .attr('result', 'blur')

//   filter.append('feOffset')
//         .attr('in', 'blur')
//         .attr('dx', 1)
//         .attr('dy', 1)
//         .attr('result', 'offsetBlur')

//   filter.append('feColorMatrix')
//         .attr('in', 'offsetBlur')
//         .attr('type', 'matrix')
//         .attr('values', '0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0')
//         .attr('result', 'offsetBlurColor')

//   var feMerge = filter.append('feMerge')

//   feMerge.append('feMergeNode')
//          .attr('in', 'offsetBlurColor')
//   feMerge.append('feMergeNode')
//          .attr('in', 'SourceGraphic')
// }




