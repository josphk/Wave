$(document).on('ready page:load', function() {
  $('#avatar').on('click', function(e) {
    e.preventDefault();

    $('.user-links').toggleClass('hidden');
  })
})
