$(document).on('ready page:load', function() {
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
      $('.logo').addClass('wave')
      $('.tracker-status > p').html(status)

      if (status === 'Awake') {
        $('.indicator').removeClass('asleep').addClass('awake')
      } else {
        $('.indicator').removeClass('awake').addClass('asleep')
      }
    }

    firebase.child('wave_motions').on('child_added', function(added) {
      refreshDatabase(added)
      if (notifyTrackerStatus(currentUser.trackers, added)) {
        notifyAnimation('Awake')
        currentUser.onlineTracker = added.val().coreid
        if (multiUserWave) {
          waverReady()
        } else {
          if (motion) {
            if (wave) initWave()
            else initTest()
          }
        }
      }
    });

    firebase.child('wave_motions').on('child_removed', function(removed) {
      if (notifyTrackerStatus(currentUser.trackers, removed)) {
        notifyAnimation('Asleep')
        currentUser.onlineTracker = undefined
        if (motion) trackerAsleep()
      }
    })
  }
})