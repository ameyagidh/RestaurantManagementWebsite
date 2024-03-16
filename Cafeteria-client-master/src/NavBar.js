import {Link} from 'react-router-dom'
import React from 'react';

function NavBar(props){


    function handleClick(){
        props.showCheck();
        return;
    }
    
    return(
        <div className="divi">
            <ul className="navList">
                <Link to='/'>
                    <li onClick={handleClick} className="navItem">Restaurant View</li>
                </Link>
                <Link to='/chef-view'>
                    <li className="navItem">Chef View</li>
                </Link>
                <Link to="waiting-list">
                    <li className="navItem">Waiting List</li>
                </Link>
                <Link to="/menu">
                    <li className="navItem">Menu</li>
                </Link>
                <Link to="/sales">
                    <li className="navItem">Sales</li>
                </Link>
            </ul>
            
        </div>
    )
}

export default NavBar;