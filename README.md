Baqend ToDo-App
============

![Baqend.com](http://www.baqend.com/guide/img/baqend_logo.svg)

Visit our website [www.baqend.com](http://www.baqend.com)

Read the [Baqend Guide](http://www.baqend.com/guide/) online

Do you have questions, a future request or did you find a bug? Open a [ticket](https://github.com/Baqend/todo/issues). 

Installation
-------

    npm install -g grunt-cli
    git clone https://github.com/Baqend/todo.git .
    npm install
    grunt
    
Setup with your own Baqend instance
-------

1. Open the Baqend Dashboard.
2. On the left side navigate to the *API Explorer* 
3. Expand the *POST /schema* tab under the *schema* category
4. Paste the content of the [schema.json](schema.json) in to the *body* field and submit the form.
5. Change the connect call in the [app.js](app.js) to `DB.connect(<your app name>)`

License
-------

This Baqend Todo-App is published under the very permissive [MIT license](LICENSE.md)
