import React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';

const { REACT_APP_BACKEND_CONN } = process.env;

function OrderMenu(props){
    const [menu,setMenu] = React.useState([]);

    React.useEffect(() => {
          const restoreState = async () => {
            
            setMenu(JSON.parse(localStorage.getItem("menu") || "[]" ));
          }
            restoreState();
          
        },[props]);
    function handleClick(name,price,image,id){
        if(!props.allowClick)
            return;
        var temp = JSON.parse(localStorage.getItem("tableData") || "[]")[localStorage.getItem("table")-1].tempOrder;
            var obj = {
                dish:name,
                imageUrl:image,
                salePrice:price,
                quantity:1,
                id
            }
            for(var i=0;i<temp.length;i++){
                if(temp[i].dish === name){
                    temp[i].quantity += 1;
                    axios.put(`${REACT_APP_BACKEND_CONN}/tables`,{
                        tableID:localStorage.getItem("table"),
                        tempOrder:temp
                    }).then(()=>{
                        axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
                        .then(res => {
                            localStorage.setItem("tableData",JSON.stringify(res.data));
                            props.refresh()
                        });
                    });

                    return;
                }
            }
            temp.push(obj);
            axios.put(`${REACT_APP_BACKEND_CONN}/tables`,{
                tableID:localStorage.getItem("table"),
                tempOrder:temp
            }).then(()=>{
                axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
                    .then(res => {
                        localStorage.setItem("tableData",JSON.stringify(res.data));
                        props.refresh()
                    });
            });
                    
    }
    return(
        <div className="card-deck">
            <Grid style={{maxHeight:"1%"}} container spacing={3}>
                {menu.map((row,i)=>{
                    return(
                        <Grid key={i} className="grid-style" item xs={4}>
                            <Card onClick={()=>{handleClick(row.name,row.salePrice,row.imageUrl,row.id)}} >
                                <CardActionArea>
                                    <CardMedia height="160" component="img" alt="" image={row.imageUrl} />
                                    <CardContent>
                                    <div style={{ textAlign: "center" }}>
                                        <Typography gutterBottom variant="h5">
                                            {row.name}
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary">
                                            Rs. {row.salePrice}
                                        </Typography>
                                    </div>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

        </div>
    )
}

export default OrderMenu;

