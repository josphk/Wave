$(document).on('ready page:load', function() {
  $('#avatar').on('click', function(e) {
    e.preventDefault();

    $('.user-links').toggleClass('hidden');
  })

  $('.modal a[data-type=html]').on('ajax:success', function(e, d, s, x) {
    $('#modal-1').prop('checked', true)

    if ($('#modal-1').is(":checked")) {
      $("body").addClass("modal-open");
    } else {
      $("body").removeClass("modal-open");
    }

    $('.modal-content').html(d)
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation();
  });
})


