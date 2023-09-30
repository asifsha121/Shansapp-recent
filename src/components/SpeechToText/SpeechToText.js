import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Voice from '@react-native-voice/voice';

const SpeechToText = ({ setTaskDetails, selectedLanguage }) => {
    let [started, setStarted] = useState(false);



  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  
  const startSpeechToText = async () => {
    try {
      console.log("i am commit to speech to text")
      await Voice.start(selectedLanguage);
      setStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopSpeechToText = async () => {
    await Voice.stop()
    setStarted(false)
  }

  const onSpeechResults = (result) => {
    console.log("onspeech results")
    console.log(result)
    const recognizedText = result.value.join(' ');

    // Split the recognized text into words
    const words = recognizedText.split(' ');

    // Create a Set to store unique words
    const uniqueWordsSet = new Set(words);

    // Convert the Set back to an array of unique words
    const uniqueWordsArray = Array.from(uniqueWordsSet);

    // Set taskDetails to the unique words

    console.log("UniqueArray: " + uniqueWordsArray)
    // Update the task details with the speech results
    setTaskDetails((prevTaskDetails) => prevTaskDetails + ' ' + uniqueWordsArray.join(' '));
  };

  const onSpeechError = (error) => {
    console.log(error)
  }


  return (
    <View>
       {!started ? (
              <TouchableOpacity onPress={startSpeechToText}>
                {/* <Text>Start Speech to Text</Text> */}
                <Image source={require("../../../assets/addTask/speech.png")} style={{ width: 30, height: 30, alignSelf: "center" }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={stopSpeechToText}>
                <Image source={require("../../../assets/addTask/stop-speech.png")} style={{ width: 30, height: 30, alignSelf: "center" }} />
              </TouchableOpacity>
            )}
    
    </View>
  );
};

export default SpeechToText;
