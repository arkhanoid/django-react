// import Component from the react module
import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from 'axios';
import Icon from '@mui/material/Icon';



const HOST = window.location.protocol + '//' + window.location.hostname
const csrfToken = () => {
    var cookieValue = null;
    const name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return  cookieValue   ;
}

axios.defaults.headers.common['X-CSRFToken'] = csrfToken();


// create a class that extends the component
class App extends Component {

// add a constructor to take props
constructor(props) {
	super(props);
	
	// add the props here
	this.state = {
	
	// the viewCompleted prop represents the status
	// of the task. Set it to false by default
	viewCompleted: false,
	viewAll: true,
	activeItem: {
		title: "",
		description: "",
		completed: false
	},
	
	// this list stores all the completed tasks
	taskList: []
	};
}

// Add componentDidMount()
componentDidMount() {
	this.refreshList();
}


refreshList = () => {
	axios //Axios to send and receive HTTP requests
	.get(HOST+"/api/tasks/")
	.then(res => this.setState({ taskList: res.data }))
	.catch(err => alert(JSON.stringify(err)));
};

// this arrow function takes status as a parameter
// and changes the status of viewCompleted to true
// if the status is true, else changes it to false
displayCompleted = status => {
	if (status) {
	return this.setState({ viewCompleted: true });
	}
	return this.setState({ viewCompleted: false });
};

displayAll = status => {
	if (status) {
	return this.setState({ viewAll: true });
	}
	return this.setState({ viewAll: false });
};



// this array function renders two spans that help control
// the set of items to be displayed(ie, completed or incomplete)
renderTabList = () => {
	return (
	<div className="my-5 tab-list">
		<span
		onClick={() => { this.displayCompleted(true); this.displayAll(false)}}
		className={this.state.viewCompleted && !this.state.viewAll ? "active" : ""}
		>
		completed
			</span>
		<span
		onClick={() => { this.displayCompleted(false); this.displayAll(false)} }
		className={!this.state.viewCompleted && !this.state.viewAll ? "active" : ""}
		>
		Incompleted
			</span>
	<span
		onClick={() => { this.displayCompleted(false); this.displayAll(true)} }
		className={ this.state.viewAll ? "active" : ""}
		>
	        All	
			</span>
		<span onClick={this.createItem} >
				<Icon>add_task</Icon>
		</span>


	</div>
	);
};
// Main variable to render items on the screen
renderItems = () => {
	const { viewCompleted, viewAll } = this.state;
	const newItems = this.state.taskList.filter(
	(item) => item.completed === viewCompleted || viewAll
	);
	return newItems.map((item) => (
	<li
		key={item.id}
		className="list-group-item d-flex justify-content-between align-items-center"
	>
		<span
		className={`todo-title mr-2 col-md-8 ${
			item.completed ? "completed-todo" : ""
		}`}
		title={item.description}
		>
		{item.title}
		</span>
		<div
			className={ "col-md-4" }	
			onClick={() => this.editItem(item)}
		>
			<Icon>edit</Icon>
		</div>
		<div
			className={ "col-md-4" } 
			onClick={() => this.handleDelete(item)}
		>
			<Icon>delete_forever</Icon>
		</div>
	</li>
	));
};

toggle = () => {
	//add this after modal creation
	this.setState({ modal: !this.state.modal });
};

// Submit an item
handleSubmit = (item) => {
	this.toggle();
	if (item.id) {
	// if old post to edit and submit
	axios
		.put(`${HOST}/api/tasks/${item.id}/`, item)
		.then((res) => this.refreshList())
		.catch(err => console.log(err));

	return;
	}
	// if new post to submit
	axios
	.post(HOST+"/api/tasks/", item )
	.then((res) => this.refreshList())
	.catch(err => console.log(err));
};

// Delete item
handleDelete = (item) => {
	axios
	.delete(`${HOST}/api/tasks/${item.id}/`)
	.then((res) => this.refreshList());
};
/*handleDelete = (item) => {
	alert("DELETE " + JSON.stringify(item));
};*/

// Create item
createItem = () => {
	const item = { title: "", description: "", completed: false };
	this.setState({ activeItem: item, modal: !this.state.modal });
//	alert("POST "+ JSON.stringify(item))
};

//Edit item
editItem = (item) => {
	this.setState({ activeItem: item, modal: !this.state.modal });

};

// Start by visual effects to viewer
render() {
	return (
	<main className="content">
		<h1 className="text-success text-uppercase text-center my-4">
		GFG Task Manager
		</h1>
		<div className="row ">
		<div className="col-md-6 col-sm-10 mx-auto p-0">
			<div className="card p-3">
			<div className="">
			</div>
			{this.renderTabList()}
			<ul className="list-group list-group-flush">
				{this.renderItems()}
			</ul>
			</div>
		</div>
		</div>
		{this.state.modal ? (
		<Modal
			activeItem={this.state.activeItem}
			toggle={this.toggle}
			onSave={this.handleSubmit}
		/>
		) : null}
	</main>
	);
}
}
export default App;

