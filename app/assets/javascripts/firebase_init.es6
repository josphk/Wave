$(document).on('ready', function() {
  if (loggedIn) {
    var firebase = new Firebase(firebaseUrl)

    function logoutTrackers(tracker) {
      spark.getDevice(tracker.val().coreid, function(err, device) {
        if (!device.connected) tracker.ref().remove()
      })
    }

    function refreshDatabase(loggedInTracker) {
      firebase.child('wave_trackers').once('value', function(all) {
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

    firebase.child('wave_trackers').on('child_added', function(added) {
      refreshDatabase(added)
      if (notifyTrackerStatus(currentUser.trackers, added)) {
        alert('Tracker is online')
        currentUser.onlineTracker = added.val().coreid
      }
    });

    firebase.child('wave_trackers').on('child_removed', function(removed) {
      if (notifyTrackerStatus(currentUser.trackers, removed)) {
        alert('Tracker is offline')
        currentUser.onlineTracker = undefined
      }
    })
  }
})