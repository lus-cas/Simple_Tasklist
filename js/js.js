class Task {

	/* This class represents a task.
	*
	*	_id is the indentifier.
	*	_tittle is the task itself.
	*	_accountable is the person who has to do the task.
	*	_term defines the task deadline.			
	*	_status is true if the task is done and false otherwise.
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

		this._tasks = [];
	
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

	// returns all to do tasks as a list
	toDo() {
		return this.tasks.filter(task => { return !task.done() });
	}

	// returns all done tasks as a list
	done() {
		return this.tasks.filter(task => { return task.done() });
	}

	// pushes a Task to the list
	pushTask(task) {
		this.tasks.push(task);
	}

	// create a new Task and pushes it to the list
	addTask(title, accountable, term, status) {
		const task = new Task(title, accountable, term, status);
		this.pushTask(task);
	}

	// removes a Task of the list
	removeTask(id) {
		this.tasks.splice(id, 1);
		this.printTasks();
		this.saveTasks();
	}

	// edit task operation
	editTask(id, title, accountable, term) {
		this.tasks[id].title = title;
		this.tasks[id].accountable = accountable;
		this.tasks[id].term = term;
		this.printTasks();
		this.saveTasks();
	}

	// changes the task status (1: done 0: to do)
	switchTaskStatus(id, status) {
		this.tasks[id].status = status;
		this.printTasks();
		this.saveTasks();
	}

	// writes the tasklist
	printTasks() {
		todo.innerHTML = "";
		done.innerHTML = "";


		var toDoTasks = this.toDo();
		var doneTasks = this.done();

		if(toDoTasks.length > 0) {

			todo.innerHTML += "<h1 class='col s12 center'>To Do</h1>";

			for(let i = toDoTasks.length - 1; i >= 0; i--) {
				let id = toDoTasks[i].id;
				id = this.tasks.findIndex(task => task.id === id);
				todo.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchTaskStatus('+id+', 1)">check_box_outline_blank</i></div><div class="col s7 m9"><span class="title">'+toDoTasks[i].title+'</span><span class="date grey-text">'+toDoTasks[i].term+'</span><br><span>'+toDoTasks[i].accountable+'</span></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="tasklist.removeTask('+id+')">delete</i></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="editForm('+id+')">edit</i></div></div></div>';
			}

		}

		if(doneTasks.length > 0) {

			done.innerHTML += "<h1 class='col s12 center'>Done</h1>";

			for(let i = doneTasks.length - 1; i >= 0; i--) {
				let id = doneTasks[i].id;
				id = this.tasks.findIndex(task => task.id === id);

				done.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchTaskStatus('+id+', 0)">check_box</i></div><div class="col s7 m9"><span class="title">'+doneTasks[i].title+'</span><span class="date grey-text">'+doneTasks[i].term+'</span><br><span>'+doneTasks[i].accountable+'</span></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="tasklist.removeTask('+id+')">delete</i></div><div class="col s2 m1 center"><i class="material-icons option-button pointer" onclick="editForm('+id+')">edit</i></div></div></div>';
			}

		}
		
	}

	// saves the tasklist into the localStorage
	saveTasks() {
		let tasks = JSON.stringify(this.tasks);
		localStorage.setItem("tasks", tasks);
	}
}

/*	I should've created a new class for storage.
*	Or at least organized the code in better ways.
* 	Sorry.
*/

const tasklist = new Tasklist(); // Tasklist object
tasks = localStorage.getItem("tasks");

const todo = document.getElementById("todo-wrapper"); // div that contains the to do list
const done = document.getElementById("done-wrapper"); // div that contains the done list

const addButton = document.getElementById("add_button"); // show new task form button
const form = document.forms["task_form"]; // new task form reference
const inputs = document.forms["task_form"].getElementsByTagName("input"); // new task inputs

const searchButton = document.getElementById("search_button"); // show search task form button
const searchForm = document.forms["search_form"]; // search task form
const searchInput = document.forms["search_form"].getElementsByTagName("input"); // search input

const editTaskForm = document.forms["edit_task_form"]; // edit task form reference
const editInputs = document.forms["edit_task_form"].getElementsByTagName("input"); // edit inputs

const overlayer = document.getElementById("overlayer"); // modal efect div


// verifies if there's any tasks into the localStorage and pushes 'em to the tasklist object. prints the list also
if(tasks != null) {

	tasks = JSON.parse(tasks);

	for(i in tasks) {
		var task = new Task(tasks[i]._title, tasks[i]._accountable, tasks[i]._term, tasks[i]._status);
		tasklist.pushTask(task);
	}

	tasklist.printTasks();
}

// on-load window event
window.addEventListener("DOMContentLoaded", () => {

	// display new-task-form and hide search-task-form
	addButton.addEventListener("click", () => {
		form.style.height = '160px';
		searchForm.style.height = '0';
		inputs[0].focus();
	});

	// new-task-form should be hidden on reset event
	form.addEventListener("reset", () => {
		form.style.height = '0';
	});

	// display search-task-form and hide new-task-form
	searchButton.addEventListener("click", () => {
		searchForm.style.height = '80px';
		form.style.height = '0';
		searchInput[0].focus();
	});


	// prevents form from submiting and creates a new task
	form.addEventListener("submit", event => {

		event.preventDefault();

		if(! checkInput(inputs[0])) return -1;

		inputs[0].style.borderBottom = '1px solid black';

		tasklist.addTask(inputs[0].value, inputs[1].value, inputs[2].value, 0);
		tasklist.printTasks();
		tasklist.saveTasks();

		for (let i = inputs.length - 1; i >= 0; i--) {
			inputs[i].value = "";
		}

	});

	// the modal must to turn off on-click event
	overlayer.addEventListener("click", event => {
		editTaskForm.classList.add("hidden");
		form.classList.remove("hidden");
		overlayer.style = "opacity: 0; z-index: -3;";
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

// turns on the modal and edit task form
function editForm(id) {

	editInputs[0].style.borderBottom = '1px solid black';
	
	form.classList.add("hidden");
	overlayer.style = "opacity: 0.8; z-index: 10;";
	editTaskForm.classList.remove("hidden");

	document.body.scrollTop = 0;
  	document.documentElement.scrollTop = 0; 

	editInputs[0].value = tasklist.tasks[id].title;
	editInputs[1].value = tasklist.tasks[id].accountable;
	editInputs[2].value = tasklist.tasks[id].term;

	var submit = function(event) {

		event.preventDefault();

		if(! checkInput(editInputs[0])) return -1;

		tasklist.editTask(id, editInputs[0].value, editInputs[1].value, editInputs[2].value);

		for (var i = editInputs.length - 1; i >= 3; i--) {
			editInputs[i].value = "";
		}

		editTaskForm.classList.add("hidden");
		form.classList.remove("hidden");
		overlayer.style = "opacity: 0; z-index: -3;";

		editTaskForm.removeEventListener("submit", submit);
	}
	
	editTaskForm.addEventListener("submit", submit);	

}

function checkInput(input) {
	if(input.value == "") {
		input.style.borderBottom = '1px var(--red) solid';
		return false;
	}

	return true;
}