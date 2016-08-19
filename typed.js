var transient = [];
TodoController.addTransient = function(name) {
  var todo = new DB.Todo({
    activities: new DB.List(),
    listId: TodoController.listId,
    name: name
  });
  DB.attach(todo);
  TodoController.todos[todo.id] = todo;
  transient.push(todo);
  TodoController.render();
};

Array.prototype.removeIf = function(callback) {
  var i = this.length;
  while (i--) {
    if (callback(this[i], i)) {
      this.splice(i, 1);
    }
  }
};
function cleanTransient() {
  transient.removeIf(function(todo) {
    return todo.version != null;
  });
}

TodoController.showAll = function()  {
  cleanTransient();
  TodoController.isUnfinished = false;
  TodoService.all(TodoController.listId).then(function(todos){
    transient.forEach(function(todo) {
      todos.push(todo);
    });
    TodoController.updateLocal(todos);
  });
};

TodoController.showUnfinished = function() {
  cleanTransient();
  TodoController.isUnfinished = true;
  TodoService.unfinished(TodoController.listId).then(function(todos){
    transient.forEach(function(todo) {
      if(!todo.done)
        todos.push(todo);
    });
    TodoController.updateLocal(todos);
  });
};

TodoController.showDone = function() {
  cleanTransient();
  TodoController.isUnfinished = false;
  TodoService.done(TodoController.listId).then(function(todos){
    transient.forEach(function(todo) {
      if(todo.done)
        todos.push(todo);
    });
    TodoController.updateLocal(todos)
  });
};

var del = TodoController.delete;
TodoController.delete = function(id) {
  cleanTransient();
  del.call(TodoController, id);
};



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
    typeAndAdd("This app runs on Baqend", function() {
      typeAndAdd("Learn how to build it in the tutorial");
    });
  }, 1300);
});