$(document).on('ready', function() {
  if (loggedIn) {
    var firebase = new Firebase(firebaseUrl)

    firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').on('child_added', function(added) {
      if (!added.val().checked) {
        $.ajax({
          url: `/users/${ currentUser.id }/notify`,
          method: 'get',
          dataType: 'script',
          success: function() {
            $('.notifications.friends p').addClass('notified')
          }
        })
      }
    })

    firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').on('child_removed', function(removed) {
      $.ajax({
        url: `/users/${ currentUser.id }/notify`,
        method: 'get',
        dataType: 'script'
      })
    })

    firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').on('child_changed', function(changed) {
      $.ajax({
        url: `/users/${ currentUser.id }/notify`,
        method: 'get',
        dataType: 'script'
      })
    })
  }
})