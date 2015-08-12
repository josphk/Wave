$(document).on('ready page:load', function() {
  $('.friend-status').hover( function() {
    $('.options').removeClass('hidden')
  }, function() {
    $('.options').addClass('hidden')
  })

  $('.update-photo').on('click', function() {
    $('#user_avatar').click()
  })

  $('#user_avatar').change(function() {
    $('#edit-avatar').submit()
  })
})

$(document).on('ready', function() {
  var firebase = new Firebase('https://wave-motion-dev.firebaseio.com/wave_trackers');

  firebase.on("child_added", function(snapshot) {
    for (var i = 0; i < currentUser.trackers.length; i++) {
      if (snapshot.val().coreid === currentUser.trackers[i]) alert('found it!')
    }
  });
})