import React from 'react'
import '../css/pagesCss/LoginPage.css'
import Register from '../inputs/Register'
import HomePageText from '../decoratives/HomePageText'

export default function RegisterPage() {
  return (
	<div className='parent'>
	<div className='right_child'>
	<HomePageText/>
	</div>
	<div className='left_child'>
	<Register ></Register>
	</div>
	</div>	
  )
}
