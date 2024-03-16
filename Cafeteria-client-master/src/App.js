import './index.css';
import React from 'react'
import NavBar from './NavBar';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Home from './Home';
import Menu from './Menu';
import Sales from './Sales';
import WaitingList from './WaitingList';
import Pay from './Pay';
import Order from './Order';
import axios from 'axios';
import ChefView from './ChefView';

const {REACT_APP_BACKEND_CONN}  = process.env

export default function App(){

  const [checkItem,setCheckItem] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [tables, setTables] = React.useState([]);

  const fetchUsers = async() =>{
    axios.get(`${REACT_APP_BACKEND_CONN}/menu`)
    .then(res => {
      localStorage.setItem("menu",JSON.stringify(res.data));
    })
    axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
        .then(res => {
          localStorage.setItem("tableData",JSON.stringify(res.data));
          setTables(res.data);
          setRefresh(false)
    })}
  React.useEffect(() => {
    if(refresh)
      fetchUsers()
  }, [tables, checkItem, refresh])

  function selectUser(){
    setRefresh(true)
  }
  function showCheck(){
    setRefresh(true)
    setCheckItem(checkItem => !checkItem);
  }

  function disableCheck(){
    setRefresh(true)
    setCheckItem(checkItem => !checkItem);
  }
  const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  if(isMobile)
    return <div>Sorry, this website is only available on desktop devices.</div>
  else{
    return (
      <Router>
          <NavBar showCheck={showCheck} />
            <Switch>
              <Route exact path="/">
                <Home tables={localStorage.getItem("tableData")} disableCheck={disableCheck} selectUser={selectUser} checkItem={checkItem} />
              </Route>
              <Route path="/menu">
                <Menu />
              </Route>
              <Route path="/sales">
                <Sales />
              </Route>
              <Route path="/waiting-list">
                <WaitingList shouldAllowSelect={false}/>
              </Route>
              <Route path="/pay">
                <Pay />
              </Route>
              <Route path="/order" component={Order}/>
              <Route path="/chef-view">
                <ChefView />
              </Route>
            </Switch>
      </Router>
    );
}
}