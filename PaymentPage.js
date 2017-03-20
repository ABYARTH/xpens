import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ListView,
  TextInput,
  ScrollView,
  Image,
  AsyncStorage,
  Alert,
  TouchableHighlight,
} from 'react-native';

var options = {
  auto: 'placeholders'
};

class PaymentPage extends Component {
  
    constructor(props){
        super(props);

        this.animatedValue = new Animated.Value(100);

        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          advanceamt : '',
        };
    }

    componentWillMount(){
      this.getUserData();
    }

  // callToast() {
  //   Animated.timing(
  //     this.animatedValue,
  //     { 
  //       toValue: -70,
  //       duration: 1000
  //     }).start(this.closeToast())
  // }
  
  // closeToast() {
  //   setTimeout(() => {
  //     Animated.timing(
  //     this.animatedValue,
  //     { 
  //       toValue: 0,
  //       duration: 1000
  //     }).start()
  //   }, 1000)
  // }

  getUserData(){

//        AsyncStorage.getItem("@expens:unme").then((value) => {
//          this.setState({"unme": value});
//        }).done();
//        
//        AsyncStorage.getItem("@expens:uid").then((value) => {
//          this.setState({"uid": value});
//          var uidd = this.state.uid;
          fetch("http://kasualy.in:3000/expans/api/mypayment/56/?format=json", {
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

      this.setState({ 
        advanceamt: ''
      });
  }

  _saveOrder(id){
      let amt = this.state.advanceamt;
      let idd = id.toString();
      if (amt === ''){
        Alert.alert("Error", "Please enter the amount");
      }else{
        fetch("http://kasualy.in:3000/expans/addPayment/"+idd+"/"+amt+"/", {
            method: "GET",
        })
        .done();
        this.getUserData();        
        this.callToast();
      }
  }
  
  render() {
    return (
          <View>
            <Animated.View  style={{ transform: [{ translateY: this.animatedValue }], height: 70, backgroundColor: 'green', position: 'absolute',left:0, top:0, right:0, justifyContent:  'center' }}>
              <Text style={{ marginLeft: 10,  color: 'white',  fontSize:16, fontWeight: 'bold',  justifyContent:  'center'  }}>
                Saved Successfully !!
              </Text>
            </Animated.View>  
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie.bind(this)}
            />
          </View>
    )
  }
    renderMovie(data){
      return (
            <ScrollView  style={styles.Body}>
              <View style={styles.ItemList}>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.mylist.org.picture}}
                    style={styles.image}
                  />
                  <Text style={styles.CompanyName}>{data.mylist.org.user.username}</Text>
                </View>  
                <View style={styles.Company}>
                  <Text style={styles.CompanyName2, {fontWeight: 'bold'}}>{data.mylist.item.name}</Text>
                  <Text style={styles.CompanyName2, {fontWeight: 'bold'}}>Due: Rs.{data.due}</Text>
                </View>
                <TextInput 
                  ref={data.mylist.id} 
                  style={styles.InputBox} 
                  keyboardType={'numeric'}
                  onChangeText={(advanceamt) => this.setState({advanceamt})}
                />
                <TouchableHighlight style={styles.button} onPress={this._saveOrder.bind(this, data.mylist.id)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Paid</Text>
                </TouchableHighlight>
              
              </View>
            </ScrollView>

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
    marginLeft:0,
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
    alignSelf: 'center',
  },
  CompanyName2:{
  },
    Body: {
    backgroundColor: '#dcdcdc',
  },

  image: {
    // flex:1,
    alignSelf: 'center',
    // justifyContent: 'center',
    height:30,
    width:30,
    margin:5,
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
    // 6495ed:cornflowerblue
    // dc143c:crimson
    //
  },
    body: {
      fontSize: 14,
      // textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    toolbar:{
        backgroundColor:'#add8e6',
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    InputBox:{
    height: 45,
    width: 100,
    // marginTop:0,
    // borderWidth: 1,
    // borderColor: '#48BBEC',
    // borderRadius: 2,
    color: '#48BBEC'
  },

  ItemList:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
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

module.exports = PaymentPage;