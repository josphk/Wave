$(document).on('ready', function() {
  if (loggedIn) {
    var firebase = new Firebase(firebaseUrl)

    firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').on('child_added', function(added) {
      added.ref().once('value', function(req) {
        req.forEach(function(r) {
          if (!r.val().checked) {
            $.ajax({
              url: `users/${ currentUser.id }/notify`,
              method: 'get',
              dataType: 'script',
              success: function() {
                $('.notifications.friends p').addClass('notified')
              }
            })
          }
        })
      })
    })

    firebase.child('notifications').child(currentUser.id).child('friend_requests').on('child_removed', function(added) {
      $('.notifications.friends p').removeClass('notified')
    })
  }
})