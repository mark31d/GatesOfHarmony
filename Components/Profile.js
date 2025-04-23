import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { SavedContext } from './SavedContext';

const { width, height } = Dimensions.get('window');
const R_PANEL     = 34;
const HEADER_GRAD = ['#FEF223', '#F19B06'];
const PANEL_GRAD  = ['#9E7FF3', '#5C3ACE'];

export default function Profile({ route, navigation }) {
  const {
    savedItems,
    meditationSeconds = 0,
    quotesCompleted,
    tasksCompleted,
  } = useContext(SavedContext);

  const initialNick = route.params?.nickname || 'Guest';
  const [nick, setNick]         = useState(initialNick);
  const [editing, setEditing]   = useState(false);
  const [tempNick, setTempNick] = useState(initialNick);

  const minutesMeditated = Math.floor(meditationSeconds / 60);
  const tasksDone        = tasksCompleted;
  const quotesCaught     = quotesCompleted;

  const saveNick = () => {
    setNick(tempNick);
    setEditing(false);
    navigation.setParams({ nickname: tempNick });
  };
  const cancelNick = () => {
    setTempNick(nick);
    setEditing(false);
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.container} resizeMode="cover">
      {/* Золотая рамка */}
      <LinearGradient colors={HEADER_GRAD} style={styles.footerHeader}>
        {/* Фиолетовая панель */}
        <LinearGradient colors={PANEL_GRAD} style={styles.panel}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              {editing ? (
                <>
                  <TextInput
                    style={styles.nickInput}
                    value={tempNick}
                    onChangeText={setTempNick}
                    placeholder="Enter nickname"
                    placeholderTextColor="#FFF"
                  />
                  <View style={styles.nickBtns}>
                    <TouchableOpacity style={styles.saveBtn} onPress={saveNick}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelNick}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.username}>{nick} profile</Text>
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Text style={styles.changeNick}>Change nickname</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Статистика */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{minutesMeditated}</Text>
                <Text style={styles.statLabel}>minutes meditated</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{tasksDone}</Text>
                <Text style={styles.statLabel}>tasks done</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{quotesCaught}</Text>
                <Text style={styles.statLabel}>quotes caught</Text>
              </View>
            </View>

            {/* Кнопка Share */}
            <TouchableOpacity style={styles.shareBtn}>
              <MaskedView maskElement={<Text style={[styles.shareText,{opacity:0}]}>Share</Text>}>
                <LinearGradient colors={HEADER_GRAD} style={styles.shareBtn}>
                  <Text style={styles.shareText}>Share</Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>

            {/* Навигация */}
            <View style={styles.navBar}>
              <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Saved')}>
                <Image source={require('../assets/saved.png')} style={styles.navIcon}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Main',{nickname:nick})}>
                <Image source={require('../assets/home.png')} style={styles.navIcon}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <MaskedView maskElement={<Image source={require('../assets/profile.png')} style={styles.navIcon}/>}>
                  <LinearGradient colors={HEADER_GRAD} style={styles.navIcon}/>
                </MaskedView>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </LinearGradient>
    </ImageBackground>
  );
}

// Стили аналогичны предыдущему примеру


const styles = StyleSheet.create({
  container: { flex: 1 },

  footerHeader: {
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
    paddingTop: 30,
  },

  panel: {

    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
    paddingTop: 10,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  header: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FEF223',
    textShadowColor: '#6D2801',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  changeNick: {
    color: '#FFF',
    marginTop: 4,
  },

  nickInput: {
    width: '80%',
    height: 40,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#FFF',
    marginBottom: 8,
  },

  nickBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },

  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },

  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
  },

  saveText: { color: '#000', fontWeight: '600' },

  cancelText: { color: '#000' },

  statsContainer: {
    width: '100%',
  },

  statCard: {
    backgroundColor: '#C99BFF80',
    borderRadius: 16,
    paddingVertical: 16,
    marginVertical: 8,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FEF223',
    textShadowColor: '#6D2801',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  statLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },

  shareBtn: {
    width: '60%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  shareText: {
    fontSize: 16,
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

  navIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
