var personTmpl = require('./template');
var model = require('model');
var timestamps = require('model-timestamps');
var View = require('view');
var domify = require('domify');

/*
 * The view declaration.
 */
var PersonView = function(person) {
	var el = domify(personTmpl);
  View.call(this, person, el[0]);
  this.bind('click .changeBtn', 'changeName');
  this.bind('click .deleteBtn', 'deletePerson');
};

/*
 * Inherit from View prototype.
 */
PersonView.prototype.__proto__ = View.prototype;

/*
 * The view function declaration.
 */
PersonView.prototype.changeName = function() {
	var person = this.obj;
	var firstName = person.firstName();
  person.firstName(person.lastName());
  person.lastName(firstName);
};

PersonView.prototype.deletePerson = function() {
	var person = this.obj;
	person.remove();
  this.el.parentNode.removeChild(this.el);
};

/*
 * The model declaration.
 */
var Person = model('Person')
  .attr('id')
  .attr('firstName')
  .attr('lastName')
  .use(timestamps);

/*
 * Fetch all the persons from server.
 */
Person.all(function(err, persons) {
	if (err) {
		console.log('Error: ' + err);
	} else {
		/*
		 * Create person and view object and bind them together.
		 */
		persons.each(function(person) {
			addPersonToView(person);
		});
	}
});

var addPersonToView = function(person) {
	var myperson = new Person();
	myperson.id(person.id());
	myperson.firstName(person.firstName());
	myperson.lastName(person.lastName());
	var personView = new PersonView(myperson);

	/*
	 * Attach the view to the "p" element in the body.
	 */
	var p = document.querySelector('p');
	p.appendChild(personView.el);
};

var saveButton = document.querySelector('.saveButton');
saveButton.onclick = function() {
  var firstName = document.querySelector('.inputFirstName');
  var lastName = document.querySelector('.inputlastName');

  var person = new Person();
  person.firstName(firstName.value);
  person.lastName(lastName.value);

  person.save();
  addPersonToView(person);

  firstName.value = '';
  lastName.value = '';
};