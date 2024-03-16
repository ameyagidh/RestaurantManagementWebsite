import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import CommentIcon from '@material-ui/icons/Comment';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';

const { REACT_APP_BACKEND_CONN } = process.env;

function WaitingList(props) {

    const [users,setUsers] = React.useState([]);
    const [name,setName] = React.useState('');
    const [partySize,setPartySize] = React.useState('');
    const [comments,setComments] = React.useState('');
    const [shouldFetch,setShouldFetch] = React.useState(true)
    const [shouldAllowSelect,setShouldAllowSelect] = React.useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        if(!name || !partySize)
            return;
        var date, TimeType, hour, minutes, fullTime;
        date = new Date();
        hour = date.getHours(); 
        if(hour <= 11)
            TimeType = 'AM';
        else
            TimeType = 'PM';
        if( hour > 12 )
            hour = hour - 12;
        if( hour === 0 )
            hour = 12;
    
        minutes = date.getMinutes();
        if(minutes < 10)
            minutes = '0' + minutes.toString();
        
        fullTime = hour.toString() + ':' + minutes.toString() +' '+ TimeType.toString();
        axios.get(`${REACT_APP_BACKEND_CONN}/counter`).then((res)=>{
            var count = parseInt(res.data.count)+1;
            const custData = {
                name: name,
                partySize: partySize,
                comments: comments,
                id:count,
                time:fullTime
            }
            axios.put(`${REACT_APP_BACKEND_CONN}/waiting-list/`,{custData}).then(()=>                
              axios.put(`${REACT_APP_BACKEND_CONN}/counter/${count}`).then(()=> {
                setPartySize('');
                setComments('');
                setName('')
                setShouldFetch(true);
              })
            )})
        
    }
    function seatFunction(data){

    var date, TimeType, hour, minutes, fullTime;
    date = new Date();
    hour = date.getHours(); 
    if(hour <= 11)
      TimeType = 'AM';
    else
      TimeType = 'PM';
    if( hour > 12 )
      hour = hour - 12;
    if( hour === 0 )
        hour = 12;

    minutes = date.getMinutes();
    if(minutes < 10)
      minutes = '0' + minutes.toString();
   
    fullTime = hour.toString() + ':' + minutes.toString() +' '+ TimeType.toString();

    axios.delete(`${REACT_APP_BACKEND_CONN}/waiting-list/${data.id}`).then(()=>{
        axios.put(`${REACT_APP_BACKEND_CONN}/tables/`,{
            isEmpty: false,
            name: data.name,
            order:[],
            tableID:props.table,
            capacity:props.capacity,
            viewCheck:false,
            foodStatus: "Request Received",
            time: fullTime,
            checkID:data.id,
            tempOrder:[],
        }).then(()=>{
          axios.get(`${REACT_APP_BACKEND_CONN}/tables`)
              .then(res => {
                localStorage.setItem("tableData",JSON.stringify(res.data));
                props.selectUser()
                props.onChildClick()
                setShouldFetch(true)
              })
        })
    })
    }
    useEffect(() => {
        const fetchUsers = async() =>{
            if(props.shouldAllowSelect){
                axios.get(`${REACT_APP_BACKEND_CONN}/waiting-list/${props.capacity}`)
                    .then(res => {
                    setUsers(res.data)
                })
            }
            else{
                axios.get(`${REACT_APP_BACKEND_CONN}/waiting-list/0`)
                    .then(res => {
                      setUsers(res.data)
                })
            }
            setShouldFetch(false)
        }
        if(shouldFetch){
            setShouldAllowSelect(props.shouldAllowSelect)
            fetchUsers()
        }
    }, [shouldFetch])

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

    return (
        <>
        <div className="rows">
            <div className=" mainMenu">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="spanning table" style={{padding:"0px",width:"90%"}}>
                        <TableHead >
                        <TableRow  className="sale">
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">ID</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Name</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Group Size</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Arrival Time</Typography></TableCell>
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Comments</Typography></TableCell>    
                            <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Seat Customer</Typography></TableCell>                                            
                        </TableRow>
                        </TableHead>
                        <TableBody>
                    {users.map((row)=>{
                        if(row!==undefined)
                        return (
                            <TableRow key={row.name}>
                                <TableCell align="center"><Typography variant="h6">{row.id}</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">{row.name}</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">{row.partySize}</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">{row.time}</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">{row.comments}</Typography></TableCell>
                                {shouldAllowSelect ? (
                        <TableCell align="center"><Button style={{align:"center"}} variant="contained" onClick={() => seatFunction({id:row.id,name:row.name})}>Select</Button></TableCell>
      ) : (
        <TableCell align="center"><Button style={{align:"center"}} variant="contained" disabled>Select</Button></TableCell>
      )} 
      </TableRow>
                        );
                    })}
                
                    </TableBody>
                    </Table>
                    </TableContainer>
            </div>
            <div className="addMenu">
            <div className="heading-box">
                <h1 className="my-heading">Add New Customer</h1>
                </div>
                <form className={classes.root} onSubmit={onSubmit} className="form">
                <TextField
              margin="normal"
              className="input-field"
              placeholder="Enter Customer Name"
              variant="outlined"
              name="custName"
              value={name}
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              className="input-field"
              placeholder="Enter Group Size"
              variant="outlined"
              name="grpSize"
              value={partySize}
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setPartySize(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupIcon />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              className="input-field"
              placeholder="Enter Comments"
              variant="outlined"
              name="comments"
              value={comments}
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setComments(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CommentIcon />
                  </InputAdornment>
                )
              }}
            />

                    <Button onClick={onSubmit} variant="contained" style={{marginTop:"5%",marginLeft:"30%"}}>Submit</Button>
                </form>
            </div>
        </div>
        </>

    )
}

export default WaitingList;