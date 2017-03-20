'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
    container: {
      flex: 1,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
    listView: {
     position          : "relative",
     flexDirection     : "row",
     flexWrap          : "wrap",
     alignSelf         : "stretch",
     top               : 0,
     width             : 320,
     height            : 90,
     backgroundColor   : "transparent",
     overflow          : "hidden",
   },
   listViewContent: {
     width             : 6000,  // <--- set the max width of the scrolled content
     height            : 1250,  // <--- set the max height of the scrolled content
   },
    addButton: {
      backgroundColor: '#ff5722',
      borderColor: '#ff5722',
      borderWidth: 1,
      height: 50,
      width: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 20,
      right:20,
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 0
      }
    },
    container_form: {
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
    },
    button_form: {
      height: 36,
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    Company: {
      flex:1,
    },
    CompanyName:{
      alignSelf: 'center',
      // fontSize: 10,
      marginLeft: 10,
    },
    image: {
        flex:1,
        height:50,
        width:50,
        margin:2,
        resizeMode:'contain'    
    },
    imageItems: {
      flex:1,
      alignSelf: 'center',
      // justifyContent: 'center',
      height:35,
      width:80,
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
      marginTop: 20,
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
    head: {
      fontSize: 30,
      textAlign: 'center',
      margin: 15,
      marginBottom : 25,
      // color: '#191970',     
      // fontWeight: 'bold',
    },
    body: {
      fontSize: 14,
      // textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    toolbar:{
        backgroundColor:'#191970',
        paddingTop:2,
        paddingBottom:5,
        flexDirection:'row'    //Step 1
    },
    toptoolbar:{
        // backgroundColor:'#00008b',
        paddingTop:2,
        paddingBottom:5,
        // flex: 1,
        flexDirection:'row'    //Step 1
    },    
    ItemList:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    toolbarButton:{
        color:'#ffffff',
        textAlign:'center',
        padding: 2,
        flex:1,
        fontSize:18,
        // fontWeight:'bold',
    },
    toptoolbarButton:{
        color:'#000000',
        textAlign:'center',
        padding: 2,
        marginLeft:50,
        flex:1,
        fontSize:18,
        fontWeight:'bold',
    },
    Text1:{
        textAlign:'center',
        padding: 12,
        flex:1,
        // fontSize:18,
    },
    InputBoxItems:{
        height: 55,
        width: 150,
        // marginTop:0,
        // borderWidth: 1,
        // borderColor: '#48BBEC',
        // borderRadius: 2,
        color: '#48BBEC'
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