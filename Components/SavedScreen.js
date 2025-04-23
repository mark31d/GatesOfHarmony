// Components/Saved.js
import React, { useState, useContext, useEffect } from 'react';
import {
  ImageBackground,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { SavedContext } from './SavedContext';

const { width, height } = Dimensions.get('window');
const R_PANEL     = 34;
const HEADER_GRAD = ['#FEF223', '#F19B06'];
const PANEL_GRAD  = ['#9E7FF3', '#5C3ACE'];

export default function Saved({ route, navigation }) {
  const { savedItems, removeSavedItem } = useContext(SavedContext);

  const initialFilter = route.params?.initialFilter || 'Quotes';
  const [filter, setFilter] = useState(initialFilter);
  useEffect(() => { if (initialFilter) setFilter(initialFilter); }, [initialFilter]);

  const types = ['Quotes', 'Task'];  // Meditation removed
  const cycleFilter = () => {
    const idx = types.indexOf(filter);
    setFilter(types[(idx + 1) % types.length]);
  };

  const data = savedItems.filter(item => item.type === filter);
  const iconForType = {
    Quotes: require('../assets/quotes.png'),
    Task:   require('../assets/task.png'),
  }[filter];

  const onShare = text => Share.share({ message: text });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <MaskedView maskElement={<Text style={styles.title}>Saved</Text>}>
        <LinearGradient
          colors={HEADER_GRAD}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.title, { opacity: 0 }]}>Saved</Text>
        </LinearGradient>
      </MaskedView>
      <TouchableOpacity onPress={cycleFilter} style={styles.dropdown}>
        <Text style={styles.dropdownText}>{filter} ▾</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem}>
        <MaskedView maskElement={<Image source={require('../assets/saved.png')} style={styles.navIcon}/>}>
          <LinearGradient
            colors={HEADER_GRAD}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navIcon}
          />
        </MaskedView>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
        <Image source={require('../assets/home.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../assets/profile.png')} style={styles.navIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={HEADER_GRAD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footerHeader}
      >
        <LinearGradient colors={PANEL_GRAD} style={styles.panel}>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No {filter.toLowerCase()} saved yet.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={iconForType}
                  style={[styles.cardIcon, { tintColor: '#000' }]}  // теперь иконка чёрная
                />
                <Text style={styles.cardText}>{item.text}</Text>
                <View style={styles.cardBtns}>
                  <TouchableOpacity onPress={() => onShare(item.text)} style={styles.iconBtn}>
                    <Image source={require('../assets/share.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSavedItem(item.id)} style={styles.iconBtn}>
                    <MaskedView maskElement={<Image source={require('../assets/saved.png')} style={styles.icon}/>}>
                      <LinearGradient
                        colors={HEADER_GRAD}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.icon}
                      />
                    </MaskedView>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </LinearGradient>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  footerHeader: {
    paddingTop: 30,
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },

  panel: {
    paddingTop: 10,
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },

  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  dropdown: {
    marginTop: 8,
    marginBottom: 12,
  },

  dropdownText: {
    fontSize: 16,
    color: '#FFF',
  },

  listContent: {
    paddingBottom: 32,
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#FFF',
    marginTop: 20,
    fontStyle: 'italic',
  },

  card: {
    backgroundColor: '#C99BFF80',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    width: '90%',
  },

  cardIcon: {
    width: 24,
    height: 24,
    marginBottom: 12,
    resizeMode: 'contain',
  },

  cardText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },

  cardBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  iconBtn: {
    marginHorizontal: 16,
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginTop: 24,
    paddingBottom: 16,
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
