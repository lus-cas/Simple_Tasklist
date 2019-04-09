class Task {

	/* This class represents a task.
	*
	*	_tittle is the task itself.
	*	_accountable is the person who has to do the task.
	*	_term defines the task deadline.			
	*	_status is true if the task is done and false otherwise.
	*/

	constructor(id, title, accountable, term, status) {

		this._title = title;

		this._accountable = accountable;

		this._term = term;

		this._status = status;

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

	set id(id) {
		this._id = id;
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

	// return true iff the task is done
	done() {
		return this._status == 1;
	}

}

class TaskList {

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
	}

	// edit task operation
	editTask(id, title, accountable, term) {
		this.tasks[id].title = title;
		this.tasks[id].accountable = accountable;
		this.tasks[id].term = term;
		this.printTasks();
	}

	// changes the task status (1: done 0: to do)
	switchTaskStatus(id, status) {
		this.tasks[id].status = status;
		this.printTasks();
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
				todo.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchTaskStatus('+i+', 1)">check_box_outline_blank</i></div><div class="col s9"><span class="title">'+this.tasks[i].title+'</span><span class="date grey-text">'+this.tasks[i].term+'</span><br><span>Accountable: '+this.tasks[i].accountable+'</span></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.removeTask('+i+')">delete</i></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="editForm('+i+')">edit</i></div></div></div>';
			}

		}

		if(doneTasks.length > 0) {

			done.innerHTML += "<h1 class='col s12 center'>Done</h1>";

			for(let i = doneTasks.length - 1; i >= 0; i--) {
				done.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.switchTaskStatus('+i+', 0)">check_box</i></div><div class="col s9"><span class="title">'+this.tasks[i].title+'</span><span class="date grey-text">'+this.tasks[i].term+'</span><br><span>Accountable: '+this.tasks[i].accountable+'</span></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="tasklist.removeTask('+i+')">delete</i></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="editForm('+i+')">edit</i></div></div></div>';
			}

		}
		
	}
}


const tasklist = new TaskList();

const todo = document.getElementById("todo-wrapper");
const done = document.getElementById("done-wrapper");

const form = document.forms["task_form"];
const inputs = document.forms["task_form"].getElementsByTagName("input");

const editTaskForm = document.forms["edit_task_form"];
const editInputs = document.forms["edit_task_form"].getElementsByTagName("input");

const overlayer = document.getElementById("overlayer");

window.addEventListener("DOMContentLoaded", () => {

	form.addEventListener("submit", event => {

		event.preventDefault();

		tasklist.addTask(inputs[0].value, inputs[1].value, inputs[2].value, 0);
		tasklist.printTasks();

		for (let i = inputs.length - 1; i >= 0; i--) {
			inputs[i].value = "";
		}

	});

	overlayer.addEventListener("click", event => {
		editTaskForm.classList.add("hidden");
		form.classList.remove("hidden");
		overlayer.style = "opacity: 0; z-index: -3;";
	});

});


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


function editForm(id) {

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
