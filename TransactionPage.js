import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  ScrollView,
  Image,
  AsyncStorage,
  Alert,
  TouchableOpacity,    
  TouchableHighlight,
  Navigator,    
} from 'react-native';

//require("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");

var ScrollableTabView = require('react-native-scrollable-tab-view');

import FooterDaily from './FooterDaily';


var domain = '192.168.1.132:9000'; //office
//var domain = '192.168.0.102:9000'; //amaterasu
// var domain = '192.168.0.15:9000';



var options = {
  auto: 'placeholders'
};


var TransactionToday = React.createClass({
  
    getInitialState(){
        return {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          orderSize : '3',
        };
    },

    componentWillMount(){
      this.getUserData();
    },


    getUserData(){
      AsyncStorage.getItem("@xpens:uid").then((value) => {
          this.setState({"uid": value});
          let uidd = this.state.uid;
          fetch("http://"+domain+"/expans/api/supplierorderstoday/"+uidd+"/?format=json", {
            method: "GET", 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then((responseData) => {
            if (responseData == ''){
                Alert.alert("Strange Things", "This place seems to be empty.");
              }else{
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
              });
            }
          })
          .done();

        }).done();
    },


    _gotomonthly(){
        
    },
    
    
    render() {
        return (
            <ScrollView>
                <ListView
                  dataSource={this.state.dataSource}
                  enableEmptySections={true}
                  renderRow={this.renderMovie}
                  renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
                  renderFooter={() => <FooterDaily/>}
                />
            </ScrollView>    
        )
    },
    renderMovie(data){
      return (
          <View>
              <View style={styles.ItemList}>
                <View style={styles.Company}>
                  <Text style={styles.CompanyName}>{data.cus.username}</Text>
                </View>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.item.picture}}
                    style={styles.image}
                  />
                  <Text style={styles.CompanyName}>{data.item.name}</Text>
                </View>
                  <Text style={styles.Total}>{data.qnty} units</Text>
                  <Text style={styles.Total}>Rs.{data.total}</Text>
              </View>
          </View>
      );
    }
});

var TransactionMonthly = React.createClass({
  
    getInitialState(){
        return {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          orderSize : '3',
        };
    },

    componentWillMount(){
      this.getUserData();
    },


    getUserData(){
      AsyncStorage.getItem("@xpens:uid").then((value) => {
          this.setState({"uid": value});
          let uidd = this.state.uid;
          fetch("http://"+domain+"/expans/transactionSummary/"+uidd+"/", {
            method: "GET", 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then((responseData) => {
            if (responseData == ''){
                Alert.alert("Strange Things", "This place seems to be empty.");
              }else{
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
              });
            }
          })
          .done();

        }).done();
    },


    _showMonthlyDetails(id){
        let idf = id;
        Alert.alert(idf);
    },
    
    render() {
        return (
            <ScrollView>
                <ListView
                  dataSource={this.state.dataSource}
                  enableEmptySections={true}
                  renderRow={this.renderMovie}
                  renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
                  renderFooter={() => <FooterDaily/>}
                />
            </ScrollView>    
        )
    },
    renderMovie(data){
      return (
          <ScrollView>
            <TouchableHighlight onPress={() => this._showMonthlyDetails(data.monthid)}>
            <View style={[styles.ItemList, {height: 50}]}>                
                  <Text style={[styles.Total, {marginLeft: 30}]}>{data.month}</Text>
                  <Text style={styles.Total}>Monthly Earning: Rs. {data.total}</Text>
            </View>
            </TouchableHighlight>
          </ScrollView>
      );
    }
});



class TransactionPage extends Component {


  render() {
      return (
            <ScrollableTabView>
                <TransactionToday tabLabel="Daily" />
                <TransactionMonthly tabLabel="Monthly"/>
            </ScrollableTabView>
      );
  }
    
    

}

                
                
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  Company: {
    flex:1,
  },
  Quantity: {
    flex:1,
    alignSelf: 'center',
  },
  Total: {
    alignSelf: 'center',
    flex:1,
  },
    CompanyName:{
    flex:1,
    paddingTop:0,
    // alignSelf: 'center',
    fontSize:15,
    marginLeft: 5,
  },
    Body: {
    backgroundColor: '#dcdcdc',
  },
  image: {
    flex:1,
    height:50,
    width:50,
//    margin:2,
    resizeMode:'contain'    
  },

  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 30,
    width:60,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    color: '#6495ed',     
  },
  body: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  toolbar:{
        backgroundColor:'#add8e6',
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
        separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },

  ItemList:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:5,
        paddingBottom:5,
        flexDirection:'row'    //Step 1
    },  
    toolbarButton:{
        // width: 50,            //Step 2
        // color:'#6495ed',
        textAlign:'center',
        flex:1,
    },
    toolbarTitle:{
        color:'#6495ed',
        textAlign:'center',
        // fontWeight:'bold',
        flex:1                //Step 3
    },
    ItemName:{
        color:'#6495ed',
        textAlign:'center',
        fontSize: 15,
        marginTop:20,
        fontWeight:'bold',
        flex:1                //Step 3
    }
});

module.exports = TransactionPage;