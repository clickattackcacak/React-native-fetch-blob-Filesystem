import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import RNFB from 'react-native-fetch-blob';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  state = { downloading: true }
  downloadingAndReading() {
    const dirs = RNFB.fs.dirs;
    const pathToJson = dirs.DocumentDir + '/dzejson.json';
    const pathToJsonUrl = 'http://www.cduppy.com/salescms/?a=ajax&do=getProject&projectId=3&token=1234567890&deviceId=%27%20+%20deviceId';
    const pathToImg = dirs.DocumentDir + '/slika.jpg';
    const pathToTextFile = dirs.DocumentDir + '/text.txt';

    downloadFIle = () => {
      RNFB.config({ path: pathToJson })
        .fetch('GET', pathToJsonUrl).then(r => { console.log('Fajl snimljen u ', r.path()) })
    }

    checkFile = async () => {
      await RNFB.fs.exists(pathToJson)
        .then(res => {
          if (res) {
            RNFB.fs.readFile(pathToJson, 'utf8').then(res => console.log(res))
          } else {
            downloadFIle()
          }
        })
    }
    downloadImage = async () => {
      await RNFB.config({ path: pathToImg })
        .fetch('GET', 'http://www.bigfoto.com/sites/main/aegeri-lake-switzerland.JPG').then(r => { console.log('Fajl snimljen u ', r.path()) })
    }

    deleteImage = async () => {
      await  RNFB.fs.unlink(pathToImg)
        .then(() => console.log('slika je uspesno obrisana'))
    }
    starter = () => {
      checkFile()
        .then(() => this.setState({ downloading: false }))
        .then(() => RNFB.fs.writeFile(pathToTextFile, 'Zavrseno', 'utf8'))
        .then(res => console.log('fajl je uspesno snimljen'))
    }
    starter();

  }// End of downloading
  readImage(async) {
    RNFB.fs.exists(`${RNFB.fs.dirs.DocumentDir}/slika.jpg`).then(res => {
      if (!res) {
        downloadImage().then(r => {this.setState({downloading: false})})
      } else {
        return null;
      }
    })
  }
  deleteImg() {
    RNFB.fs.exists(`file://${RNFB.fs.dirs.DocumentDir}/slika.jpg`).then(res => {
      if (!res) {
        return null;
      } else {
        deleteImage().then(() => {this.setState({downloading: false})})
      }
    })
  }

  componentWillMount() {
    this.downloadingAndReading();
  } // End of component will mount

  render() {
    if (!this.state.downloading) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
        </Text>
          <TouchableOpacity style={{ width: '100%', backgroundColor: 'grey', height: 100, padding: 20 }}>
            <Text style={[styles.welcome, { fontSize: 30 }]} onPress={() => { this.readImage(); this.setState({downloading: true}) }}>
              Download image!!!
            </Text>
          </TouchableOpacity>
          <Image style={{ width: '50%', height: '50%' }} source={{ uri: `file://${RNFB.fs.dirs.DocumentDir}/slika.jpg` }} />
          <TouchableOpacity style={{ width: '100%', backgroundColor: 'grey', height: 100, padding: 20 }}>
            <Text style={[styles.welcome, { fontSize: 30 }]} onPress={() => { this.deleteImg(); this.setState({ downloading: true }) }}>
              Delete this image!!!
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions} >
          Neki text!
          </Text>
        </View>
      );
    } else {
      return (
        <Text>Please wait</Text>
      )
    }
  }
  componentDidMount() {
    console.log('a')

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
