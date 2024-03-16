
import ViewCheck from './ViewCheck';
import TableView from './TableView';
import React from 'react';
import CheckItem from './CheckItem';
import Pay from './Pay';
import CircularProgress from '@material-ui/core/CircularProgress';
class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tables:JSON.parse(localStorage.getItem("tableData") || "[]" ),
      checkList:[],
      isCheckItemOpen:true,
      isPayOpen:false,
      total:0,
      selectedTable:0,
      orders:[],
      checkID:0,
      time:"",
      name:"",
      tableFromParent: props.tables
    }
    this.updateColour = this.updateColour.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.updatePay = this.updatePay.bind(this);
    this.changeView = this.changeView.bind(this);
    this.paymentComplete = this.paymentComplete.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checkItem !== this.props.checkItem) 
      this.setState({isCheckItemOpen:this.props.checkItem});
    if (prevProps.tables !== this.props.tables)
      this.setState({tables: JSON.parse(localStorage.getItem("tableData") || "[]")})
  }
      componentDidMount() {    
        const tableBefore = localStorage.getItem("tableData");
        const menu = localStorage.getItem("menu");
        localStorage.clear()
        localStorage.setItem("menu",menu);
        localStorage.setItem("tableData",tableBefore);
        this.setState({isCheckItemOpen:true})
        this.setState({isPayOpen:true});
      }
      updateColour(data) {
        this.setState({isPayOpen:false})
        this.setState({selectedTable:data.table});
        this.props.disableCheck()
      }
      selectUser() {
        this.props.selectUser()
      }
      paymentComplete(data){
        this.setState({ tables: data });
        this.setState({isPayOpen: true });
        this.setState({isCheckItemOpen:true})
      }
      updatePay(d) {
        localStorage.setItem("name",'"'+this.state.tables[this.state.selectedTable-1].name+'"');
        localStorage.setItem("order",JSON.stringify(this.state.tables[this.state.selectedTable-1].tempOrder));
        localStorage.setItem("total",d);
        this.setState({isPayOpen:true})
     }
     changeView() {
      this.setState({isCheckItemOpen:true})
    }
    render(){
      if(this.state.tables && this.state.tables.length===0) 
        return (
          <div style={{textAlign:"center", marginTop:"10%"}}>
            <CircularProgress size={155} />
            <h1>Fetching Data...</h1>
          </div>
        )
      else if(this.state.isCheckItemOpen)
        return(
            <div className="main">
            <div className = "homeRow">
              <div className = "homeCol">
                <ViewCheck onChildClick={this.updateColour} checkList={this.state.tables}/>
              </div>
              <div className = "homeCol">
              {[0,3,6].map((object, i)=>{
                return <TableView tableFromParent={this.tableFromParent} selectUser={this.selectUser} start={object} key={i} tables={this.state.tables}/>
              })}
              </div>
            </div>
          </div>
        )
        else if(!this.state.isPayOpen)
          return(
            <div className="main">
              <div className = "homeRow">
                <div className = "homeCol">
                  <ViewCheck onChildClick={this.updateColour} checkList={this.state.tables}/>
                </div>
                <div className = "homeCol">
                  <CheckItem tables={this.state.tables} onPayClick={this.updatePay} />
                </div>
              </div>
            </div>
          )
        else
          return(
            <div className="main">
              <div className = "homeRow">
                <div className = "homeCol">
                  <ViewCheck onChildClick={this.updateColour} onPayClick={this.updatePay} checkList={this.state.tables}/>
                </div>
                <div className = "homeCol">
                  <Pay onPayment={ this.paymentComplete } changeView={this.changeView} />
                </div>
              </div>
            </div>
          )
    }
}

export default Home;