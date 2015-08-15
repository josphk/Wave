$(document).on('ready', function() {
  if (loggedIn) {
    var firebase = new Firebase(firebaseUrl)

    function logoutTrackers(tracker) {
      var url = 'https://api.spark.io/v1/devices/' + tracker.val().coreid + '?access_token=' + currentUser.token

      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) { if (!data.connected) tracker.ref().remove() },
        dataType: 'json'
      })
    }

    function refreshDatabase(loggedInTracker) {
      firebase.child('wave_motions').once('value', function(all) {
        all.forEach(function(oldTracker) {
          logoutTrackers(oldTracker)
          if (oldTracker.val().coreid === loggedInTracker.val().coreid && oldTracker.key() !== loggedInTracker.key())
            oldTracker.ref().remove()
        })
      })
    }

    function notifyTrackerStatus(currentUserTrackers, tracker) {
      for (let id of currentUserTrackers) {
        if (tracker.val().coreid === id) return true
      }
    }

    function notifyAnimation(status) {
      $('.tracker-status').html(`<li>Wave Motion is ${ status }</li>`)
      $('.tracker-status').addClass('notify').css('opacity', 1).delay(2000).queue(function() {
        $(this).removeClass('notify').delay(1).queue(function() {
          // $('.logo').removeClass('red')

          $(this).addClass('unnotify').removeClass('notify').delay(2000).queue(function() {
            $(this).removeClass('unnotify').css('opacity', 0).dequeue()
          }).dequeue()
        }).dequeue()
      })
    }

    firebase.child('wave_motions').on('child_added', function(added) {
      refreshDatabase(added)
      if (notifyTrackerStatus(currentUser.trackers, added)) {
        notifyAnimation('online')
        currentUser.onlineTracker = added.val().coreid
        if (svg) init()
      }
    });

    firebase.child('wave_motions').on('child_removed', function(removed) {
      if (notifyTrackerStatus(currentUser.trackers, removed)) {
        notifyAnimation('offline')
        currentUser.onlineTracker = undefined
        if (svg) trackerAsleep()
      }
    })
  }
})