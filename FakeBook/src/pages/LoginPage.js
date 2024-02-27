import React from 'react'
import '../css/pagesCss/LoginPage.css'
import Login from '../inputs/Login'
import HomePageText from '../decoratives/HomePageText'
import PageNavigator from './PageNavigator'


export default function LoginPage({isApproveToBrowse,onApproveToBrowse,premissionRef,users}) {
	if(isApproveToBrowse){
		return(
		<PageNavigator caller={"LoginPage"}/>
		)
	}

	return (
	<div className='parent'>
		<div className='right_child'>
		<HomePageText/>
		</div>
		<div className='left_child'>
		<Login upDateApproval = {onApproveToBrowse} premissionRef={premissionRef} users = {users}></Login>
		</div>
		</div>	
  )
}