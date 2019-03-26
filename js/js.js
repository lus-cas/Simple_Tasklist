class Task {

	constructor(title, accountable, term) {

		this._title = title;

		this._accountable = accountable;

		this._term = term;

	}


	get title () {
		return this._title;
	}

	get term () {
		return this._term;
	}

	get accountable () {
		return this._accountable;
	}

	set title(title) {
		this._title = title;
	}

	set term(term){
		this._term = term;
	}
	
	set accountable(accountable) {
		this._accountable = accountable;
	}

}

class List {

	constructor(done) {
		this._tasks = [];
		if(done == false) this._done = false;
		else this._done = true;
		this._cache = new Task("", "", "");
	
	}

	get tasks() {
		return this._tasks;
	}

	get cache() {
		return this._cache;
	}

	get done() {
		return this._done;
	}

	set done(done) {
		this._done = done;
	}

	set tasks(tasks){
		this._tasks = tasks;
	}
	
	set cache(cache) {
		this._cache = cache;
	}

	empty() {
		return (this.tasks.length == 0);
	}

	addTask(title, accountable, term) {
		var task = new Task(title, accountable, term);
		this.tasks.push(task);
	}

	pushTask(task) {
		this.tasks.push(task);
	}

	removeTask(id, print) {
		this.cache = this.tasks[id];
		this.tasks.splice(id, 1);
		if(print) this.printTasks();
	}

	editTask(id, title, accountable, term) {
		this.tasks[id].title = title;
		this.tasks[id].accountable = accountable;
		this.tasks[id].term = term;
		this.cache = this.tasks[id];
		this.printTasks();
	}

	printTasks() {

		if(this.done == false) var wrapper = document.getElementById("todo-wrapper");
		else var wrapper = document.getElementById("done-wrapper");

		wrapper.innerHTML = "";

		if(this.done == false && this.tasks.length > 0) wrapper.innerHTML = "<h1 class='col s12 center'>To Do</h1>";
		else if(this.done == true && this.tasks.length > 0) wrapper.innerHTML = "<h1 class='col s12 center'>Done</h1>";
		for (var i = this.tasks.length - 1; i >= 0; i--) {
			if(! this.done) wrapper.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s9"><span class="title">'+this.tasks[i].title+'</span><span class="date grey-text">'+this.tasks[i].term+'</span><br><span>Responsável: '+this.tasks[i].accountable+'</span></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="todo.removeTask('+i+', true)">delete</i></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="editForm('+i+', false)">edit</i></div><div class="col s1 center"><i class="material-icons option-button pointer green-text" onclick="doneTask('+i+')">check</i></div></div></div>';
			else wrapper.innerHTML += '<div class="col s12 m10 l6 offset-m1 offset-l3"><div class="row col s12 border h60"><div class="col s9"><span class="title">'+this.tasks[i].title+'</span><span class="date grey-text">'+this.tasks[i].term+'</span><br><span>Responsável: '+this.tasks[i].accountable+'</span></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="done.removeTask('+i+', true)">delete</i></div><div class="col s1 center"><i class="material-icons option-button pointer" onclick="editForm('+i+', true)">edit</i></div><div class="col s1 center"><i class="material-icons option-button pointer red-text" onclick="toDoTask('+i+')">refresh</i></div></div></div>';
		}
		
	}
}

var todo = new List(false);
var done = new List(true);

var form = document.getElementById("task_form");
var edit_form = document.getElementById("edit_task_form");
var input = document.getElementsByTagName("input");
var overlayer = document.getElementById("overlayer");
var date = "";

window.addEventListener("DOMContentLoaded", event => {

	todo.printTasks();

	form.addEventListener("submit", event => {


		if(input[2].value != "") {
			
			date = input[2].value.split("-");
			date = date[2]+"/"+date[1]+"/"+date[0];

		}

		todo.addTask(input[0].value, input[1].value, date);

		todo.printTasks();

		for (var i = input.length - 1; i >= 0; i--) {
			input[i].value = "";
			date = "";
		}

		event.preventDefault();

	});

	overlayer.addEventListener("click", event => {
		edit_form.classList.add("hidden");
		form.classList.remove("hidden");
		overlayer.style = "opacity: 0; z-index: -3;";
	});

});


function editForm(id, list){
	form.classList.add("hidden");
	overlayer.style = "opacity: 0.8; z-index: 10;";
	edit_form.classList.remove("hidden");

	document.body.scrollTop = 0;
  	document.documentElement.scrollTop = 0; 

	if(list){
		input[3].value = done.tasks[id].title;
		input[4].value = done.tasks[id].accountable;

		new_date = done.tasks[id].term.split("/");
		new_date = new_date[2]+"-"+new_date[1]+"-"+new_date[0];

		input[5].value = new_date;
	}else{
		input[3].value = todo.tasks[id].title;
		input[4].value = todo.tasks[id].accountable;

		new_date = todo.tasks[id].term.split("/");
		new_date = new_date[2]+"-"+new_date[1]+"-"+new_date[0];

		input[5].value = new_date;
	}

	var _submit = function(event) {

		event.preventDefault();

		if(input[5].value != "") {
			
			date = input[5].value.split("-");
			date = date[2]+"/"+date[1]+"/"+date[0];

		}

		if(list){
			done.editTask(id, input[3].value, input[4].value, date);
			done.printTasks();
		}else{
			todo.editTask(id, input[3].value, input[4].value, date);
			todo.printTasks();
		}

		for (var i = input.length - 1; i >= 3; i--) {
			input[i].value = "";
			date = "";
		}

		edit_form.classList.add("hidden");
		form.classList.remove("hidden");
		overlayer.style = "opacity: 0; z-index: -3;";

		edit_form.removeEventListener("submit", _submit);
	}
	
	edit_form.addEventListener("submit", _submit);	

}

function doneTask(id){
	done.pushTask(todo.tasks[id]);
	todo.removeTask(id, true);
	done.printTasks();
}

function toDoTask(id){
	todo.pushTask(done.tasks[id]);
	done.removeTask(id, true);
	todo.printTasks();
}