import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import axios from 'axios';
import Pay from './Pay';
import OrderMenu from './OrderMenu';
import Button from '@material-ui/core/Button';
import AddSharpIcon from '@material-ui/icons/AddSharp';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp';
import { Typography } from '@material-ui/core';

const { REACT_APP_BACKEND_CONN } = process.env;

function Order(props){
    const [orders,setOrders] = React.useState(JSON.parse(localStorage.getItem("order") || "[]"));
    const [renderPay,setRenderPay] = React.useState(false);
    const [isRefresh,setIsRefresh] = React.useState(false);
    const [isValid,setIsValid] = React.useState(false);
    const [clickMenu,setClickMenu] = React.useState(false);
    const [len,setLen] = React.useState(0);

    var val = 0;
    React.useEffect(() => {
        const fetchUsers = async() =>{
            if (props.location.table) {
                localStorage.setItem("isBilled",props.location.isBilled);
                localStorage.setItem("table",props.location.table);
            }
            var tableData = JSON.parse(localStorage.getItem("tableData") || "[]" );
            var currTab = tableData[localStorage.getItem("table")-1];

                localStorage.setItem("users",JSON.stringify(currTab));
                localStorage.setItem("time",JSON.stringify(currTab.time));
                localStorage.setItem("checkID",JSON.stringify(currTab.checkID));
                localStorage.setItem("name",JSON.stringify(currTab.name));

                if(JSON.parse(localStorage.getItem("isBilled")) === true){
                    localStorage.setItem("order",JSON.stringify(currTab.order));
                    setOrders(JSON.parse(localStorage.getItem("order") || "[]"));
                    setClickMenu(false)
                    setIsValid(false)
                    setLen(currTab.order.length);
                }
                else{
                    localStorage.setItem("order",JSON.stringify(currTab.tempOrder));
                    setOrders(JSON.parse(localStorage.getItem("order") || "[]"))
                    setClickMenu(true)
                    setLen(currTab.tempOrder.length);
                    if(currTab.tempOrder.length>0)
                        setIsValid(true)
                }
                
            if(JSON.parse(localStorage.getItem("isBilled")) === true)
                setIsValid(false)
            setIsRefresh(true);
        }
        if(!isRefresh){
            fetchUsers()
        }
    }, [props,isRefresh])

    function handleRefresh(){
        setIsRefresh(false);        
    }
    function handleAdd(name,id){
        if(JSON.parse(localStorage.getItem("isBilled")) === true)
            return;
        var tableData = JSON.parse(localStorage.getItem("tableData") || "[]" );
        var currTab = tableData[localStorage.getItem("table")-1];
        var data = currTab.tempOrder;
        for(var i=0;i<data.length;i++){
            if(data[i].id === id){
                data[i].quantity += 1;
                break;
            }
        }

        axios.put(`${REACT_APP_BACKEND_CONN}/tables`,{
            tableID:localStorage.getItem("table"),
            tempOrder:data
        })
        .then(()=>{
            axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
            .then(res => {
                localStorage.setItem("tableData",JSON.stringify(res.data));
                setIsRefresh(false)
            });
        })
    }
    function handleSub(name){
        if(JSON.parse(localStorage.getItem("isBilled")) === true)
            return;
        var tableData = JSON.parse(localStorage.getItem("tableData") || "[]" );
        var currTab = tableData[localStorage.getItem("table")-1];
            var data = currTab.tempOrder;
            for(var i=0;i<data.length;i++){
                if(data[i].dish === name){
                    data[i].quantity -= 1;
                    if(data[i].quantity === 0){
                        data = data.filter((d) => d.dish !== name);
                        setLen(len-1);
                        if(len<0)
                            setIsValid(false)
                    }
                }
            }
            axios.put(`${REACT_APP_BACKEND_CONN}/tables`,{
                tableID:localStorage.getItem("table"),
                tempOrder:data
            }).then(()=>{
                axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
                .then(res => {
                  localStorage.setItem("tableData",JSON.stringify(res.data));
                  setIsRefresh(false)
                })
            });
    }

      function ccyFormat(num) {
        var total = 0.05*num;
        return Math.ceil(total)
      }

    if(!renderPay)
    return(
        <div className="main">
        <div className="homeRow">
            <div className="homeCol">
                <OrderMenu allowClick={clickMenu} refresh={handleRefresh} />
            </div>
            <div style={{width:"60%"}} className="orderCol">
                <Typography variant="h5" display="inline">Table </Typography><Typography variant="h5" display="inline" color="secondary">{ localStorage.getItem("table") }</Typography><br />
                <Typography variant="h5" display="inline">Order of: </Typography><Typography variant="h5" display="inline" color="secondary">{ JSON.parse(localStorage.getItem("name")) }</Typography>

                <TableContainer style={{overflow:"hidden", width:"95%",marginTop:"2%"}} component={Paper}>
                    <Table style={{width:"95%"}} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography style={{ fontWeight: 600 }} variant="h5">Dish Name</Typography></TableCell>
                                <TableCell ><Typography style={{ fontWeight: 600 }} variant="h5">Quantity</Typography></TableCell>
                                <TableCell ><Typography style={{ fontWeight: 600 }} variant="h5">Total</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                    
                {orders.map((user,i)=>{
                        if(user){
                            val = val+parseInt(user.salePrice)*parseInt(user.quantity)
                            return (
                                <TableRow key={i}>
                                    <TableCell><Typography variant="h6">{user.dish}</Typography></TableCell>
                                    <TableCell ><AddSharpIcon className="iconAdd"  onClick={()=>handleAdd(user.dish,user.id)}></AddSharpIcon><Typography variant="h6" display="inline">{user.quantity}</Typography><RemoveSharpIcon className="iconRem" onClick={()=>handleSub(user.dish)}></RemoveSharpIcon></TableCell>
                                    <TableCell ><Typography variant="h6">Rs. {user.salePrice*user.quantity}</Typography></TableCell>
                                </TableRow>
                                
                            );
                        }
                        return null
                    })}
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={1}><Typography color="secondary" variant="h5">Subtotal</Typography></TableCell>
                        <TableCell><Typography color="primary" variant="h5">Rs. {val}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Typography color="secondary" variant="h5">GST @ 5%</Typography></TableCell>
                        <TableCell><Typography color="primary" variant="h5">Rs. {ccyFormat(val)}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Typography color="secondary" variant="h5">Total</Typography></TableCell>
                        <TableCell><Typography color="primary" variant="h5">Rs. {ccyFormat(val)+val}</Typography></TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
                {isValid ? 
                    <Button style={{marginLeft:"50%", marginTop:"2%" }} onClick={()=>{setRenderPay(true); { localStorage.setItem("total",Math.ceil(1.05*val)) } }} variant="contained">Pay</Button>
                    : <Button style={{marginLeft:"50%", marginTop:"2%" }} variant="contained" disabled>Pay</Button>
                }
            </div>
        </div>
        </div>
    );
    
    else
    return(
        <div className="main">
        <div className="homeRow">
            <div className="homeCol">
                <OrderMenu allowClick={false} refresh={handleRefresh} table={localStorage.getItem("table")} />
            </div>
            <div className="homeCol">
            <Pay />

            </div>
        </div>
        </div>
    )
}

export default Order;