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

  $('.modal a[data-type=html]').unbind('ajax:success').on('ajax:success', function(e, d, s, x) {
    $('#modal-1').prop('checked', true)
    $("body").addClass("modal-open");

    // if ($('#modal-1').is(":checked")) {
    // } else {
    //   $("body").removeClass("modal-open");
    // }

    $('.modal-content').html(d)
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $('#modal-1').prop("checked", false).change()
    $("body").removeClass("modal-open")
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation()
  });
})

$('.wave-session.modal a[data-type=html]').unbind('ajax:success').on('ajax:success', function(e, d, s, x) {
  $('#modal-session').prop('checked', true)
  $("body").addClass("modal-open");

  $('.session-modal-content').html(d)
});

$(".modal-fade-screen, .modal-close").on("click", function() {
  $('#modal-session').prop("checked", false).change()
  $("body").removeClass("modal-open")
  $('.session-modal-content').empty()
});

$(".modal-inner").on("click", function(e) {
  e.stopPropagation()
});




