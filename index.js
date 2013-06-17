var personTmpl = require('./template');
var model = require('model');
var timestamps = require('model-timestamps');
var View = require('view');
var domify = require('domify');

var saveButton = document.querySelector('.saveButton');

/*
 * The view declaration.
 */
var PersonView = function(person) {
  var el = domify(personTmpl);
  View.call(this, person, el);
  this.bind('click .editBtn', 'editPerson');
  this.bind('click .deleteBtn', 'deletePerson');
};

/*
 * Inherit from View prototype.
 */
PersonView.prototype.__proto__ = View.prototype;

/*
 * The view function declaration.
 */
PersonView.prototype.editPerson = function() {
  var person = this.obj;

  var inputFirstNameEl = document.querySelector('.inputFirstName');
  var inputLastNameEl = document.querySelector('.inputLastName');
  var inputAddressEl = document.querySelector('.inputAddress');
  var inputEmailEl = document.querySelector('.inputEmail');
  var inputPhoneEl = document.querySelector('.inputPhone');

  inputFirstNameEl.value = person.firstName();
  inputLastNameEl.value = person.lastName();
  inputAddressEl.value = person.address();
  inputEmailEl.value = person.email();
  inputPhoneEl.value = person.phone();

  var pEl = document.querySelector('p');

  if (saveButton.parentNode !== null) {
    pEl.removeChild(saveButton);
  }

  var editButton = document.createElement('button');
  editButton.appendChild(document.createTextNode('Edit'));

  var cancelButton = document.createElement('button');
  cancelButton.appendChild(document.createTextNode('Cancel'));

  pEl.appendChild(editButton);
  pEl.appendChild(cancelButton);
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
  .attr('address')
  .attr('email')
  .attr('phone')
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
  myperson.address(person.address());
  myperson.email(person.email());
  myperson.phone(person.phone());
  var personView = new PersonView(myperson);

  /*
   * Attach the view to the "p" element in the body.
   */
  var p = document.querySelector('div');
  p.appendChild(personView.el);
};

saveButton.onclick = function() {
  var firstName = document.querySelector('.inputFirstName');
  var lastName = document.querySelector('.inputLastName');

  var person = new Person();
  person.firstName(firstName.value);
  person.lastName(lastName.value);

  person.save();
  addPersonToView(person);

  firstName.value = '';
  lastName.value = '';
};