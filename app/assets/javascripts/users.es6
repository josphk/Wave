$(document).on('ready page:load', function() {
  $('.friend-status').hover( function() {
    $('.options').removeClass('hidden')
  }, function() {
    $('.options').addClass('hidden')
  })

  $('.update-avatar').on('click', function() {
    $('#user_avatar').click()
  })

  $(document).on('change', '#user_avatar', function() {
    $('#edit-avatar').submit()
  })

  $('.update-cover').on('click', function() {
    $('#user_cover').click()
  })

  $(document).on('change', '#user_cover', function() {
    $('#edit-cover').submit()
  })
})

function coverParallax() {
  var scrollTop = $(document).scrollTop()
  $('.cover').css('top', `${ scrollTop * 0.4 }px`)
}