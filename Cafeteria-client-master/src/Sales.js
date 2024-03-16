import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

function Sales(props){
    const [sales, setSales] = useState()
    const menus = JSON.parse(localStorage.getItem("menu") || "[]" );
    var num = 0;
    var items = 0;
    var profit = 0;
    useEffect(() => {
            const menuData = menus;
            menuData.sort(function(a, b) {
                return b.profit - a.profit;
            });
            setSales(menuData)
    }, [])
    const useStyles = makeStyles({
        image: {
            width: 100,
            height: 100
          },
          cell: {
            padding: 2
          }
      });
    const classes = useStyles();

    if(sales)
    return(
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="spanning table" style={{padding:"0px",width:"90%"}}>
                    <TableHead >
                    <TableRow  className="sale">
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Ranking</Typography></TableCell>
                        <TableCell  align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Item Name</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Item Image</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Total Sold</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Sale Price</Typography></TableCell>                        
                        <TableCell align="center" style={{width:"10%"}}><Typography style={{ fontWeight: 600 }} variant="h5">Cost</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Profit</Typography></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                {sales.map((row)=>{
                    num = num+1;
                    profit += row.profit
                    items += row.totalSales
                    
                    return (
                        <TableRow key={row.name}>
                            <TableCell align="center"><Typography variant="h6">{num}</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">{row.name}</Typography></TableCell>
                            <TableCell align="center" className={classes.cell}>
                                <Box display="flex" justifyContent="center" bgcolor="background.paper">
                                <Avatar
                                    variant="rounded"
                                    className={classes.image}
                                    src={row.imageUrl}
                                    alt=""
                                />
                                </Box>
                            </TableCell>
                            <TableCell align="center"><Typography variant="h6">{row.totalSales}</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Rs. {row.salePrice}</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Rs. {row.costPrice}</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Rs. {row.profit}</Typography></TableCell>
                        </TableRow>
                    );
                })}
                <TableRow >
                    <TableCell rowSpan={2} />
                    <TableCell rowSpan={2} />
                    <TableCell rowSpan={2} />
                    <TableCell rowSpan={2} />
                    <TableCell colSpan={2}>
                        <Typography variant="h5" color="secondary">
                        Total Items Sold
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="h5" color="primary">
                        {items}
                        </Typography>
                    </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant="h5" color="secondary">
                        Total Profit
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="h5" color="primary">
                        Rs. {profit}
                        </Typography>
                    </TableCell>
                    </TableRow>
            
                </TableBody>
                    </Table>
                    </TableContainer>
        </div>

    )
    else
        return(
            <div>
                <h1>Loading</h1>
            </div>
)
}


export default Sales;