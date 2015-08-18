function checkStatus(id, accessToken, wave, multiWave) {
  var url = 'https://api.spark.io/v1/devices/' + id + '?access_token=' + accessToken

  $.ajax({
    type: 'GET',
    url: url,
    beforeSend: function() {
      $('.modal-inner').append('<div class="loading"></div>')
    },
    success: function(data) {
      $('.modal-inner .loading').remove()
      if (data.connected) {
        if (wave) initWave()
        else initTest()
      }
      else trackerAsleep()
    },
    error: function() {
      $('.modal-inner .loading').remove()
      trackerAsleep()
    },
    dataType: 'json'
  })
}

function trackerAsleep() {
  trackerOffline = true

  pulse(width / 2, height / 2, 40, 50, 150, 5000, true, '#f5f5f5', '#f5f5f5')
  var status = canvas.append('text')
  .text('Your Wave Motion seems to be asleep')
        .attr('class', 'canvas-text asleep')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '7')
        .style('text-anchor', 'middle')
}

function submitResults(timeData, accuracyData) {
  function average(dataArray) {
    var sum = dataArray.reduce(function(a, b) { return a + b })
    return sum / dataArray.length
  }

  var averageTime = Math.round(average(timeData) / 10) / 100,
      averageAccuracy = Math.round(average(accuracyData) * 10000) / 100

  $.ajax({
    type: 'POST',
    url: '/users/' + currentUser.id + '/stats',
    dataType: 'script',
    data: { average_time: averageTime, accuracy: averageAccuracy, user_id: currentUser.id },
    beforeSend: function() {
      $('.modal-inner').append('<div class="loading"></div>')
    },
    success: function(data) {
      $('.modal-inner .loading').remove()
      results(averageTime, averageAccuracy)
    },
    error: function() {
      $('.modal-inner .loading').remove()
      var status = canvas.append('text')
        .text('Something went wrong')
        .attr('class', 'canvas-text asleep')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '7')
        .style('text-anchor', 'middle')
    }
  })
}

function initWave() {
  var counter = 0,
      t1, t2,
      coordinates,
      timeData = [],
      accuracyData = []
      trackerOffline = false
  var eventSource = new EventSource(`https://api.particle.io/v1/devices/${ currentUser.onlineTracker }/events/?access_token=${ currentUser.token }`)

  clear()
  start('#b6f5cb', '#befed2')

  var waveTracker = function(e) {
    var rawData = JSON.parse(e.data),
        parsedData = JSON.parse(rawData.data),
        x = width * parsedData.X / 1000,
        y = height * parsedData.Y / 800,
        r = parsedData.Size * 7
    var minDistance = r + coordinates.r,
        newDistance = distance(x, y, coordinates.x, coordinates.y)

    if (pointer === undefined) pointer = makeCircle(x, y, r, '#ddd')
    pointer.transition().duration(500).attr('cx', x).attr('cy', y).attr('r', r).ease('cubic-in')

    setTimeout(function() {
      if (newDistance < minDistance) {
        t2 = performance.now()
        timeData.push(timer(t1, t2))
        accuracyData.push(accuracy(newDistance, minDistance))
        pointer = undefined
        clear()
        test(5)
      }
    }, 500)
  }

  // $('.canvas').on('click', function(e) {
  //   var x = e.pageX - $('.canvas').offset().left,
  //       y = e.pageY - $('.canvas').offset().top,
  //       r = 10
  //   var minDistance = r + coordinates.r,
  //       newDistance = distance(x, y, coordinates.x, coordinates.y)

  //   if (newDistance < minDistance) {
  //     // eventSource.close()
  //     t2 = performance.now()
  //     timeData.push(timer(t1, t2))
  //     accuracyData.push(accuracy(newDistance, minDistance))
  //     clear()
  //     test(5)
  //   }
  // })

  function test(iterations) {
    var waveColor = ['#f58d9a', '#88eef3', '#f3ec95', '#f2a9f5', '#befed2']
    var circleColor = ['#dc7d88', '#7edbdf', '#f1ea93', '#e797e9', '#b6f5cb' ]
    if (counter == iterations) {
      eventSource.close()
      submitResults(timeData, accuracyData)
      return
    } else {
      t1 = performance.now()
      coordinates = generateTarget(width, height, circleColor[counter % 5], waveColor[counter % 5])
      eventSource.addEventListener('Coordinates', waveTracker, false)
      counter++
    }
  }
  $('.wave-test-start, .canvas-text').one('click', function() {
    clear()
    pulse(width / 2, height / 2, 75, 300, 700, 2500, false, '#b6f5cb', '#befed2')
    setTimeout(function() { test(5) }, 2000)
  })

  $(".modal-fade-screen, .modal-close").on("click", function() {
    if (!$('#modal-1').checked) eventSource.close()
    pointer = undefined
  });

  $(window).on('page:before-change', function() { eventSource.close() })
}

function initTest() {
  trackerOffline = false
  var eventSource = new EventSource(`https://api.particle.io/v1/devices/${ gon.id }/events/?access_token=${ gon.token }`)
  clear()
  start('#b6f5cb', '#befed2')

  var waveTracker = function(e) {
    var rawData = JSON.parse(e.data),
        parsedData = JSON.parse(rawData.data),
        x = width * parsedData.X / 1000,
        y = height * parsedData.Y / 800,
        r = parsedData.Size * 7

    if (pointer === undefined) pointer = makeCircle(x, y, r, '#ddd')
    pointer.transition().duration(500).attr('cx', x).attr('cy', y).attr('r', r).ease('cubic-in')
  }

  $('.wave-test-start, .start').one('click', function() {
    clear()
    pulse(width / 2, height / 2, 75, 300, 700, 2500, false, '#b6f5cb', '#befed2')
    eventSource.addEventListener('Coordinates', waveTracker, false)
  })

  $(".modal-fade-screen, .modal-close").on("click", function() {
    if (!$('#modal-1').checked) eventSource.close()
    $('.modal-content').empty()
    pointer = undefined
  });

  $(window).on('page:before-change', function() { eventSource.close() })
}