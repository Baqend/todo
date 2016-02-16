var abortTyping = false;
$(document).on('click', function() {
  abortTyping = true;
});

function typeAndAdd(text, next) {
  if (abortTyping)
    return;
  $('#typing').typed({
    strings: [text],
    typeSpeed: 0,
    onStringTyped: function() {
      var item = $("#typing").val();
      if (item != "" && !abortTyping) {
        TodoController.addTransient(item);
      }
      $("#addTodo")[0].reset();
      setTimeout(next, 1000);
    }
  });
}

DB.ready(function() {
  setTimeout(function() {
    typeAndAdd("This app is built on Baqend", function() {
      typeAndAdd("Try for yourself", function() {
        typeAndAdd("Using our new Cloud Service");
      });
    });
  }, 1300);
});