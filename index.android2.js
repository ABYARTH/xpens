import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
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

const styles = require('./style');

var ScrollableTabView = require('react-native-scrollable-tab-view');
var t = require('tcomb-form-native');

// global variables are here...........................................

var domain = '192.168.1.132:9000'; //office
//var domain = '192.168.0.102:9000'; //amaterasu
//var domain = '192.168.0.15:9000';


// T-COMB FORM ARE HERE.............................

var Form = t.form.Form;

var Person = t.struct({
  username: t.String,
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
        var value = await AsyncStorage.getItem("@xpens:unme");
        this.setState({"unme": value});
        if (value === null){
            Alert.alert('Out');
            this.props.navigator.push({id: 2,});
        }else{
            Alert.alert('IN');
            this.props.navigator.push({id: 3,});
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
      username = value.username
      password = value.password
      if (value) {
        fetch("http://kasualy.in:3000/expans/userloginapp/"+username+"/"+password+"/", {
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
            var userid = responseData.id;
            var uuid = userid.toString();

            AsyncStorage.setItem("@expens:unme", responseData.username);
            this.setState({"unme": responseData.username});

            AsyncStorage.setItem("@expens:uid", uuid);
            this.setState({"uid": uuid});
            
            this.setState({user: responseData.username});
          
            this.props.navigator.push({id: 13,});
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
            type={Person}
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
        
//      var value = this.refs.form.getValue();
//      phone = value.phoneno;
      phone = this.state.phoneno;    
      phoneno = phone.toString();

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
            Alert.alert("Signup ERROR", responseData.error);
            this.props.navigator.push({id: 3,});
          }else{
            // SET ASYNC DATA
            Alert.alert("Passcode Verification", 'You will recieve a message on the signed up number. Enter the four digit passcode.');
            this.props.navigator.push({id: 6,});
          }    
        })
        .done();
    }catch (error){
           Alert.alert('Signup Error: ', 'Fill all the fields');
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
//      var value = this.refs.form.getValue();
//      passcode = value.passcode;
        
      passcode = this.state.passCode;    
      passcode = passcode.toString();
        fetch("http://"+domain+"/expans/verifypasscode/"+passcode+"/", {
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
    };
  },
  componentWillMount(){
  },

  _handlePress() {
    this.props.navigator.push({id: 2,});
  },

  _handlePressBack() {
    this.props.navigator.pop();
  },

  _saveCategory() {
      category = this.state.category;
      cid = this.state.cid;
      Alert.alert(cid, category);    
//      try{
//          AsyncStorage.getItem("@expens:uid").then((value) => {
//                this.setState({"uid": value});
//                let supid = this.state.uid;
//                if(value){
//                    fetch("http://kasualy.in:3000/expans/addnewcompany/"+CompanyName+"/"+Phoneno+"/"+Item+"/"+Price+"/"+Measured+"/"+Paydate+"/"+Advance+"/"+supid+"/", {
//                    method: 'POST',
//                    headers: {
//                      'Accept': 'application/json',
//                      'Content-Type': 'application/json',
//                    }
//                    })
//                .done();
//                Alert.alert('Success', 'Saved Successfully');
//                }
//          }).done();
//        }catch(error){
//          Alert.alert('AsyncStorage error: ' + error.message);
//        }
      this.props.navigator.push({id: 5,});
  },

  _saveItem(t, i){
      let category = t;
      let cid = i;
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
                    <TextInput placeholder='Enter you name' style={{fontSize: 18}}></TextInput>
                </View>
                <View style={{marginTop:10, marginBottom: 50}}>
                    <Text style={styles.title}>Select category you want to serve</Text>
                    <TextInput placeholder='Select a category from the list below' style={{fontSize: 18}} value={this.state.category}></TextInput>
                    <View style={styles.ItemList}>
                      <TouchableOpacity onPress={() => this._saveItem('chai and coffee', '1')}>
                        <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/Tea50.png'}} style={{width: 50, height: 50}} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('water can', '2')}>
                        <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/BottleofWater.png'}} style={{width: 50, height: 50}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('biscuit and bakery', '3')}>
                        <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/Cookies.png'}} style={{width: 50, height: 50}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('laundry', '4')}>
                        <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/Iron.png'}} style={{width: 50, height: 50}}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this._saveItem('newspaper', '5')}>
                        <Image source={{uri: 'http://kasualy.in:3000/media/item_pics/News.png'}} style={{width: 50, height: 50}}/>
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
        };
    },
    
    componentWillMount(){     
        this.getItemsList();    
    },
    
    getItemsList(){
        AsyncStorage.getItem("@xpens:categoryid").then((value) => {
            this.setState({"cid": value});
        }).done();
        cidd = this.state.cid;
        cidd = cid.toString();
        fetch("http://"+domain+"/expans/api/category/"+cidd+"/",{
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
    },

    _logout(){
        AsyncStorage.setItem("@expens:unme", '');
        AsyncStorage.setItem("@expens:uid", '');
        this.props.navigator.push({id: 1,});
    },

  _handlePress() {
    this.props.navigator.push({id: 2,});
  },

  _handlePressBack() {
    this.props.navigator.pop();
  },

  _saveCompany() {
  },

  _saveItem(t){
      let itemlist = t;      
      AsyncStorage.setItem("@expens:itemlist", itemlist);
      this.setState({ 
        itemlist: itemlist, 
      });              
  },

    render() {
    return (
          <View>
            <ScrollView style={styles.Body}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderItem.bind(this)}
            />         
            </ScrollView>
          </View>  
    )
  },
  renderItem(data){
      return (
              <View style={styles.ItemList}>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.picture}}
                    style={styles.imageItems}
                  />
                  <Text style={styles.CompanyName}>{data.name}</Text>
                </View>
                <TextInput 
                  ref={data.id}
                  style={styles.InputBoxItems} 
                  placeholder='Enter Price'
                  keyboardType={'numeric'}
                  onChangeText={(orderSize) => this.setState({orderSize})}
                />
                <TouchableHighlight style={styles.button} onPress={() => this._saveOrder(data.id)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>        
              </View>
            
      );
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