import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  BackAndroid,
  ScrollView,
  ListView,
  TextInput,
  Button,
  AsyncStorage,
  NetInfo,
  TouchableHighlight,
  Navigator,
  TouchableOpacity,
} from 'react-native';

import SelectMultiple from 'react-native-select-multiple';

import Modal from 'react-native-animated-modal';

import HomePage from './HomePage';
import TransactionPage from './TransactionPage';
import PaymentPage from './PaymentPage';

const styles = require('./style');

var ScrollableTabView = require('react-native-scrollable-tab-view');

var t = require('tcomb-form-native');

var domain = '192.168.1.132:9000'; //office
//var domain = '192.168.0.102:9000'; //amaterasu
// var domain = '192.168.0.15:9000';

// T-COMB FORM ARE HERE.............................

var Form = t.form.Form;

var LoginForm = t.struct({
  phoneno: t.Number,
  password: t.Number
});

var signupForm = t.struct({
  phoneno: t.Number,
});

var passcodeForm = t.struct({
  passcode: t.Number,
});

var options = {
  auto: 'placeholders'
};

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var BaseConfig = Navigator.SceneConfigs.PushFromRight;

var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 8,
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
  // A very tighly wound spring will make this transition fast
  springTension: 100,
  springFriction: 1,
  // Use our custom gesture defined above
  gestures: {
     pop: CustomLeftToRightGesture,
  }
});


                                                       // CHILD COMPONENTS STARTS HERE
// Check if the user is logged in
var PageOne = React.createClass({
    async componentWillMount(){
    try{
        var value = await AsyncStorage.getItem("@xpens:uid");
        this.setState({"uid": value});
        if (value === null){
            this.props.navigator.push({id: 2,});
        }else{
            this.props.navigator.push({id: 7,});
        }        
    }catch(error){
        Alert.alert('AsyncStorage error: ' + error.message);
        this.props.navigator.push({id: 2,});
    }
},

  render() {
    return (
    <View>
      <Image source={require('./images/Circle@3x.png')} style={{width: 50, height: 50, justifyContent:'center', marginTop: 250, alignSelf: 'center'}}/>
    </View>    
    )
  },
});


// Login page for auth
var PageTwo = React.createClass({
    
  _userLogin() {
    try{
      var value = this.refs.form.getValue();
      phone = value.phoneno;
      phone = phone.toString();
      passkey = value.password;
      passkey = passkey.toString();
      
      if (value) {
        fetch("http://"+domain+"/expans/userloginapp/"+phone+"/"+passkey+"/", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.error){
            Alert.alert("LOGIN ERROR", responseData.error);
          }else{
              // SET ASYNC DATA
                var userid = responseData[0].user.id;
                var uuid = userid.toString();
                AsyncStorage.setItem("@xpens:unme", responseData[0].user.username);
                this.setState({"unme": responseData[0].user.username});
                AsyncStorage.setItem("@xpens:uid", uuid);
                this.setState({"uid": uuid});
                this.setState({user: responseData[0].user.username});
                this.props.navigator.push({id: 7,});
            }    
        })
        .done();
      }
    }catch(error){
           Alert.alert('Login Error', 'Please enter both username and password');
           this.props.navigator.push({id: 2,});
    }
  },

    
  _handlePressBack() {
    this.props.navigator.push({id: 3,});
  },

  render() {
    return (
    <ScrollView>        
      <View style={styles.container_form}>
        <View style={styles.row_form}>
            <Image source={require('./images/logo.jpg')} style={{width: 120, height: 120, marginTop: 20, alignSelf: 'center'}}/>
            <Text style={{fontSize: 25, alignSelf: 'center', margin: 5 }}>Xpens</Text>
          <Text style={{fontSize: 25, alignSelf: 'center',  margin: 5 }}>Login Form</Text>
        </View>
        <View style={styles.row_form}>
          <Form
            ref="form"
            type={LoginForm}
            options={options}
          />
        </View>
        <View style={styles.row_form}>
          <TouchableHighlight style={styles.button_form} onPress={this._userLogin} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>    
        <View style={styles.row_form}>
          <Text style={styles.Text1}>New ? Click below to Signup</Text>
          <TouchableHighlight style={styles.button_form} onPress={this._handlePressBack} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableHighlight>
        </View>    

      </View>
    </ScrollView>    
    )
  },
});


// Signup Page
var PageThree = React.createClass({
  
  _userSignup() {
    try{
        
      phone = this.state.phoneno;    
      phoneno = phone.toString();
      
      AsyncStorage.setItem("@xpens:phoneno", phoneno);  

        fetch("http://"+domain+"/expans/signup/"+phoneno+"/", {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.error){
            Alert.alert("Signup error", responseData.error);
            this.props.navigator.push({id: 3,});
          }else{
            // SET ASYNC DATA
            Alert.alert("Passcode Verification", 'You will recieve a message on the signed up number. Enter the four digit passcode.');
            this.props.navigator.push({id: 6,});
          }    
        })
        .done();
    }catch (error){
           Alert.alert('Signup error', 'Fill all the fields');
           this.props.navigator.push({id: 3,});
    }
  },

  _handlePressBack() {
    this.props.navigator.push({id: 2,});
  },

  render() {
    return (
    <ScrollView>        
      <View style={styles.container_form}>
        <View style={styles.row_form}>
            <Image source={require('./images/logo.jpg')} style={{width: 120, height: 120, marginTop: 20, alignSelf: 'center'}}/>
            <Text style={{fontSize: 25, alignSelf: 'center', margin: 5 }}>Xpens</Text>
          <Text style={{fontSize: 25, alignSelf: 'center',  margin: 5 }}>SignUp Form</Text>
        </View>
        <View style={{ width: 155, height: 90, alignSelf: 'center', padding: 15}}>
            <TextInput 
                placeholder=' PHONE NO. ' 
                style={{fontSize: 20}} 
                keyboardType={'numeric'}
                onChangeText={(phoneno) => this.setState({phoneno})}
            />
        </View>

        <View style={styles.row_form}>
          <TouchableHighlight style={styles.button_form} onPress={this._userSignup} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableHighlight>
        </View>    
        <View style={styles.row_form}>
          <Text style={styles.Text1}>Already a member? Please Login Here</Text>
          <TouchableHighlight style={styles.button_form} onPress={this._handlePressBack} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Click to Login</Text>
          </TouchableHighlight>
        </View>    
      </View>
    </ScrollView>    
    )
  },
});


// Enter verification passcode Page
var PageFour = React.createClass({
  
  _passcodeVerify() {
    try{    
          passcode = this.state.passCode;    
          passcode = passcode.toString();
            AsyncStorage.getItem("@xpens:phoneno").then((value) => {
                var phoneno = value;
                fetch("http://"+domain+"/expans/verifypasscode/"+phoneno+"/"+passcode+"/", {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    })
                    .then((response) => response.json())
                    .then((responseData) => {
                      if (responseData.error){
                        Alert.alert("Verification Error", responseData.error);
                        this.props.navigator.push({id: 6,});
                      }else{
                        Alert.alert("Successfully Verified", 'Go ahead to choose the category and items you want to serve.');
                        this.props.navigator.push({id: 4,});
                      }    
                    })
                    .done();
                }).done();            
    }catch (error){
           Alert.alert('Error ', 'Enter proper 4 digit code');
           this.props.navigator.push({id: 6,});
    }
  },

  render() {
    return (
    <ScrollView>        
      <View style={styles.container_form}>
        <View style={styles.row_form}>
            <Image source={require('./images/logo.jpg')} style={{width: 120, height: 120, marginTop: 20, alignSelf: 'center'}}/>
            <Text style={{fontSize: 25, alignSelf: 'center', margin: 5 }}>Xpens</Text>
          <Text style={{fontSize: 15, alignSelf: 'center',  margin: 5 }}>Enter the 4 digit code in your message</Text>
        </View>
        <View style={{ width: 95, height: 80, alignSelf: 'center', padding: 15}}>
            <TextInput 
                placeholder=' KEY ' 
                style={{fontSize: 20}} 
                keyboardType={'numeric'}
                onChangeText={(passCode) => this.setState({passCode})}
            />
        </View>
        <View style={styles.row_form}>
          <TouchableHighlight style={styles.button_form} onPress={this._passcodeVerify} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableHighlight>
        </View>    
      </View>
    </ScrollView>    
    )
  },
});


// Category Page
var PageCategory = React.createClass({
  getInitialState () {
    return {
      category:'',
      username:'',
      cid:'',    
    };
  },

 _saveCategory() {
      this.props.navigator.push({id: 5,});
  },

  _saveItem(t, i){
      let category = t;
      let cid = i;
      let username = this.state.username;
      
      AsyncStorage.setItem("@xpens:username", username);      
      AsyncStorage.setItem("@xpens:categoryid", cid);      
      AsyncStorage.setItem("@xpens:category", category);
      this.setState({ 
          category: category,
          cid : cid,
      });              
  },

  render() {
    return (
        <ScrollView>
            <View style={[styles.container_form,{justifyContent: 'center'}]}>
                <View style={{marginTop:30, marginBottom: 30}}>
                    <Text style={[styles.title,{fontSize: 20,}]}>Create Profile</Text>        
                    <TextInput placeholder='Enter you name' style={{fontSize: 18}} onChangeText={(username) => this.setState({username})}></TextInput>
                </View>
                <View style={{marginTop:10, marginBottom: 50}}>
                    <Text style={styles.title}>Select category you want to serve</Text>
                    <TextInput placeholder='Select a category from the list below' style={{fontSize: 18}} value={this.state.category}></TextInput>
                    <View style={styles.ItemList}>
                      <TouchableOpacity onPress={() => this._saveItem('Dairy', '5')}>
                        <Image source={{uri: 'http://'+domain+'/media/supplier_images/milkk.jpg'}} style={{width: 50, height: 50, margin:5}} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('Laundry', '6')}>
                        <Image source={{uri: 'http://'+domain+'/media/supplier_images/laundry.png'}} style={{width: 50, height: 50, margin:5}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('Water Supplier', '7')}>
                        <Image source={{uri: 'http://'+domain+'/media/supplier_images/waterb.png'}} style={{width: 50, height: 50, margin:5}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('Newspaper and Magazine', '8')}>
                        <Image source={{uri: 'http://'+domain+'/media/supplier_images/newspp.png'}} style={{width: 50, height: 50, margin:5}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('Tea and Coffee', '9')}>
                        <Image source={{uri: 'http://'+domain+'/media/supplier_images/tea.jpg'}} style={{width: 50, height: 50, margin:5}}/>
                      </TouchableOpacity>
                    </View>
                </View>                                
                <TouchableHighlight style={styles.button_form} onPress={this._saveCategory} underlayColor='#99d9f4'>
                    <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/Advance-48.png'}} style={{alignSelf: 'center', width: 50, height: 50}}/>
                </TouchableHighlight>
            </View>
        </ScrollView>    
    )
  },
});


// Select Item Page
var PageItems = React.createClass({
    getInitialState () {
        return {
            items:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            selectedItems:[],
            allitemlist : [], 

        };
    },
    
    componentWillMount(){     
        this.getItemsList();    
    },
    
    onSelectionsChange(selectedItems){
        this.setState({ selectedItems });
        // this.props.navigator.push({id: 7,});
    },
                                  
    getItemsList(){
        
        AsyncStorage.getItem("@xpens:categoryid").then((value) => {
            this.setState({"cid": value});
            var cid = this.state.cid;
        
            fetch("http://"+domain+"/expans/api/category/"+cid+"/",{
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

                allitem = [];    
                for (i=0; i<responseData.length; i++ ){
                    var iddd = responseData[i].id;
                    var name = responseData[i].name;
                    var price = '1';
                    itemdata = {label: name, value: iddd, price: price};
                    allitem.push(itemdata);
                }
                this.setState({
                    allitemlist: allitem, 
                });  
            }
            })
            .done();
            
        }).done();
    },

    
  _saveItemList() {
        AsyncStorage.getItem("@xpens:username").then((value) => {
            this.setState({"username": value});
            
            AsyncStorage.getItem("@xpens:phoneno").then((value) => {
                this.setState({"phoneno": value});
                phoneno = this.state.phoneno;
                phoneno = phoneno.toString();

                AsyncStorage.getItem("@xpens:categoryid").then((value) => {
                    this.setState({"cid": value});
                
                    cid = this.state.cid;
                    cidd = cid.toString();

                    var selectedItemsList = this.state.selectedItems;

                    fetch("http://"+domain+"/expans/supplier_select_type/"+phoneno+"/"+cidd+"/", {  
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      }
                    })
                    .then(response => response.json())
                    .then((responseData) => {
                        if (responseData.error){
                            Alert.alert("Verification Error", responseData.error);
            //                this.props.navigator.push({id: 6,});
                        }else{
                            let uid = responseData.success;
                            fetch("http://"+domain+"/expans/supplier_select_item/"+uid+"/", {  
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(selectedItemsList)
                            })
                            .then(response => response.json())
                            .then((responseData) => {
                              if (responseData == ''){
                                Alert.alert("Strange Things", "This place seems to be empty.");
                              }else{
                                  Alert.alert("Good Job", "Now you can login into your account.");
                                  this.props.navigator.push({id: 2,});
                              }
                            })
                            .done();                
                       }    
                    })
                    .done();                    
                                    
                }).done();

            }).done();
                        
        }).done();
      
  },

  _saveItem(t){
      let itemlist = t;      
      AsyncStorage.setItem("@expens:itemlist", itemlist);
      this.setState({ 
        itemlist: itemlist, 
      });              
  },

  render(){
    return (
        <ScrollView>
            <View>
                <Text style={{ alignSelf: 'center', fontSize: 25, color: '#48BBEC', margin: 10 }}> select items you want to sell </Text>
            </View>
            <View>
                <SelectMultiple
                  items={this.state.allitemlist}
                  selectedItems={this.state.selectedItems}
                  onSelectionsChange={this.onSelectionsChange} />
            </View>
            <TouchableHighlight style={styles.button} onPress={this._saveItemList} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Save List</Text>
            </TouchableHighlight>
        </ScrollView>
    )
  },
});


// Inner Pages Layout

// MAIN CONTROLLER FOR INNER PAGES.........................................

var InnerPages = React.createClass({
  render() {
    return (
      <ScrollableTabView>
        <PageAddCompany tabLabel="Add" />
        <PageHome tabLabel="Home"/>
        <PageTransaction tabLabel="Transaction" />
        <PagePayment tabLabel="Payment" />
        <PageSettings tabLabel="Settings" />
      </ScrollableTabView>
    );
  }
});


// PageHome................................
var PageHome = React.createClass({
  render() {
    return (
      <ScrollView>
          <HomePage/>        
      </ScrollView>

    )
  },
});

// PageTransaction..................................................................
var PageTransaction = React.createClass({


  render() {
    return (
        <TransactionPage/>
    )
  },
});

// Page 3..................................................................
var PagePayment = React.createClass({
  _handlePress() {
    this.props.navigator.pop();
  },

  _logout(){
    AsyncStorage.setItem("@expens:unme", '');
    AsyncStorage.setItem("@expens:uid", '');
    // this.props.navigator.push({id: 1,});
    Alert.alert("Logged Out", 'Login to continue');
  },

  render() {
    return (
      <ScrollView>
        <PaymentPage/>
      </ScrollView>    
    )
  },
});

// Page Add Company........................................................
var PageAddCompany = React.createClass({
  
  getInitialState () {
    return {
        itemname:'',
        compname:'',
        advanceamt:'',
        phno:'',
        pricepu:'',
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    };
  },
    
  componentWillMount(){
    AsyncStorage.getItem("@xpens:unme").then((value) => {
      this.setState({"unme": value});
    }).done();
    AsyncStorage.getItem("@xpens:uid").then((value) => {
      this.setState({"uid": value});
    }).done();
      this._getItemsList();
  },
    
  _getItemsList(){
      AsyncStorage.getItem("@xpens:uid").then((value) => {
        this.setState({"uid": value});
        var uid = this.state.uid;
            
            fetch("http://"+domain+"/expans/api/supmyitems/"+uid+"/",{
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
    
  async _saveCompany() {
    
    let uidd = await AsyncStorage.getItem("@xpens:uid");
//    Alert.alert(uidd);
      
    CompanyName = this.state.compname;
    if (CompanyName === ''){
      Alert.alert('Error', 'Enter company name');
      return false;
    }

    var phoneno = this.state.phno;
    if (phoneno === ''){
      Alert.alert('Error', 'Enter phone no of company');
      return false;
    }else{
      var Phoneno = phoneno.toString();
    }  
      
    var Item = this.state.itemname;
    if (Item === ''){
     Alert.alert('Error', 'Select Item');
      return false; 
    }

    var Measured = 'units';
    var Paydate = 'monthly';

    price = this.state.pricepu;
    if (price === ''){
      Alert.alert('Error', 'Enter price of item');
      return false;
    }else{
      // type = typeof(price);
      // Alert.alert(type, price);
      var Price = price.toString();
      // return false;
    }
    
    advance = this.state.advanceamt;
    if(advance === ''){
      var Advance = '0';
    }else{
      var Advance = advance.toString();      
    }

    data = JSON.stringify({
                phoneno: Phoneno, 
                name: CompanyName, 
                itemid: Item, 
                price: Price
    });  
      
    try{
      AsyncStorage.getItem("@xpens:uid").then((value) => {
      this.setState({"uid": value});
      let supid = this.state.uid;
        if (supid) {
        fetch("http://"+domain+"/expans/add_regular_customer/"+supid+"/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:data,
        })
        .done();
      Alert.alert('Success', 'Saved Successfully');
        }
      }).done();
    }catch(error){
      Alert.alert('AsyncStorage error: ' + error.message);
    }
  },

  _saveItem(t){
      let itemnme = t;
      AsyncStorage.setItem("@expens:itemname", itemnme);
      this.setState({ 
        itemname: itemnme
      });              
  },

  render() {
    return (
        <ScrollView>
            <View style={styles.container_form}>
                <Text style={styles.title}>Add New Company</Text>
                <TextInput style={{fontSize: 18}} placeholder='Enter Company Name' onChangeText={(compname) => this.setState({compname})}></TextInput>
                <TextInput style={{fontSize: 18}} placeholder='Enter Company Phone No.' onChangeText={(phno) => this.setState({phno})}></TextInput>
                <TextInput placeholder='Select item from the list below' style={{fontSize: 18}} value={this.state.itemname}></TextInput>
                    <ListView
                          horizontal                        = {true}                
                          dataSource                        = {this.state.dataSource}
                          renderRow                         = {this.renderMovie}          
                    />
                <TextInput placeholder='Enter Item Price per units' style={{fontSize: 18}} keyboardType={'numeric'} onChangeText={(pricepu) => this.setState({pricepu})}></TextInput>
                <TextInput placeholder='Enter Advance amount (optional)' keyboardType={'numeric'} style={{fontSize: 18}} onChangeText={(advanceamt) => this.setState({advanceamt})}></TextInput>
                <TouchableHighlight style={styles.button_form} onPress={this._saveCompany} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>    
        )
    },
    renderMovie(data){
      return (
            <TouchableOpacity onPress={() => this._saveItem(data.item.name)}>
                <Image source={{uri: data.item.picture}} style={{margin:10,width: 50, height: 50, resizeMode:'contain'}} />
            </TouchableOpacity>            
      );
  },      
});

// Settings Page...........................................................
var PageSettings = React.createClass({
  _handlePress() {
    this.props.navigator.pop();
  },

  _logout(){
    AsyncStorage.setItem("@xpens:unme", '');
    AsyncStorage.setItem("@xpens:uid", '');
    
    Alert.alert("Logged Out", 'Login to continue');

    BackAndroid.exitApp();
  },

  render() {
    return (
      <ScrollView>
          <View style={styles.container_form}>
              <Button
                onPress={this._logout}
                title="Logout"
                color="#48BBEC"
                accessibilityLabel="Learn more about this purple button"
              />
          </View>
          <View style={styles.container_form}>    
              <Button
                title="Edit Profile"
                color="#48BBEC"
                accessibilityLabel="Learn more about this purple button"
              />
          </View>
          <View style={styles.container_form}>
              <Button
                title="Terms and Condition"
                color="#48BBEC"
                accessibilityLabel="Learn more about this purple button"
              />
          </View>
      </ScrollView>    
    )
  },
});
                                                           // The Parent Component
export default class xpens extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentWillMount(){

    }
 
    _renderScene(route, navigator) {
        if (route.id === 1) {
            return <PageOne navigator={navigator} />
        }else if (route.id === 2) {
            return <PageTwo navigator={navigator} />
        }else if (route.id === 3) {
            return <PageThree navigator={navigator} />
        }else if (route.id === 4) {
            return <PageCategory navigator={navigator} />
        }else if (route.id === 5) {
            return <PageItems navigator={navigator} />
        }else if (route.id === 6) {
            return <PageFour navigator={navigator} />
        }else if (route.id === 7) {
            return <InnerPages navigator={navigator} />
        }
    }

    _configureScene(route) {
        return CustomSceneConfig;
    }
    
    render() {
        return (
            <Navigator 
                initialRoute={{id: 1, }} 
                renderScene={this._renderScene} 
                configureScene={this._configureScene} 
            />
        );
    }
}

AppRegistry.registerComponent('xpens', () => xpens);