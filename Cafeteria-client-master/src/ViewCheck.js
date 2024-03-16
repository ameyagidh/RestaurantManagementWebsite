import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';


export function ViewCheck(props){

    function handleClick(id,table,time){
        localStorage.setItem("table",table);
        localStorage.setItem("time",'"'+time+'"');
        localStorage.setItem("checkID",id);
        props.onChildClick({id:id,table:table ,time:time}); 
    }
    
    return (
        <div>
            {props.checkList && props.checkList.map(function(object, i){
                if(object.isEmpty === true || object.viewCheck === true)
                    return null;
                var tableNo,id,time;
                if(object.tableID!=null)
                    tableNo = object.tableID;
                if(object.checkID!=null)
                    id = object.checkID;
                if(object.time!=null)
                    time = object.time;
                return(
                    <div key={i} style={{marginBottom:"2%", textAlign: "center"}}>
                    <div className="checkRow">
                        <div className="checkCol">
                            <Typography variant="h5" color="secondary">Table {tableNo}</Typography>
                            <Typography variant="h6">{time}</Typography> 
                        </div>
                        
                        <div className="checkCol right-col">
                            <Typography variant="h5" color="primary">Check #{id}</Typography>
                            <Button variant="contained"  onClick={() => handleClick(id,tableNo,time)}>
                                <MenuBookIcon color="action" style={{ fontSize: 30 , marginRight:"10"}}></MenuBookIcon>
                                View Check
                            </Button>
                        </div>
                    </div>
                </div>
                
                    
                )
            })}

        </div>
    )
}

export default ViewCheck;
