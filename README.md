Baqend ToDo-App
============

![Baqend.com](http://www.baqend.com/guide/img/baqend_logo.svg)

Visit our website [www.baqend.com](http://www.baqend.com)

Read the [Baqend Guide](http://www.baqend.com/guide/) online

Do you have questions, a future request or did you find a bug? Open a [ticket](https://github.com/Baqend/todo/issues). 

Installation
-------

    git clone https://github.com/Baqend/todo.git .
    npm install
    npm start
    
Connect to Baqend
-------

To connect to your Baqend app, you run

    npm run login
    
Then, simply follow the instructions on the screen.
    
Setup with your own Baqend instance
-------

1.  Apply the schema of the todo app on your Baqend app instance.
    Therefore, you run 
   
        npm run schema upload <your app name>

2.  Change the connect call in the [app.js line 156](app.js) to `DB.connect(<your app name>)`

Deploy to your own Baqend instance
-------

1.  Build your project

        npm run build
    
2.  Then, deploy the built project code to Baqend using

        npm run deploy <your app name>
    
and all Baqend code and files will be uploaded to Baqend!

License
-------

This Baqend Todo-App is published under the very permissive [MIT license](LICENSE.md)
