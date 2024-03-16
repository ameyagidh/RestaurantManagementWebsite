import React,{useEffect} from 'react';
import { app } from './base';
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
import Button from '@material-ui/core/Button';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import MoneyIcon from '@material-ui/icons/Money';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


const { REACT_APP_BACKEND_CONN } = process.env;

function Menu(props) {
    const [fileUrl,setFileUrl] = React.useState('');
    const [fileName,setFileName] = React.useState('');
    const [menu,setMenu] = React.useState([]);
    const [dishName,setDishName] = React.useState("");
    const [salePrice,setSalePrice] = React.useState('');
    const [costPrice,setCostPrice] = React.useState('');
    const [shouldFetch,setShouldFetch] = React.useState(true);
    const [uploading,setUploading] = React.useState(false);
    const [edit, setEdit] = React.useState('');
    const [clickedID, setClickedID] = React.useState('');

    var count = 0;
    const onFileChange = async (e) => {
        setFileName(e.target.value);
        setUploading(true);
        const file = e.target.files[0];
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setFileUrl(await fileRef.getDownloadURL())
        setUploading(false)
    }
    function onSubmit(e) {
        e.preventDefault();
        if(!dishName || !salePrice || !costPrice || !fileUrl)
            return;
        const menuData = {
            name: dishName,
            imageUrl: fileUrl,
            salePrice: salePrice,
            costPrice: costPrice,
            totalSales:0,
            id: ''
        }

        if(edit.length > 0){
          menuData.id = clickedID;
          axios.put(`${REACT_APP_BACKEND_CONN}/update-menu`,{menuData}).then(()=>{
            axios.get(`${REACT_APP_BACKEND_CONN}/menu`)
              .then(res => {
                localStorage.setItem("menu",JSON.stringify(res.data));
                setShouldFetch(true)
                setDishName('');
                setSalePrice('');
                setCostPrice('');
                setFileUrl('')
                setFileName('')
                setEdit('')
              })
          })
        }
        else{
          menuData.id = uuidv4();
          axios.put(`${REACT_APP_BACKEND_CONN}/add-menu`,{menuData}).then(()=>{
            axios.get(`${REACT_APP_BACKEND_CONN}/menu`)
              .then(res => {
                localStorage.setItem("menu",JSON.stringify(res.data));
                setShouldFetch(true)
                setDishName('');
                setSalePrice('');
                setCostPrice('');
                setFileUrl('')
                setFileName('')
              })
          })
        }
    }
    function editClick(idx,name,price,costPrice,url,id){
      setDishName(name)
      setCostPrice(costPrice)
      setSalePrice(price)
      setFileUrl(url)
      setFileName(name)
      setEdit(idx+'')
      setClickedID(id+'')
    }
    function deleteClick(id){
      axios.delete(`${REACT_APP_BACKEND_CONN}/${id}`).then(()=>{
          axios.get(`${REACT_APP_BACKEND_CONN}/menu`)
            .then(res => {
              localStorage.setItem("menu",JSON.stringify(res.data));
              setShouldFetch(true)
            })
      })
    }
    useEffect(() => {
        const fetchMenu = async() =>{
            setMenu(JSON.parse(localStorage.getItem("menu") || "[]" ));
            setShouldFetch(false)
        }
        if(shouldFetch){
            fetchMenu()
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
          title: {
            padding: 2
          },
          form: {
            margin: 0
          },
          upload: {
            display: 'none'
          },
          uploadBtn: {
            width: "80%",
          },
          button: {
            padding: 1,
            height : "200%"
          },
          imageName: {
            padding: 1,
            fontStyle: 'italic',
            color: 'gray'
          }
      });
    const classes = useStyles();
    return (
        <div className="rows">
            <div className=" mainMenu">
            <TableContainer style={{overflow: 'hidden'}} component={Paper}>
                <Table className={classes.table} aria-label="spanning table" style={{ padding:"0px",width:"95%"}}>
                    <TableHead >
                    <TableRow  className="sale">
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Sr. No</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Item Name</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Item Image</Typography></TableCell>
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Sale Price</Typography></TableCell>  
                        <TableCell align="center"><Typography style={{ fontWeight: 600 }} variant="h5">Edit</Typography></TableCell>                        
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {menu.map((row,idx)=>{
                        count++;
                        return (
                            <TableRow key={idx}>
                            <TableCell align="center"><Typography variant="h6">{count}</Typography></TableCell>
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
                            <TableCell align="center" ><Typography variant="h6">Rs. {row.salePrice || "Sale Price" }</Typography></TableCell>
                            <TableCell className="edit-icons">
                                <EditIcon className="edit-icon icon" onClick={()=>editClick(idx,row.name,row.salePrice,row.costPrice,row.imageUrl,row.id)}></EditIcon>
                                <DeleteIcon className="delete-icon icon" onClick={()=>deleteClick(row.id)}></DeleteIcon>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    
                </TableBody>
                    </Table>
                    </TableContainer>
            </div>
            <div className=" addMenu">
              <div className="App">
                <h1 className="my-heading">Add New Menu</h1>
                </div>
                <div className="input-icons">
                <form onSubmit={onSubmit} className="form">
                <TextField
              margin="normal"
              className="input-field"
              variant="outlined"
              name="dishName"
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setDishName(e.target.value)}
              required
              value={dishName || "Dish Name"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantMenuIcon />
                  </InputAdornment>
                )
              }}
            />
                    <TextField
              margin="normal"
              className="input-field"
              variant="outlined"
              name="dishName"
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setSalePrice(e.target.value)}
              required
              value={salePrice || "Sale Price"}
              name="salePrice"
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
              variant="outlined"
              name="costPrice"
              style={{textAlign:"right",width:"100%",backgroundColor:"white"}}
              onInput={ e=>setCostPrice(e.target.value)}
              value={costPrice || "Cost Price"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalAtmIcon />
                  </InputAdornment>
                )
              }}
            />
            <Box mt={2}>
              <input
                className={classes.upload}
                accept="image/*"
                onChange = {onFileChange}
                id="image"
                name="image"
                type="file"
              />
              <label htmlFor="image">
              <Button
                className={classes.uploadBtn}
                variant="outlined"
                color="default"
                component="span"
                size="large"
                fullWidth
                style={{ backgroundColor: 'white' }}
                >
                Menu Image Upload
            </Button>

                <Typography
                  variant="caption"
                  display="block"
                  className={classes.imageName}
                >
                {fileName}
                </Typography>
              </label>
            </Box>
            {uploading ? (
                <Typography color="secondary">Uploading...</Typography> ) : (
                  fileName.length>0?(<Typography color="secondary"> Uploaded Successfully</Typography>):<Typography color="secondary">No image uploaded</Typography>  )
            } 
            {uploading ? (
              <Button onClick={onSubmit} variant="contained" style={{marginTop:"5%",marginLeft:"30%"}} disabled>Submit</Button> ) : ( 
                fileName.length>0  ? (<Button onClick={onSubmit} variant="contained" style={{marginTop:"5%",marginLeft:"30%"}} >Submit</Button> ):( 
                  <Button onClick={onSubmit} variant="contained" style={{marginTop:"5%",marginLeft:"30%"}} disabled>Submit</Button> ))
            } 
                </form>
                </div>
            </div>
        </div>

    )
}

export default Menu;