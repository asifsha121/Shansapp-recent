import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import {useFonts, Raleway_500Medium, } from '@expo-google-fonts/raleway'; 

const Text = ({ style, children }) => {

  const [fontsLoaded] = useFonts({
    raleway: Raleway_500Medium, 
  });

  if (!fontsLoaded) {
    <RNText>Loading...</RNText>
    // Handle font loading, you can return a loading indicator or null
    return; //when using null getting no output 
  }

  return <RNText style={[styles.defaultText, style]}>{children}</RNText>;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'raleway',
  },
});

export default Text;
