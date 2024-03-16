import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


export function CheckItem(props){
    var id = localStorage.getItem("table")-1;

    const [users,setUsers] = React.useState(props.tables[id].tempOrder);
    const [isValid,setIsValid] = React.useState(false);

    var t = 0;
    React.useEffect(() => {
        const fetchUsers = async() =>{
            setUsers(props.tables[id].tempOrder);
            if(props.tables[id].tempOrder.length>0)
                setIsValid(true);
            else
                setIsValid(false);
        }
            fetchUsers()
        
    }, [props])
    function handleClick(){
        
        props.onPayClick(Math.ceil(1.05*t)); 
    }
    const useStyles = makeStyles({
        image: {
            width: 100,
            height: 100
          },
          cell: {
            padding: 2
          },
          root: {
            '& > *': {
              margin: "1%",
              width: '25ch',
            },
          },
      });
    const classes = useStyles();
    return(
        <div className=" mainMenu">
            <h2>Check { localStorage.getItem("checkID") } Table { localStorage.getItem("table") } at { JSON.parse(localStorage.getItem("time")) }</h2>
            <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="spanning table" style={{padding:"0px",width:"90%"}}>
                        <TableHead >
                        <TableRow  className="sale">
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Name</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Image</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Quantity</Typography></TableCell>    
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Sale Price</Typography></TableCell>                                            
                        </TableRow>
                        </TableHead>
                        <TableBody>
            
                {users.map((row)=>{
                    if(row){
                        var price = parseInt(row.quantity)*parseInt(row.salePrice);
                        t = t+price;
                        return (
                            <TableRow key={row.dish}>
                                <TableCell align="center"><Typography variant="h6">{row.dish}</Typography></TableCell>
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
                                <TableCell align="center"><Typography variant="h6">{row.quantity}</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">Rs. {price}</Typography></TableCell>
                            </TableRow>
                        );
                    }
                })}
                <TableRow >
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={2}>
                        <Typography variant="h5" color="secondary">
                        Sub Total
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="h5" color="primary">
                        Rs. {t}
                        </Typography>
                    </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant="h5" color="secondary">
                        GST @ 5%
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="h5" color="primary">
                        Rs. {Math.ceil(0.05*t)}
                        </Typography>
                    </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant="h5" color="secondary">
                        Total Amount
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                        <Typography variant="h5" color="primary">
                        Rs. {Math.ceil(1.05*t)}
                        </Typography>
                    </TableCell>
                    </TableRow>
            
                </TableBody>
                    </Table>
                    </TableContainer>
                    {isValid ? (
                        <Button style={{marginLeft:"45%",marginTop:"1%"}} variant="contained" onClick={handleClick}>Pay</Button>
      ) : (
        <Button style={{marginLeft:"45%",marginTop:"1%"}} variant="contained" disabled>Pay</Button>
      )} 
        </div>
    )
}

export default CheckItem;