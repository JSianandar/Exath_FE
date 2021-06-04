import React from 'react';
import './css/IndividualTask.css';
import axios from 'axios';
import Task from './Task.js';

import {Link} from 'react-router-dom';
import table_edit from "./assets/icons/table_edit.png";
import table_delete from "./assets/icons/table_delete.png";
import table_play from "./assets/icons/table_play.png";
import table_stop from "./assets/icons/table_stop.png";
import EditTask from "./EditTask.js";

class IndividualTask extends React.Component{
	constructor(){
		super()
		this.state = {
			tasks: [],
			profiles: [],
			proxies: []
		}
	}

	async componentDidMount(){
		await this.getTasks();
		//await this.mapProfileIdToProfileName();
		await this.getProfiles();
		await this.getProxy();
	}

	getTasks = async () =>{
		await axios.get('http://exath.io/api/tasks')
		.then(response => {
		
			this.setState({
				tasks : response.data
			})
		},
		error=>{
		
		})
	}

	getProfiles = async() =>{
		await axios.get('http://exath.io/api/profiles/')
		.then(response => {
			
			this.setState({
				profiles : response.data
			})
		},
		error=>{

		})
	}

	getProxy = async() =>{
		await axios.get('http://exath.io/api/proxies/')
		.then(response => {
			
			this.setState({
				proxies : response.data
			})
		},
		error=>{

		})
	}

	mapProfileIdToProfileName = () => {
		const newTask = [];
		this.state.tasks.forEach(async e => {
			await axios.get('http://exath.io/api/profiles/' + e.profile)
			.then(response => {
				console.log("profile", response)
				e.profileName = response.data.name;
			},
			error=>{
			
			})
			newTask.push(e)

		});
		this.setState({
			tasks : newTask
		})
	};



	render(){
		return(
			
			<div className="IndividualTask">
			{
				
				this.state.tasks.map((e, index) => {
					var profile = ''
					for(var i=0; i<this.state.profiles.length; i++) {
						if(this.state.profiles[i].id == e.profile) {
							profile = this.state.profiles[i].name;
							break;
						}
					}

					var proxy = ''
					for(var i=0; i<this.state.proxies.length; i++) {
						if(e.proxyGroup == "Leaf"||e.proxyGroup == "LocalHost"){
							proxy = e.proxyGroup
							break;
						}
						if(this.state.proxies[i].id == e.proxyGroup) {
							proxy = this.state.proxies[i].group;
							break;
						}
					}

					var posKey = e.positiveKey[0].split(',')
					var negKey = e.negativeKey[0].split(',')

					var newPosKey = ''
					for(var i=0; i<posKey.length; i++) {
						if (i == posKey.length-1)
						newPosKey = newPosKey.concat('+'.concat(posKey[i]))
						else
						newPosKey = newPosKey.concat('+'.concat(posKey[i]+','))
					}

					var newNegKey = ''
					for(var i=0; i<negKey.length; i++) {
						if (i == negKey.length-1)
						newNegKey = newNegKey.concat('-'.concat(negKey[i]))
						else
						newNegKey = newNegKey.concat('-'.concat(negKey[i]+','))
					}
					
					return(
						<React.Fragment>
							<div className="individual-task-wrapper mx-auto">
								<div className="individual-task row">
									<div className="col ml-2 pt-2">
										<p className="headings text-center">{e.site}</p>
										<h3 className="headings-status text-center">{e.mode}</h3>
									</div>

									<div className="col">
										<p className="headings-other text-center" style={{marginLeft: '-10px'}}>{e.size}</p>
									</div>

									<div className="col-3">
										<p className="headings-other text-center" style={{marginLeft: '-20px'}}>{e.positiveKey[0] !== '' && newPosKey+','}<span style={{ color: '#C4C4C4' }}>{ e.negativeKey[0] !== '' && newNegKey+','}</span><span style={{ color: '#C4C4C4' }}>{e.sku}</span><span style={{ color: '#C4C4C4' }}>{e.directLink}</span></p>
									</div>
									<div className="col">
										<p className="headings-other text-center" style={{marginLeft: '-35px'}}>{profile}</p>
									</div>
									<div className="col ">
										<p className="headings-other text-center" style={{marginLeft: '-35px'}}>{proxy}</p>
									</div> 
									<div className="col-3 ">
										<p className="headings-other text-center" style={{marginLeft: '-30px'}}><span style={{color: '#FA0606', marginLeft: '-10px'}}>Waiting for Restocks</span></p>
									</div>
									<div className="col">
										<ul className="icons-wrapper pt-2" style={{marginLeft: '-30px'}}>
											<li className="icon"><Link><img src={table_play} /></Link></li>
											<li className="icon"><Link><img src={table_stop} /></Link></li>
											<li className="icon"><Link data-toggle="modal" data-target="#editTask"><img src={table_edit} /></Link></li>
											<li className="icon"><Link><img src={table_delete} /></Link></li>
										</ul>
									</div>

								</div>
							</div>
							<div className="row pt-2"></div>
							{/*EditTaskModal*/}
							<div className="modal fade" id="editTask" tabIndex="-1" aria-labelledby="editTaskLabel" aria-hidden="true">
								<EditTask/>
								<div className= "modal-dialog modal-dialog-centered">
									<div className="modal-content">		
									</div>
								</div>
							</div>
						{/*EditTaskModal*/}
							
						</React.Fragment>
					)
				})
			}
			</div>
		);
	}
}

export default IndividualTask;