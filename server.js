var connect = require('connect'),
    express = require('express'),
    app = express();

app.use(connect.favicon());
app.use(express.static(__dirname));
app.use(connect.bodyParser());

var persons = [
  { "id": 1, "firstName": "Maiah", "lastName": "Superbird" },
  { "id": 2, "firstName": "James", "lastName": "Macariola" }
];

app.get('/person/all', function(req, res) {
	res.send(persons);
});

app.post('/person', function(req, res) {
	var person = req.body;
	persons.push(person);
});

app.del('/person/:id', function(req, res) {
	console.log('Deleting: ' + req.path);
});

app.all('*', function(req, res) {
	console.log('PATH: ' + req.path);
	console.log('METHOD: ' + req.method);
	console.log('BODY:' + req.body);
	res.sendfile('index.html');
});

app.listen(7000);
console.log('Listening on port 7000');