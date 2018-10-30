//The TodoService handles access to persistent Todo items
class TodoService {
  //load all Todos ordered by completion and name
  static all(listId) {
    return DB.Todo.find()
      .where({"listId": listId})
      .ascending("done")
      .ascending("name")
      .resultList();
  }

  //load unfinished Todos
  static unfinished(listId) {
    return DB.Todo.find()
      .where({
        "$and": [{"listId": listId}]
      })
      .resultList()
      .then(todos => {
        return todos.filter(todo => !todo.done)
      });
  }

  //load finished Todos
  static done(listId) {
    return DB.Todo.find()
      .where({
        "$and": [{"listId": listId}]
      })
      .resultList()
      .then(todos => {
        return todos.filter(todo => todo.done)
      });
  }

  //delete a Todo
  static delete(todo) {
    return todo.delete();
  }

  //save a Todo
  static save(todo) {
    return todo.save({depth: true});
  }
}

//The controller does event handling and rendering, passing todos between view and service
class TodoCtrl {
  constructor() {
    this.todos = {};
    this.isUnfinished = false;
    this.template = null;
    this.listId = null;
  }

  //Updates the list of loaded Todos
  updateLocal(toSave) {
    this.todos = {};
    toSave.forEach((todo) => this.todos[todo.id] = todo);
    this.render();
  }

  //Shows all Todos
  showAll() {
    this.isUnfinished = false;
    TodoService.all(this.listId).then((todos) => this.updateLocal(todos));
  }

  //Shows unfinished Todos
  showUnfinished() {
    this.isUnfinished = true;
    TodoService.unfinished(this.listId).then((todos) => this.updateLocal(todos));
  }

  //Shows completed Todos
  showDone() {
    this.isUnfinished = false;
    TodoService.done(this.listId).then((todos) => this.updateLocal(todos));
  }

  //Deletes a Todo by id
  delete(id) {
    TodoService.delete(this.todos[id]).then((todo) => {
      delete this.todos[id];
      this.render();
    });
  }

  //Marks a Todo as done
  done(id) {
    this.todos[id].done = true;
    TodoService.save(this.todos[id]).then((todo) => {
      if (this.isUnfinished)
        delete this.todos[todo.id];
      this.render();
    });
  }

  //Adds a new Todo by name
  add(name) {
    const todo = new DB.Todo({
      activities: new DB.List(),
      name: name,
      listId: this.listId
    });

    TodoService.save(todo).then((todo) => {
      this.todos[todo.id] = todo;
      console.log(this.todos);
      this.render();
    });
  }

  //Starts or stops work on a Todo
  toggleWork(id) {
    let todo = this.todos[id];
    todo.active = !todo.active;
    if (todo.active) {
      todo.activities.unshift(new DB.Activity({
        start: new Date()
      }));
    } else {
      todo.activities[0].end = new Date();
    }
    TodoService.save(todo).then(todo => {
      this.render();
    });
  }

  //Repaints the TodoList
  render() {
    var open = $('.in').attr('id');
    $('#todos').html(this.template({
      todos: this.todos,
      isUnfinished: this.isUnfinished
    }));
    $('#' + open).addClass('in');
  }

  //Sets up the template
  onReady() {
    var hash = location.hash;
    if (hash !== '' && hash !== '#') {
      hash = hash.substring(1);
      if (hash === this.listId)
        return;
      this.listId = hash;
    } else if (localStorage["listId"]) {
      this.listId = localStorage["listId"];
    } else {
      this.listId = DB.util.uuid();
      localStorage["listId"] = this.listId;
    }

    //replace the location, so the back button works properly
    location.replace('#' + this.listId);

    //Ignore the first hash change
    setTimeout(() => $(window).on('hashchange', () => this.onReady()));
    $("#shareURL").val(location);
    var source = $('#todo-template').html();
    this.template = Handlebars.compile(source);
    this.showUnfinished();
  }
}

var TodoController = new TodoCtrl({}, false, null, null);

//Change "toodle" to your own app name here!
DB.connect("http://localhost:8080/v1").then(() => TodoController.onReady());

//Boilerplate helper code for date formatting
Handlebars.registerHelper('pretty', function (date) {
  return date == null ? "" : date.toLocaleString();
});
Handlebars.registerHelper('diff', function (from, to) {
  return (from == null || to == null) ? "" : Math.round((to - from) / 1000) + " s";
});
Handlebars.registerHelper('sum', function (activities) {
  if (activities == null || activities.length === 0) {
    return "";
  } else {
    var sum = Math.round(activities
      .map((a) => a.end ? (a.end - a.start) : 0)
      .reduce((a, b) => a + b, 0) / 1000);
    return sum !== 0 ? sum + " s" : "";
  }
});
//Fixes an iOS bug that causes click delay
FastClick.attach(document.body);
