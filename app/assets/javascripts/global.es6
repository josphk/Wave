$(document).on('ready page:load', function() {
  var firebase = new Firebase(firebaseUrl)

  $('#avatar').on('click', function(e) {
    e.preventDefault()
    $('.user-links').toggleClass('hidden')
  })

  $('.notifications.friends').on('click', function(e) {
    e.preventDefault();
    $('.friend-requests').toggleClass('hidden')

    if ($('.notifications.friends p').hasClass('notified')) {
      if (!$('.friend-requests').hasClass('hidden')) {
        var allRequests = firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').once('value', function(snapshot) {
          snapshot.forEach(function(req){
            req.ref().update({ 'checked': true })
          })
        })
        $('.notifications.friends p').removeClass('notified')
      }
    }
  })

  $('.notifications.messages').on('click', function(e) {
    e.preventDefault()
    $('.conversations').toggleClass('hidden')
  })

  $('.modal a[data-type=html]').on('ajax:success', function(e, d, s, x) {
    $('#modal-1').prop('checked', true)

    // if ($('#modal-1').is(":checked")) {
    //   $("body").addClass("modal-open");
    // } else {
    //   $("body").removeClass("modal-open");
    // }

    $('.modal-content').html(d)
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $(".modal-state:checked").prop("checked", false).change()
    $("body").removeClass("modal-open")
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation()
  });
})




