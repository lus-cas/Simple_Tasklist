// -	Hide form quando clicar de novo no ícone como
// 	se fosse um collapse


class Task {

	/* This class represents a task.
	*
	*	id is the indentifier.
	*	tittle is the task itself.
	*	accountable is the person who has to do the task.
	*	term defines the task deadline.			
	*	status is true if the task is done and false otherwise.
	*/

	constructor(title, accountable, term, status) {

		this._id = Task.generateId();

		this._title = title;

		this._accountable = accountable;

		this._term = term;

		this._status = status;

	}

	static generateId() {
		if(this.tasksId == null) this.tasksId = 0;
		else this.tasksId++;

		return this.tasksId;
	}

	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	get term() {
		return this._term;
	}

	get accountable() {
		return this._accountable;
	}

	get status() {
		return this._status;
	}

	set title(title) {
		this._title = title;
	}

	set term(term) {
		this._term = term;
	}
	
	set accountable(accountable) {
		this._accountable = accountable;
	}

	set status(status) {
		this._status = status;
	}

	// return true if and only if the task is done
	done() {
		return this._status == 1;
	}

}

class Tasklist {

	/* Tasklist class.
	*
	*	This class implements a tasklist object and its operations.
	*/

	constructor() {

		this._tasks = []; // tasklist
	
	}

	get tasks() {
		return this._tasks;
	}

	set tasks(tasks){
		this._tasks = tasks;
	}

	// returns true if the list is empty or false elseways
	empty() {
		return (this.tasks.length == 0);
	}

	// returns all to do tasks from a tasklist or from the this.tasks by default
	toDo(tasks) {
		if(tasks != null) return tasks.filter(task => { return !task.done() });
		return this.tasks.filter(task => { return !task.done() });
	}

	// returns all done tasks from a tasklist or from the this.tasks by default
	done(tasks) {
		if(tasks != null) return tasks.filter(task => { return task.done() });
		return this.tasks.filter(task => { return task.done() });
	}

	// pushes a Task to the list
	push(task) {
		this.tasks.push(task);
	}


	// search for a task by a given string
	search(query) {
		if(query == "") this.print();

		else {
			const tasks = this.tasks.filter(task => {
				return task.title.indexOf(query) != -1 || task.accountable.indexOf(query) != -1 || task.term.indexOf(query) != -1
			});
			this.print(tasks);
		}	
	}

	// create a new Task and pushes it to the list
	add(title, accountable, term, status) {
		const task = new Task(title, accountable, term, status);
		this.push(task);
	}

	// removes a Task of the list
	remove(id) {
		this.tasks.splice(id, 1);
		this.print();
		this.save();
	}

	// edit task operation
	edit(id, title, accountable, term) {
		this.tasks[id].title = title;
		this.tasks[id].accountable = accountable;
		this.tasks[id].term = term;
		this.print();
		this.save();
	}

	// saves the tasklist into the localStorage
	save() {
		let tasks = JSON.stringify(this.tasks);
		localStorage.setItem("tasks", tasks);
	}

	// changes the task status (1: done 0: to do)
	switchStatus(id, status) {
		this.tasks[id].status = status;
		this.print();
		this.save();
	}

	// writes the tasklist
	print(tasks) {
		todo.innerHTML = "";
		done.innerHTML = "";

		var toDoTasks = this.toDo(tasks);
		var doneTasks = this.done(tasks);

		if(toDoTasks.length) {

			todo.innerHTML += "<h2 class='col s12 center'>To Do</h2>";

			for(let i = toDoTasks.length - 1; i >= 0; i--) {
				let id = toDoTasks[i].id;
				id = this.tasks.findIndex(task => task.id === id);
				todo.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchStatus('+id+', 1)">check_box_outline_blank</i></div><div class="col s7 m9 valign-wrapper"><div><span class="title">'+toDoTasks[i].title+'</span><span class="date grey-text">'+toDoTasks[i].term+'</span><p>'+toDoTasks[i].accountable+'</p></div></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="tasklist.remove('+id+')">delete</i></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="editForm('+id+')">edit</i></div></div></div>';
			}

		}

		if(doneTasks.length) {

			done.innerHTML += "<h2 class='col s12 center'>Done</h2>";

			for(let i = doneTasks.length - 1; i >= 0; i--) {
				let id = doneTasks[i].id;
				id = this.tasks.findIndex(task => task.id === id);

				done.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchStatus('+id+', 0)">check_box</i></div><div class="col s7 m9 valign-wrapper"><div><span class="title">'+doneTasks[i].title+'</span><span class="date grey-text">'+doneTasks[i].term+'</span><p>'+doneTasks[i].accountable+'</p></div></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="tasklist.remove('+id+')">delete</i></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="editForm('+id+')">edit</i></div></div></div>';
			}

		}
		
	}
}

class Form {

	/*	This class represents a Form html element
	*	and some validations functions.
	*/

	constructor(name, button) {

		this._form = document.forms[name]; // form html element
		this._inputs = document.forms[name].getElementsByTagName("input"); // inputs elements
		this._button = document.getElementById(button); // form button 

		if(this.button) {

			// display form and hide the active ones
			this.button.addEventListener("click", () => {
				this.focus();
			});

		}

		// hide form on reset event
		this.form.addEventListener("submit", event => {
			event.preventDefault();
		});

		// hide form on reset event
		this.form.addEventListener("reset", () => {
			this.hide();
		});

	}

	get form() {
		return this._form;
	}

	get inputs() {
		return this._inputs;
	}

	get button() {
		return this._button;
	}

	set form(name){
		this._form = document.forms[name];
	}	

	set inputs(name){
		this._inputs = document.forms[name].getElementsByTagName("input");
	}

	set button(button){
		this._button = document.getElementById(button);
	}

	// verifies if the form is already visible on screen
	active() {
		return (this.form.classList.contains("active"));
	}

	// displays the form
	show() {
		this.form.style.height = "160px";
		this.form.classList.add("active");
		this.inputs[0].focus();
	}

	// hide the form
	hide() {
		this.form.style.height = "0";
		this.form.classList.remove("active");
	}

	// check if the the required input isn't null  
	check() {
		if(this.inputs[0].value == "") {
			this.inputs[0].style.borderBottom = '1px var(--red) solid';
			return false;
		}

		return true;
	}

	// switches beteween forms
	focus() {
		if(this.active()) 
			this.hide();

		else{
			if(!Form.hideActives()) this.show();
			else setTimeout(() => { this.show() }, 100);
		}
	}

	// hide all actives form
	static hideActives() {
		var active = document.querySelectorAll(".active");

		if(active.length == 0) return false;

		active.forEach(item => {
			item.classList.remove("active");
			item.style.height = "0";
		});

		return true;
	}

}

/*	I should've created a new class for storage.
*	Or at least organized the code in better ways.
* 	Sorry.
*/

var tasks = localStorage.getItem("tasks"); // get the tasks stored on localStorage
const tasklist = new Tasklist(); // Tasklist object

const todo = document.getElementById("todo-wrapper"); // div that contains the to do list
const done = document.getElementById("done-wrapper"); // div that contains the done list

const add = new Form("add_form", "add_button"); // add-task form reference
const search = new Form("search_form", "search_button"); // search-task form reference
const edit = new Form("edit_form", "edit_button"); // edit-task form reference

// verifies if there's any tasks into the localStorage and pushes 'em to the tasklist object. prints the list also
if(tasks != null) {

	tasks = JSON.parse(tasks);

	for(i in tasks) {
		var task = new Task(tasks[i]._title, tasks[i]._accountable, tasks[i]._term, tasks[i]._status);
		tasklist.push(task);
	}

}

tasklist.print();

// on-load window event
window.addEventListener("DOMContentLoaded", () => {

	// prevents add-task-form from submiting and creates a new task
	add.form.addEventListener("submit", () => {

		if(!add.check()) return -1;

		tasklist.add(add.inputs[0].value, add.inputs[1].value, add.inputs[2].value);
		tasklist.print();
		tasklist.save();

		for (let i = add.inputs.length - 1; i >= 0; i--) {
			add.inputs[i].value = "";
		}

	});

	// prevents search-task-form from submiting and prints the result
	search.inputs[0].addEventListener("keyup", () => {

		tasklist.search(search.inputs[0].value);

	});

});

/*	messy code alert!
*	the following statemants formats the data input into DD/MM/YYYY
*/

var previousDateLength = 0;
const terms = document.getElementsByName("term");

for(let i = 0; i < terms.length; i++) {
	terms[i].addEventListener("keydown", () => {
		if(terms[i].value.length > previousDateLength) {
			if(terms[i].value.length == 2) 
				terms[i].value += "/";

			else if(terms[i].value.length == 5)
				terms[i].value += "/";
		}

		previousDateLength = terms[i].value.length;

	});
}

// displays the edit-task-form 
function editForm(id) {

	edit.inputs[0].style.borderBottom = '1px solid black';
	edit.focus();

	document.body.scrollTop = 0;
  	document.documentElement.scrollTop = 0; 

	edit.inputs[0].value = tasklist.tasks[id].title;
	edit.inputs[1].value = tasklist.tasks[id].accountable;
	edit.inputs[2].value = tasklist.tasks[id].term;

	var submit = function(event) {

		if(!edit.check()) return -1;

		tasklist.edit(id, edit.inputs[0].value, edit.inputs[1].value, edit.inputs[2].value, 0);

		for (let i = edit.inputs.length - 1; i >= 0; i--) {
			edit.inputs[i].value = "";
		}

		edit.hide();

		edit.form.removeEventListener("submit", submit);
	}
	
	edit.form.addEventListener("submit", submit);

}