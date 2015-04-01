var abortTyping = false;
$(document).on('click', function() {
  abortTyping = true;
});

function typeAndAdd(text, next) {
  if (abortTyping)
    return;
  $('#typing').typed({
    strings: [text],
    typeSpeed: 100,
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
    typeAndAdd("Learn Baqend", function() {
      typeAndAdd("Take the tutorial", function() {
        typeAndAdd("Build a lightning-fast app");
      });
    });
  }, 1500);
});