// Main.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const R_PANEL = 34;
const R_BTN   = 40;

// цвета градиентов
const HEADER_GRAD = ['#FEF223', '#F19B06'];
const PANEL_GRAD  = ['#9E7FF3', '#5C3ACE'];

// Герои и их изображения
const heroes = [
  { name: 'Zephyrus', image: require('../assets/hero1.png') },
  { name: 'Athena',   image: require('../assets/hero2.png') },
  { name: 'Apollo',   image: require('../assets/hero3.png') },
  { name: 'Hera',     image: require('../assets/hero4.png') },
];

export default function Main({ route, navigation }){
  const nickname = route.params?.nickname || '';
  const [index, setIndex] = useState(0);
  const [pressedLeft, setPressedLeft] = useState(false);
  const [pressedRight, setPressedRight] = useState(false);
  const hero = heroes[index];

  const prev = () => setIndex(i => (i - 1 + heroes.length) % heroes.length);
  const next = () => setIndex(i => (i + 1) % heroes.length);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Верхняя часть слайдера */}
      <View style={styles.imageContainer}>
        <Image source={hero.image} style={styles.image} resizeMode="cover" />

        <View
          style={[
            styles.arrowContainer,
            styles.leftArrow,
            { backgroundColor: pressedLeft ? 'rgba(255,255,255,0.5)' : '#62626280' },
          ]}
        >
          <TouchableOpacity
            style={styles.arrowTouchable}
            onPressIn={() => setPressedLeft(true)}
            onPressOut={() => setPressedLeft(false)}
            onPress={prev}
          >
            <Image
              source={require('../assets/arrowL.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.arrowContainer,
            styles.rightArrow,
            { backgroundColor: pressedRight ? 'rgba(255,255,255,0.5)' : '#62626280' },
          ]}
        >
          <TouchableOpacity
            style={styles.arrowTouchable}
            onPressIn={() => setPressedRight(true)}
            onPressOut={() => setPressedRight(false)}
            onPress={next}
          >
            <Image
              source={require('../assets/arrowR.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Контейнер с именем героя */}
      <LinearGradient
        colors={HEADER_GRAD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.heroNameContainer}
      >
        <Text style={styles.heroNameText}>{hero.name}</Text>
      </LinearGradient>

      {/* Нижняя панель с золотой шапкой */}
      <LinearGradient
        colors={HEADER_GRAD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footerHeader}
      >
        <LinearGradient colors={PANEL_GRAD} style={styles.panel}>
          <Text style={styles.welcomeText}>Welcome, {nickname}!</Text>
          <Text style={styles.instructionText}>
            swipe to change hero for today and{'\n'}start your journey
          </Text>

          <TouchableOpacity
            style={styles.inspireButtonWrapper}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Inspiration', { hero, nickname })
            }
          >
            <LinearGradient
              colors={HEADER_GRAD}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.inspireButton}
            >
              <Text style={styles.inspireButtonText}>Inspire me!</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.navBar}>
            {/* Сохранённые */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Saved')}
            >
              <Image
                source={require('../assets/saved.png')}
                style={styles.navIconImage}
              />
            </TouchableOpacity>

            {/* Home — градиент вместо жёлтого */}
            <TouchableOpacity style={styles.navItem}>
              <MaskedView
                maskElement={
                  <Image
                    source={require('../assets/home.png')}
                    style={styles.navIconImage}
                  />
                }
              >
                <LinearGradient
                  colors={HEADER_GRAD}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.navIconImage}
                />
              </MaskedView>
            </TouchableOpacity>

            {/* Профиль */}
            <TouchableOpacity style={styles.navItem}  onPress={() => navigation.navigate('Profile',  { hero, nickname })}>
              <Image
                source={require('../assets/profile.png')}
                style={styles.navIconImage}
               
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  imageContainer: {
    width: '100%',
    height: height * 0.6,
    marginBottom: -50,
    borderBottomLeftRadius: R_PANEL,
    borderBottomRightRadius: R_PANEL,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  arrowContainer: {
    position: 'absolute',
    top: 20,
    bottom: 70,
    width: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#BCBCBC',
  },
  leftArrow: {
    left: 0,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  rightArrow: {
    right: 0,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  arrowTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },

  heroNameContainer: {
    marginTop: 50,
    position: 'absolute',
    top: height * 0.4 - 30,
    alignSelf: 'center',
    width: 150,
    height: 55,
    borderRadius: R_BTN,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroNameText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  footerHeader: {
    marginTop: 10,
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

  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FEF223',
    textShadowColor: '#6D2801',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },

  inspireButtonWrapper: {
    width: width * 0.8,
    borderRadius: R_BTN,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#6D2801',
  },
  inspireButton: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspireButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
  },
  navItem: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
