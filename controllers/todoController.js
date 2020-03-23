var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect("mongodb://localhost/todoAppDB", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//Create a schema
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


var data = [{item: 'become a billionaire'}, {item: 'became a billionaire'}, {item: 'enjoy the billionaires life'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = (app) => {

    app.get('/todo', (req, res) => {
        //get data from mongodb and pass it to view
        Todo.find({}, (err, data) => {
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, (req, res) => {
        //get data from the view and add it to mongodb
        var newToDo = Todo(req.body).save((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', (req, res) => {
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });

};

//<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>