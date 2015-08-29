// $(document).ready(function() {
//   var menuToggle = $('#js-mobile-menu').unbind();
//   $('#js-navigation-menu').removeClass("show");

//   menuToggle.on('click', function(e) {
//     e.preventDefault();
//     $('#js-navigation-menu').slideToggle(function(){
//       if($('#js-navigation-menu').is(':hidden')) {
//         $('#js-navigation-menu').removeAttr('style');
//       }
//     });
//   });
// });


$(document).on('ready page:load', function() {
  var firebase = new Firebase(firebaseUrl)

  $('#avatar').on('click', function(e) {
    e.preventDefault()
    $('.user.submenu').toggleClass('hidden')
  })

  $('#notify-friend').on('click', function(e) {
    e.preventDefault();
    $('.friend-requests.submenu').toggleClass('hidden')

    if ($('#notify-friend').hasClass('notified')) {
      if (!$('.friend-requests.submenu').hasClass('hidden')) {
        var allRequests = firebase.child('users').child(currentUser.id).child('notifications').child('friend_requests').once('value', function(snapshot) {
          snapshot.forEach(function(req){
            req.ref().update({ 'checked': true })
          })
        })
        $('#notify-friend').removeClass('notified')
      }
    }
  })

  $('.notifications.sessions').on('click', function(e) {
    e.preventDefault()
    $('.wave-sessions.submenu').toggleClass('hidden')

    if ($('#notify-session').hasClass('notified')) {
      if (!$('.wave-sessions.submenu').hasClass('hidden')) {
        var allRequests = firebase.child('users').child(currentUser.id).child('notifications').child('wave_sessions').once('value', function(snapshot) {
          snapshot.forEach(function(req){
            req.ref().update({ 'checked': true })
          })
        })
        $('#notify-session').removeClass('notified')
      }
    }
  })

  $('.open-modal').unbind('ajax:success').on('ajax:success', function(e, d, s, x) {
    console.log('test')
    $('#wave-modal').prop('checked', true)
    $("body").addClass("modal-open");
    $('.modal-content').html(d)
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $('#wave-modal').prop("checked", false).change()
    $("body").removeClass("modal-open")
    $('.modal-content').empty()
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation()
  });
})




