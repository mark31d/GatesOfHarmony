// Start.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');

// ------ CONSTANTS ------ //
const PANEL_GRAD  = ['#9E7FF3', '#5C3ACE'];      // градиент содержимого панели
const HEADER_GRAD = ['#FEF223', '#F19B06'];     // градиент «шапки» панели и текста
const BTN_GRAD    = ['#FEF223', '#F19B06'];     // градиент кнопки
const R_PANEL     = 34;
const R_BTN       = 36;

// Данные для 4 экранов-онбординга
const slides = [
  {
    key: '1',
    image: require('../assets/onboard1.png'),
    title: 'Welcome to Harmony',
    subtitle:
      'Welcome to the home of the gods!\n' +
      'Immerse yourself in the wisdom, challenges,\n' +
      'and serenity of Mount Harmony.',
    buttonText: 'Next',
  },
  {
    key: '2',
    image: require('../assets/onboard5.png'),
    title: 'Discover Daily Challenges',
    subtitle:
      'Zephyrus, Athena, Apollo, and Hera have tasks for you! \n' +
      'Unlock your potential with their guidance.',
    buttonText: 'Next',
  },
  {
    key: '3',
    image: require('../assets/onboard3.png'),
    title: 'Find Inspiration',
    subtitle:
      'Receive daily quotes from the gods to guide your thoughts\n' +
      'and uplift your spirit.',
    buttonText: 'Next',
  },
  {
    key: '4',
    image: require('../assets/onboard4.png'),
    title: 'Meditate with the Gods',
    subtitle:
      'Embark on calming journeys with \n' +
      'guided meditations inspired by Harmony legends.',
    buttonText: 'Next',
  },
];


export default function Start({ navigation }) {
  const [index, setIndex] = useState(0);
  const [nickname, setNickname] = useState('');
  const isInputScreen = index === slides.length;
  const slide = slides[index] || {};

  const handlePress = () => {
    if (!isInputScreen) {
      setIndex(index + 1);
    } else {
      navigation.navigate('Main', { nickname });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image
        source={isInputScreen ? slides[slides.length - 1].image : slide.image}
        style={styles.image}
        resizeMode="cover"
      />

      <LinearGradient
        colors={HEADER_GRAD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <LinearGradient colors={PANEL_GRAD} style={styles.panel}>
          {isInputScreen ? (
            <>
              <Text style={styles.title}>Setup your nickname</Text>
              <TextInput
                style={styles.input}
                placeholder="nickname"
                value={nickname}
                onChangeText={setNickname}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonWrapper}
                onPress={handlePress}
              >
                <LinearGradient
                  colors={BTN_GRAD}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{slide.title}</Text>
              </View>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonWrapper}
                onPress={handlePress}
              >
                <LinearGradient
                  colors={BTN_GRAD}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{slide.buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: 400,
    borderBottomLeftRadius: R_PANEL,
    borderBottomRightRadius: R_PANEL,
  },
  headerGradient: {
    marginTop: -50,
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },
  panel: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },
  titleWrapper: {
    marginBottom: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FEF223',
    textShadowColor: '#6D2801',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
  },
  input: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: R_BTN,
    borderWidth: 2,
    borderColor: '#6D2801',
    paddingHorizontal: 16,
    marginBottom: 35,
  },
  buttonWrapper: {
    width: width * 0.8,
    borderRadius: R_BTN,
    overflow: 'hidden',
    marginBottom: 30,
    borderColor: '#6D2801',
    borderWidth: 2,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: R_BTN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});