import React from 'react';
import axios from 'axios';
import Modal from 'react-modal'
import {Link} from 'react-router-dom'
import WaitingList from './WaitingList';
import Button from '@material-ui/core/Button';

const { REACT_APP_BACKEND_CONN } = process.env;

function TableView(props){
    const [tables,setTables] = React.useState(JSON.parse(localStorage.getItem("tableData") || "[]" ));
    const [modalShow, setModalShow] = React.useState(false);
    const [clickedTable,setCLickedTable] = React.useState(0);
    const [showWaiting,setShowWaiting] = React.useState(false);
    const [status,setStatus] = React.useState("n");
    const [refresh,setRefresh] = React.useState(true);
    const [capacity,setCapacity] = React.useState(0);
  
    React.useEffect(() => {

      const fetchData = async() => {
        setTables(JSON.parse(localStorage.getItem("tableData") || "[]" ))
        setRefresh(false)
      }
      if(refresh) 
        fetchData()
      
    },[props, refresh, tables]);

    function updateColour() {
      setRefresh(true);
    }
    function selectUser() {
      props.selectUser();
      setRefresh(true);
    }

      function cleanFunction(){
        setModalShow(false);
        axios.put(`${REACT_APP_BACKEND_CONN}/cleanTable/${clickedTable}`).then(()=>{
          axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
          .then(res => {
            localStorage.setItem("tableData",JSON.stringify(res.data));
            setRefresh(true)
          })
        })
      }
      if(showWaiting && status ==="Waiting")
      return(
        <Modal ariaHideApp={false} isOpen={showWaiting} onRequestClose={()=>setShowWaiting(false)} 
        style={ 
          { 
            overlay: {
              backgroundColor: 'grey' 
            }, 
            content: {
              width:'auto',
              height: 'auto',
              alignContent:'center'
            }
          }
          }>
          <WaitingList shouldAllowSelect={true} capacity={capacity} selectUser={selectUser} onChildClick={updateColour} table={clickedTable} />
          <Button onClick={()=>setModalShow(false)} variant="contained">Close</Button>
        </Modal>
      );
      if(modalShow && status === "Billed")
      return(
      <Modal ariaHideApp={false} isOpen={modalShow} onRequestClose={()=>setModalShow(false)} 
        style={ 
          { 
            overlay: {
              backgroundColor: 'grey' 
            }, 
            content: {
              width:'20%',
              height: '20%',
              alignContent:'center',
              marginLeft: '35%',
              marginTop: '12%'
            }
          }
          }>
          <h2>Table #{clickedTable} is {status}</h2>
          <Button size="small" variant="contained"><Link style={{ color:"black",textDecoration:"none"}} to={{
  pathname: '/order',
  table:clickedTable,
  tableData:props.tables,
  isBilled:true
}}>View Orders</Link></Button>
          <Button size="small" variant="contained" onClick={cleanFunction}>Clean Up</Button>
          <Button size="small" onClick={()=>setModalShow(false)} variant="contained">Close</Button>
        </Modal>
        );
        else if(modalShow && status === "Empty")
        return(
        <Modal ariaHideApp={false} isOpen={modalShow} onRequestClose={()=>setModalShow(false)} 
        style={ 
          { 
            overlay: {
              backgroundColor: 'grey' 
            }, 
            content: {
              width:'20%',
              height: '20%',
              alignContent:'center',
              marginLeft: '37%',
              marginTop: '12%'
            }
          }
          }>
          <h2>Table #{clickedTable} is {status}</h2>
          
          <Button variant="contained" onClick={()=>{setShowWaiting(true); setStatus("Waiting"); }}>Seat Table</Button>
          <Button onClick={()=>setModalShow(false)} variant="contained">Close</Button>
        </Modal>
        );
        else if(modalShow && status === "Occupied")
        return(
        <Modal ariaHideApp={false} isOpen={modalShow} onRequestClose={()=>setModalShow(false)} 
        style={ 
          { 
            overlay: {
              backgroundColor: 'grey' 
            }, 
            content: {
              width:'20%',
              height: '20%',
              alignContent:'center',
              marginLeft: '37%',
              marginTop: '12%'
            }
          }
          }>
          <h2>Table #{clickedTable} is {status}</h2>
          <Button variant="contained"><Link style={{ color:"black",textDecoration:"none"}} to={{
  pathname: '/order',
  table:clickedTable,
  tables:props.tables,
  tableData:props.tables,
  isBilled:false
}}>View Orders</Link></Button>

          <Button onClick={()=>setModalShow(false)} variant="contained">Close</Button>
        </Modal>
        );
        else if(tables && tables.length>0)
          return (
            <div className = "tableCol">
            {[1,2,3].map(function(object,i){
                const val = props.start+object;

                    if(tables[val-1].isEmpty)
                      return <button key ={i} onClick={() => {setModalShow(true); setCLickedTable(val); setCapacity(tables[val-1].capacity); setStatus("Empty")}} className = "unOccupiedBtn"><h1>T{val}</h1><h3>Capacity: {tables[val-1].capacity}</h3></button>; 
                    else if(tables[val-1].viewCheck)
                      return <button key ={i} onClick={() => {setModalShow(true); setCLickedTable(val); setCapacity(tables[val-1].capacity); setStatus("Billed")}} className = "cleanBtn"><h1>T{val}</h1><h3>Capacity: {tables[val-1].capacity}</h3></button>; 
                    return <button key ={i} onClick={() => {setModalShow(true); setCLickedTable(val); setCapacity(tables[val-1].capacity); setStatus("Occupied")}} className = "occupiedBtn"><h1>T{val}</h1><h3>Capacity: {tables[val-1].capacity}</h3></button>;
                
              })}
              </div>
          )
        else
            return(
              <h1>Loading...</h1>
            );       
    
}

export default TableView;

