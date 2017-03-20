import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const FooterDaily = (props) => (    
  <View style={styles.container}>
      <Text style={styles.text}>Total Earning: Rs.13663</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#48BBEC',
    fontSize:20,  
  },
});

export default FooterDaily;