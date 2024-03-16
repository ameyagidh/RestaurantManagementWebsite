import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import InputAdornment from '@material-ui/core/InputAdornment';
import MoneyIcon from '@material-ui/icons/Money';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { useHistory } from 'react-router-dom';

const { REACT_APP_BACKEND_CONN } = process.env;

function Pay(props){
    const history = useHistory()

    const [initial,setInitial] = React.useState(localStorage.getItem("total") );
    const [cash,setCash] = React.useState(0);
    const [card,setCard] = React.useState( localStorage.getItem("total") );
    const [tip,setTip] = React.useState(0);

    const total = localStorage.getItem("total");

    function handleChange (e) {
        var tip = 0;
        if(e.target.value !== 0)
            tip = e.target.value;
        var sum = parseFloat(total)+parseFloat(tip);
        setInitial(sum);
        setCard(sum-cash);
    }
    function handleCashChange(e){
        setCash(e.target.value);
        var cashVal = 0;
        if(e.target.value !== 0)
            cashVal = e.target.value;
        setCard(initial-cashVal);
    }
    function handleCardChange(e){
        setCard(e.target.value);
        var cardVal = 0;
        if(e.target.value !== 0)
            cardVal = e.target.value;
        setCash(initial-cardVal);
    }
    function handleSubmit(e){
        e.preventDefault()

        var data = JSON.parse(localStorage.getItem("menu") || "[]");
        var orders = JSON.parse(localStorage.getItem("order") || "[]");
        for(var i=0;i<orders.length;i++){
            const order = orders[i]

            for(var j=0;j<data.length;j++){
                if(data[j].name === order.dish){
                    const menuData = {
                        name:data[j].name,
                        totalSales:parseInt(order.quantity)+parseInt(data[j].totalSales),
                        id: data[j].id
                    }
                    axios.put(`${REACT_APP_BACKEND_CONN}/menu/`,{menuData}).then(()=>{
                      axios.get(`${REACT_APP_BACKEND_CONN}/menu`)
                      .then(res => {
                        localStorage.setItem("menu",JSON.stringify(res.data));
                      })
                    })

                }
            }
          }
                
        axios.put(`${REACT_APP_BACKEND_CONN}/tables/`,{tableID:localStorage.getItem("table"),viewCheck:true,order: JSON.parse(localStorage.getItem("order") || "[]") }).then(()=>{
          axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
                .then(res => {
                  localStorage.setItem("tableData",JSON.stringify(res.data));
                  if(props.changeView !== undefined)
                    props.onPayment(res.data);
                  else
                    history.goBack();
                });
        })
    }
    return(
        <div style={{ marginLeft:"3%" }}>
            <div className="pay-header">
                <Typography variant="h5" display="inline">Order of: </Typography><Typography variant="h5" display="inline" color="secondary">{ JSON.parse(localStorage.getItem("name")) }</Typography><br />
                <Typography variant="h5" display="inline">Table </Typography><Typography variant="h5" display="inline" color="secondary">{ localStorage.getItem("table") }</Typography><br />
                <Typography variant="h5" display="inline">Check </Typography><Typography variant="h5" display="inline" color="secondary">#{ localStorage.getItem("checkID") }</Typography><Typography variant="h5" display="inline"> @ Time </Typography> <Typography variant="h5" display="inline" color="secondary">{ JSON.parse(localStorage.getItem("time")) }</Typography>
            </div>
            <form>
            <TextField
                margin="normal"
                className="input-field"
                placeholder={tip === 0 ? "Enter Tip Amount" : ""}
                variant="outlined"
                name="dishName"
                style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
                onInput={ e=>setTip(e.target.value)}
                value={tip}
                onChange={handleChange}
                required
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MoneyIcon />
                        </InputAdornment>
                    )
                }}
            />

            <TextField
              margin="normal"
              className="input-field"
              placeholder="Enter Cash Value"
              variant="outlined"
              name="dishName"
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setCash(e.target.value)}
              value={cash}
              onChange={handleCashChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              className="input-field"
              placeholder="Enter Card Value"
              variant="outlined"
              name="dishName"
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setCard(e.target.value)}
              value={card}
              onChange={handleCardChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon />
                  </InputAdornment>
                )
              }}
            />
            
            <div className="pay-total" style={{ backgroundColor: "white" }}>
            <Typography  variant="h5"  display="inline"> Pay For </Typography><Typography  display="inline" variant="h5" >$ {initial}</Typography> <Button onClick={handleSubmit} variant="contained" style={{marginLeft:"10%"}}>Pay</Button>
            </div>
            </form>
        </div>
    )
}

export default Pay;