import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ImageBackground, Dimensions, View } from 'react-native';

// Показываем только надпись "Welcome to Harmony"
const WELCOME_IMAGE = require('../assets/welcome_text.png');

// Настройки длительности и анимации
const DISPLAY_DURATION = 6000; // Показ картинки по 6 секунд
const FADE_DURATION = 800;     // Длительность анимации появления/исчезания

export default function Loader({ onEnd }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Плавно показываем картинку
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    // После паузы скрываем и завершаем
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onEnd && onEnd();
      });
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const { width } = Dimensions.get('window');
  const IMAGE_SIZE = width * 0.9; // увеличиваем до 90% ширины экрана

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Animated.Image
          source={WELCOME_IMAGE}
          style={[styles.image, { opacity, width: IMAGE_SIZE, height: IMAGE_SIZE * 0.5 }]}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Размер задаётся динамически
  },
});
