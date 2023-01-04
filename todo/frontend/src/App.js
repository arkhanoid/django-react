// import Component from the react module
import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from 'axios';
import Icon from '@mui/material/Icon';
import { UncontrolledCollapse, ListGroup, ListGroupItem } from 'reactstrap';


const HOST = window.location.protocol + '//' + window.location.hostname + ( window.location.port == 80 ? '' : ':' + window.location.port )
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
	const selected_class = "text-primary";
	return (
	<div className="d-flex my-5 p-3 justify-content-between">
		<Icon
		onClick={() => { this.displayCompleted(true); this.displayAll(false)}}
		className={this.state.viewCompleted && !this.state.viewAll ? selected_class :   ""}
		>
		task_alt</Icon>
		<Icon
		onClick={() => { this.displayCompleted(false); this.displayAll(false)} }
		className={!this.state.viewCompleted && !this.state.viewAll ? selected_class : ""}
		>
		unpublished
		</Icon>
		<Icon
		onClick={() => { this.displayCompleted(false); this.displayAll(true)} }
		className={ this.state.viewAll ? selected_class : ""}
		>
	        checklist	
		</Icon>
		<Icon onClick={this.createItem} >
		add_task
		</Icon>
		<Icon onClick={() => { console.log('refresh requested'); this.refreshList()}}>refresh</Icon>

	</div>
	);
};
// Main variable to render items on the screen
renderItems = () => {
	const { viewCompleted, viewAll } = this.state;
	const newItems = this.state.taskList.filter(
	(item) => item.completed === viewCompleted || viewAll
	);
	return	newItems.map((item) => (
	<ListGroupItem key={item.id}>
		<div className="d-flex justify-content-between align-items-center">
		<span
		className={`todo-title mr-2 col-md-10 ${
			item.completed ? "completed-todo" : ""
		}`}
		title={item.description} 

		>
		{item.title}
		</span>
		<div	className={ "d-flex justify-content-end" }>
			<Icon id={`toggler-${item.id}`}>folderopen  </Icon>
				
			<Icon onClick={() => this.editItem(item)}>edit</Icon>
				
			<Icon onClick={() => this.handleDelete(item)}>delete_forever</Icon>
		</div>
		</div>
		<UncontrolledCollapse toggler={`toggler-${item.id}`} className={"p-3 card"}>

			{item.description} 
		</UncontrolledCollapse>
	</ListGroupItem>
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
		<h1 className="jumbotron text-success text-uppercase text-center my-4">
		Gerenciador de Tarefas v1.0
		</h1>
		<div className="row ">
		<div className="col-md-6 col-sm-10 mx-auto p-0">
			<div className="card p-3 m-3">
			<div className="">
			</div>
			{this.renderTabList()}
			<ListGroup>
				{this.renderItems()}
			</ListGroup>
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

