import React from 'react'
import '../css/BarsCss/NavBar.css'
import GoldenIcon from "../res/goldenFacebook.png"
import FakeBook from "../res/facebook.png"
export default function NavBar({firstHandleClick,darkMode,toggleDarkMode}) {
	let logoToUse = darkMode? GoldenIcon: FakeBook;
	return (
	
	<nav className={darkMode ? "dark": ''}>
	<div className="left_col">
			<img className = "fb_icon " src = {logoToUse}/>
		<input
		  className ="search-tab"
		  type="text"
		  placeholder="search in FakeBook"
		 
		/>
			
	</div>
		<div className='right_col'>
				<button className='button' onClick={toggleDarkMode} >dark-mode</button>	
				<button className='button' onClick={firstHandleClick}>log-out</button>	
		</div>
		
	</nav>

  );
}
