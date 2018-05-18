import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import { ButtonGroup, Button } from 'react-native-elements'
import { API, graphqlOperation } from 'aws-amplify'
var Sound = require('react-native-sound')
Sound.setCategory('Playback')

import codes from './codes'
import query from './query'

const buttons = [
  'French',
  'German',
  'Portugese',
  'Spanish'
]

export default class App extends Component {
  state = {
    index: 0,
    codes,
    sentence: '',
    mp3Url: ''
  }
  updateIndex = index => {
    this.setState({ index })
  }
  onChangeText = (val) => {
    this.setState({ sentence: val })
  }
  translate = async () => {
    if (this.state.sentence === '') return
    const code = codes[this.state.index].code
    try {
      const translation = await API.graphql(graphqlOperation(query, { sentence: this.state.sentence, code: code }))
      const { sentence } = translation.data.getTranslatedSentence
      const mp3Url = `https://s3.amazonaws.com/rntranslate-userfiles-mobilehub-1492407502/public/${sentence}`
      this.setState({ mp3Url })
    } catch (error) {
      console.log('error translating : ', error)
    }
  }
  playSound = () => {
    const translate = new Sound(this.state.mp3Url, null, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('duration in seconds: ' + translate.getDuration() + 'number of channels: ' + translate.getNumberOfChannels());
      translate.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          this.setState({ sentence: '' })
        } else {
          console.log('playback failed due to audio decoding errors');
          translate.reset();
        }
      });

    });
  }
  render() {
    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.index}
          buttons={buttons}
        />
        <TextInput
          multiline
          onChangeText={val => this.onChangeText(val)}
          style={styles.input}
          value={this.state.sentence}
          placeholder='Text to translate'
        />
        <Button
          onPress={this.translate}
          backgroundColor='#1E88E5'
          title="TRANSLATE"
        />
        {
         this.state.mp3Url !== '' && (
          <Button
            onPress={this.playSound}
            backgroundColor='#1E88E5'
            title="Play Translation"
            style={{ marginTop: 10 }}
          />
         )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    paddingTop: 10,
    backgroundColor: '#ededed',
    height: 300,
    margin: 10,
    fontSize: 16,
    marginTop: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
