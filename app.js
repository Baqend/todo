//Let's connect to our Baqend
DB.connect("http://tutorial.baqend.com");

//The TodoService handles access to persistent Todo items
var TodoService = (function() {
  return {
    //load all Todos ordered by completion and name
    all: function(listId) {
      return DB.Todo.find()
        .equal("listId", listId)
        .ascending("done")
        .ascending("name")
        .resultList();
    },
    //load unfinished Todos
    unfinished: function(listId) {
      return DB.Todo.find()
        .equal("listId", listId)
        .notEqual("done", true)
        .resultList();
    },
    //load finished Todos
    done: function(listId) {
      return DB.Todo.find()
        .equal("listId", listId)
        .equal("done", true)
        .resultList();
    },
    //delete a Todo
    delete: function(todo) {
      todo.delete();
    },
    //save a Todo
    save: function(todo) {
      todo.save();
    }
  }
})();

//The controller does event handling and rendering, passing todos between view and service
var TodoController = (function() {
  var state = {}, template, listId;

  //Updates the list of loaded Todos
  var updateState = function(toSave) {
    state.todos = {};
    toSave.forEach(function(todo) {
      state.todos[todo.id] = todo;
    });
  };
  //Repaints the TodoList
  var render = function() {
    var open = $('.in').attr('id');
    $('#todos').html(template(state));
    $('#' + open).addClass('in');
  };


  var ctrl = {
    //Shows all Todos
    showAll: function() {
      state.isUnfinished = false;
      TodoService.all(listId).then(updateState).then(render);
    },
    //Shows unfinished Todos
    showUnfinished: function() {
      state.isUnfinished = true;
      TodoService.unfinished(listId).then(updateState).then(render);
    },
    //Shows completed Todos
    showDone: function() {
      state.isUnfinished = false;
      TodoService.done(listId).then(updateState).then(render);
    },
    //Deletes a Todo by id
    delete: function(id) {
      TodoService.delete(state.todos[id]);
      delete state.todos[id];
      render();
    },
    //Marks a Todo as done
    done: function(id) {
      state.todos[id].done = true;
      TodoService.save(state.todos[id]);
      if (state.isUnfinished)
        delete state.todos[id];
      render();
    },
    //Adds a new Todo by name
    add: function(name) {
      var todo = new DB.Todo({
        activities: new DB.List(),
        name: name,
        listId : listId
      });
      TodoService.save(todo);
      state.todos[todo.id] = todo;
      render();
    },
    addTransient: function(name) {
      var todo = new DB.Todo({
        activities: new DB.List(),
        name: name,
        listId : listId
      });
      DB.attach(todo);
      state.todos[todo.id] = todo;
      render();
    },
    //Starts or stops work on a Todo
    toggleWork: function(id) {
      var todo = state.todos[id];
      todo.active = !todo.active;
      if (todo.active) {
        todo.activities.unshift(new DB.Activity({
          start: new Date()
        }));
       } else {
        todo.activities.get(0).end = new Date();
      }
      TodoService.save(todo);
      render();
    },
    //Sets up the template and renders
    onReady: function() {
      var hash = window.location.hash;
      if(hash != '' && hash != '#') {
        listId = hash;
      } else if(localStorage["listId"]) {
        listId = localStorage["listId"];
      } else {
        listId = DB.util.uuid();
        localStorage["listId"] = listId;
      }
      window.location.hash = listId;
      $(window).on('hashchange', ctrl.onReady);
      $("#shareURL").val(window.location);
      var source = $('#todo-template').html();
      template = Handlebars.compile(source);
      ctrl.showUnfinished();
    }
  };

  return ctrl;
})();

//When the DB is ready let the controller render
DB.ready(TodoController.onReady);

//Boilerplate helper code for date formatting
Handlebars.registerHelper('pretty', function(date) {
  return date == null ? "" : date.toLocaleString();
});
Handlebars.registerHelper('diff', function(from, to) {
  return (from == null || to == null) ? "" : Math.round((to - from) / 1000) + " s";
});
//Fixes an iOS bug that causes click delay 
FastClick.attach(document.body);