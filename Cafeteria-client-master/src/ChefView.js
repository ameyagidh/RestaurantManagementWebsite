import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Stepper } from 'react-form-stepper';
import { CardActionArea, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { CardContent } from "semantic-ui-react";
const { REACT_APP_BACKEND_CONN } = process.env;

function ChefView(props){

    const [tableData,setTableData] = React.useState([]);
    const [shouldFetch,setShouldFetch] = React.useState(true);

    function clicked(event, table){
        var tableDetails;
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].tableID === table) {
                tableDetails = tableData[i]
            }
        }
        if(event.target.firstChild && event.target.firstChild.data)
            axios.put(`${REACT_APP_BACKEND_CONN}/changeStatus/${table}/${event.target.firstChild.data}`, tableDetails).then(res => {
                setShouldFetch(true)
            })
    }   

    useEffect(() => {
        const fetchData = async() =>{ 
            axios.get(`${REACT_APP_BACKEND_CONN}/chefView`).then(res => {
            setShouldFetch(false);
            setTableData(res.data)
        })}
        if(shouldFetch){
            fetchData()
        }
    }, [shouldFetch])

    return(
        <div style={{marginLeft: '12%', marginTop: '10px'}}>
            <Grid container spacing={2}>
                {tableData.map((row,i)=>{
                    return(
                        <Grid key={i} variant="outlined" style={{ border: "1px solid lightgrey", borderRadius: "15px", marginRight: "4%", marginBottom:"3%"}} spacing={2} item xs={3}>
                            <Card variant="outlined" style={{pointerEvents: 'none', transform: 'translateY(-5px) !important', justifyContent: "space-between"}}>
                                <CardActionArea>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Typography style={{fontFamily: "Verdana", textAlign: "left"}} gutterBottom variant="h5">
                                    {row.name}
                                </Typography>
                                <Typography style={{textAlign:"right", border:"2px solid black", borderRadius: "20px", padding: "5px"}} gutterBottom variant="h5">
                                   <b> T{row.tableID} </b>
                                </Typography>
                                </div>
                                <div>
                                <Stepper style={{pointerEvents: "auto", padding: "0px", display: "flex", cursor: "pointer"}}
                                    steps={[{ label: 'Order Placed' }, { label: 'Preparation' }, { label: 'Food Served' }]}
                                    activeStep={row.foodStatus} onClick={(e)=> {clicked(e, row.tableID)}}
                                />
                                </div>
                                    <CardContent>
                                    <div style={{ textAlign: "center" }}>
                                        <TableContainer style={{overflow:"auto", overflowX: "hidden", width:"95%",marginTop:"2%", height: "300px"}} component={Paper}>
                                        <Table style={{width:"95%", height: "max-content" }} aria-label="spanning table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><Typography ><b>Dish Name</b></Typography></TableCell>
                                                    <TableCell ><Typography ><b>Quantity</b></Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                        {row.order.map((order, key)=>{
                                            return (
                                            <TableRow key={i}>
                                                <TableCell><Typography>{order.dish}</Typography></TableCell>
                                                <TableCell ><Typography style={{textAlign: 'center'}}>{order.quantity}</Typography></TableCell>
                                            </TableRow>
                                            )
                                        })}
                                        </TableBody>
                                        </Table>
                                        </TableContainer>
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

export default ChefView;

