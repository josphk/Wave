$(document).on('ready page:load', function() {
  $('.friend-status').hover( function() {
    $('.options').removeClass('hidden')
  }, function() {
    $('.options').addClass('hidden')
  })
})