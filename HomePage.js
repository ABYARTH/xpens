import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  ListView,
  ScrollView,
  AsyncStorage,
  Image,
  Alert,
  TouchableHighlight,
} from 'react-native';

var domain = '192.168.1.132:9000'; //office
//var domain = '192.168.0.102:9000'; //amaterasu
// var domain = '192.168.0.15:9000';

var options = {
  auto: 'placeholders'
};

class HomePage extends Component {
  
  constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          dataSource2: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          orderSize : '',
        };
  }

  componentWillMount(){
    this.getUserData();
  }


  async getUserData(){
      
      var unme = await AsyncStorage.getItem("@xpens:unme");
      this.setState({"unme": unme});

      var uid = await AsyncStorage.getItem("@xpens:uid");
      this.setState({"uid": uid});
      
      let uidd = this.state.uid;
            fetch("http://"+domain+"/expans/api/supcompanylist/"+uidd+"/?format=json",{
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
//        }).done();
  }

  async _saveOrder(id){
      var uid = await AsyncStorage.getItem("@xpens:uid");
      this.setState({"uid": uid});
      
      let uidd = this.state.uid;
      
      let cust_id = id.cus.id; 
    cust_id = cust_id.toString();
      
    let qnty = this.state.orderSize;
      
    let itemid = id.id;
    itemid = itemid.toString();  
    
    Alert.alert(cust_id, itemid);
    
    data = JSON.stringify({
                cust_id: cust_id, 
                item_id: itemid, 
                qnty: qnty, 
    });
      
    if(qnty === ''){
        Alert.alert("Error", "enter quantity");
        return false;
    }else{
        fetch("http://"+domain+"/expans/supplierAddEntry/"+uidd+"/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:data,
        })
        .done();
        Alert.alert("Successfully Saved", 'Saved');
    } 
    this.setState({ 
      orderSize: ''
    });
      
    this.getUserData();      
  }

  onChanged(event) {
    this.setState({ 
      orderSize: event
    });
  }

  render() {
    return (
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie.bind(this)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
            />         
    )
  }
  
  renderMovie(data){
      return (
            <ScrollView>
              <View style={styles.ItemList}>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.cus.picture}}
                    style={styles.image}
                  />
                  <Text style={styles.CompanyName}>{data.cus.username}</Text>
                </View>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.item.picture}}
                    style={styles.image}
                  />
                  <Text style={styles.ItemName}>{data.item.name}</Text>
                </View>
                <TextInput 
                  ref={data.id}
                  style={styles.InputBox} 
                  placeholder='Enter'
                  keyboardType={'numeric'}
                  onSubmitEditing={this.state.orderSize.focus}
                  onChangeText={(orderSize) => this.setState({orderSize})}
                />
                <TouchableHighlight style={styles.button} onPress={() => this._saveOrder(data)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>        
              </View>
            </ScrollView>
      );
  }
}
                
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Company: {
    flex:1,
  },
  Body: {
    backgroundColor: '#dcdcdc',
  },
    InputBox:{
    height: 45,
    width: 100,
    color: '#48BBEC'
  },
    CompanyName:{
    flex:1,
    paddingTop:0,
    fontSize:15,
    marginLeft: 5,
  },
ItemName:{
    fontSize:10,
    marginLeft: 5,
  },
separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
image: {
    height:50,
    width:50,
    margin:2,
    resizeMode:'contain'    
  },
    buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },
    button: {
    // flex:1,
    height: 30,
    width:60,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    // margin: 5,
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
    welcome:{
        backgroundColor:'#f0fff0',
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    ItemList:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:5,
        paddingBottom:5,
        flexDirection:'row',
  },  
    toolbarButton:{
        textAlign:'center',
        flex:1,
  },
    toolbarTitle:{
        color:'#6495ed',
        textAlign:'center',
        flex:1                //Step 3
  },
});
module.exports = HomePage;