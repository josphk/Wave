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