import React from 'react'
import {Navigate} from "react-router-dom"
export default function PageNavigator({caller,task}) {
	console.log("Page NAvi");
	if(caller === 'LoginPage'){
		return(<Navigate to="/feed"/>)
		
	}
	if (caller === 'FeedPage'){
		return(<Navigate to="/"/>)
	}
	return(
		<Navigate to = {task}/>
	)
}
