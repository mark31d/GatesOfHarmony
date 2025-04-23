import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  ImageBackground,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { DATA } from './questions';
import { SavedContext } from './SavedContext';

const { width, height } = Dimensions.get('window');
const R_PANEL          = 34;
const HEADER_GRAD      = ['#FEF223', '#F19B06'];
const PANEL_GRAD       = ['#9E7FF3', '#5C3ACE'];
const COMPLETED_COLOR  = '#B4FF63';
const COMPLETED_BARCLR = '#B4FF63';
const TASK_SECONDS     = 1 * 60;   // демо
const MED_SECONDS      = 20 * 60;  // демо

export default function Inspiration({ route, navigation }) {
  const { hero, nickname } = route.params;
  const {
    addSavedItem,
    addMeditationSeconds,
    incrementQuotes,
    incrementTasks,
  } = useContext(SavedContext);

  const [step, setStep]               = useState(0);
  const [saved, setSaved]             = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskLeft, setTaskLeft]       = useState(0);
  const [medLeft, setMedLeft]         = useState(MED_SECONDS);
  const [medRun, setMedRun]           = useState(false);

  const taskRef = useRef(null);
  const medRef  = useRef(null);

  const rand = arr => Math.floor(Math.random() * arr.length);
  const [quoteIdx, setQuoteIdx] = useState(() => rand(DATA[hero.name].quotes));
  const [taskIdx, setTaskIdx]   = useState(() => rand(DATA[hero.name].tasks));
  const titles = ['Quotes', 'Task', 'Meditation'];

  useEffect(() => {
    if (step === 0) setQuoteIdx(rand(DATA[hero.name].quotes));
    if (step === 1) setTaskIdx(rand(DATA[hero.name].tasks));
  }, [step, hero.name]);

  useEffect(() => {
    if (step !== 1) {
      clearInterval(taskRef.current);
      setTaskStarted(false);
      setTaskLeft(0);
    } else if (taskStarted && taskLeft > 0) {
      taskRef.current = setInterval(() => setTaskLeft(p => p - 1), 1000);
      return () => clearInterval(taskRef.current);
    }
  }, [step, taskStarted, taskLeft]);

  useEffect(() => {
    if (step === 2 && medRun && medLeft > 0) {
      medRef.current = setInterval(() => setMedLeft(p => Math.max(0, p - 1)), 1000);
      return () => clearInterval(medRef.current);
    }
  }, [step, medRun, medLeft]);

  const fmt = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const currentText = () =>
    step === 0
      ? DATA[hero.name].quotes[quoteIdx]
      : step === 1
        ? DATA[hero.name].tasks[taskIdx]
        : DATA[hero.name].meditation;

  const handleShare = async () => {
    try { await Share.share({ message: currentText() }); } catch {}
  };

  const onSave = () => {
    if (!saved) {
      addSavedItem({ id: Date.now().toString(), text: currentText(), type: titles[step] });
      setSaved(true);
    } else {
      setSaved(false);
    }
  };

  const allDone = step === 2 && medLeft === 0;

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.container}>
      <ImageBackground source={hero.image} style={styles.imageContainer} />

      <LinearGradient colors={HEADER_GRAD} style={styles.footerHeader}>
        <LinearGradient colors={PANEL_GRAD} style={styles.panel}>
          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
          >

            {/* Заголовок */}
            <Text style={[styles.title, step === 2 && styles.titleMed]}>
              {hero.name}'s {titles[step]}
            </Text>

            {/* Прогресс-бар */}
            <View style={styles.progressWrap}>
              <View style={styles.track}>
                {[0,1,2].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.trackChunk,
                      (allDone || i < step) && { backgroundColor: COMPLETED_BARCLR },
                      (!allDone && i === step) && { backgroundColor: '#d0a8ff' },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.iconRow}>
                {[require('../assets/quotes.png'),
                  require('../assets/task.png'),
                  require('../assets/med.png')]
                .map((src,i) => {
                  const done   = allDone || i < step;
                  const active = !allDone && i === step;
                  return (
                    <TouchableOpacity
                      key={i}
                      disabled={step===1 && taskStarted && taskLeft>0}
                      onPress={()=>{
                        // при переходе от цитаты или задачи сразу засчитываем их
                        if (step === 0 && i !== 0) incrementQuotes();
                        if (step === 1 && i === 2 && taskLeft===0) incrementTasks();
                        setStep(i);
                      }}
                      activeOpacity={0.85}
                    >
                      <View style={[
                        styles.iconBorder,
                        done   && styles.iconCompleted,
                        active && styles.stepIconActive,
                      ]}>
                        {done
                          ? <View style={styles.iconInner}><Image source={src} style={[styles.stepIcon,{tintColor:'#064200'}]}/></View>
                          : <LinearGradient colors={HEADER_GRAD} style={styles.iconInner}><Image source={src} style={styles.stepIcon}/></LinearGradient>
                        }
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Цитаты и Задача */}
            {step !== 2 ? (
              <>
                <ScrollView style={styles.card} contentContainerStyle={{paddingBottom:10}}>
                  <View style={styles.iconAboveText}>
                    <Image
                      source={step===0
                        ? require('../assets/quotes.png')
                        : require('../assets/task.png')}
                      style={[styles.iconAbove,{tintColor:'#000'}]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardText}>{currentText()}</Text>
                  <View style={styles.cardBtns}>
                    <TouchableOpacity onPress={handleShare} style={styles.btnWrap}>
                      <Image source={require('../assets/share.png')} style={styles.small} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSave} style={styles.btnWrap}>
                      {saved
                        ? (
                          <MaskedView maskElement={<Image source={require('../assets/saved.png')} style={styles.savedMask} />}>
                            <LinearGradient colors={HEADER_GRAD} style={styles.savedMask}/>
                          </MaskedView>
                        )
                        : <Image source={require('../assets/saved.png')} style={styles.savedMask}/>
                      }
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.nextBtn,
                    step===1 && taskStarted && taskLeft>0 && styles.nextBtnDisabled
                  ]}
                  disabled={step===1 && taskStarted && taskLeft>0}
                  activeOpacity={0.8}
                  onPress={()=>{
                    if (step === 0) {
                      incrementQuotes();
                      setStep(1);
                    } else if (step === 1) {
                      if (!taskStarted) {
                        setTaskStarted(true);
                        setTaskLeft(TASK_SECONDS);
                      } else if (taskLeft === 0) {
                        incrementTasks();
                        setTaskStarted(false);
                        setStep(2);
                      }
                    }
                  }}
                >
                  {step===1 && taskStarted && taskLeft>0 ? (
                    <View style={styles.nextGradDisabled}>
                      <Text style={styles.nextTxt}>{fmt(taskLeft)}</Text>
                    </View>
                  ) : (
                    <LinearGradient colors={HEADER_GRAD} style={styles.nextGrad}>
                      <Text style={styles.nextTxt}>
                        {step===1 && !taskStarted ? 'Start task' : 'Next'}
                      </Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </>
            ) : (

              /* Шаг 2: медитация */
              <ScrollView style={styles.medContainer} contentContainerStyle={{paddingBottom:20}}>
                {medLeft > 0 ? (
                  <>
                    <Text style={styles.meditationText}>{currentText()}</Text>
                    <View style={styles.timerBtnsRow}>
                      <IconBtn
                        src={require('../assets/restart.png')}
                        onPress={()=>{ setMedRun(false); setMedLeft(MED_SECONDS); }}
                      />
                      <IconBtn
                        src={medRun ? require('../assets/pause.png') : require('../assets/play.png')}
                        onPress={()=>setMedRun(!medRun)}
                      />
                      <IconBtn
                        src={require('../assets/stop.png')}
                        onPress={()=>{ setMedRun(false); setMedLeft(0); }}
                      />
                    </View>
                    <View style={styles.medBarWrap}>
                      <LinearGradient
                        colors={HEADER_GRAD}
                        style={[styles.medFill,{flex:medLeft/MED_SECONDS}]}
                      />
                      <View style={{flex:1-medLeft/MED_SECONDS}}/>
                      <View style={styles.medLabelWrap}>
                        <Text style={styles.medLabel}>{fmt(medLeft)}</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.completionText}>
                      You've spent the last 20 minutes well, now rest and come back tomorrow!
                    </Text>
                    <TouchableOpacity
                      style={styles.nextBtn}
                      activeOpacity={0.8}
                      onPress={()=>{
                        addMeditationSeconds(MED_SECONDS);
                        navigation.navigate('Main', { nickname });
                      }}
                    >
                      <LinearGradient colors={HEADER_GRAD} style={styles.nextGrad}>
                        <Text style={styles.nextTxt}>Thank you!</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            )}

          </ScrollView>
        </LinearGradient>
      </LinearGradient>
    </ImageBackground>
  );
}

const IconBtn = ({ src, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.timerBtnWrap} activeOpacity={0.7}>
    <LinearGradient colors={HEADER_GRAD} style={styles.timerBtnGrad}>
      <Image source={src} style={styles.timerBtnIcon}/>
    </LinearGradient>
  </TouchableOpacity>
);

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
  footerHeader: {
    marginTop: -70,
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },
  panel: {
    flex: 1,
    borderTopLeftRadius: R_PANEL,
    borderTopRightRadius: R_PANEL,
    overflow: 'hidden',
  },
  panelScroll: { flex: 1, width: '100%' },
  panelScrollContent: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FEF223',
    textAlign: 'center',
    textShadowColor: '#6D2801',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    paddingBottom: 30,
  },
  titleMed: { paddingBottom: 20 },
  progressWrap: { width: '100%', alignItems: 'center' },
  track: {
    flexDirection: 'row',
    width: '90%',
    height: 14,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackChunk: { flex: 1, backgroundColor: '#c5a1ff' },
  iconRow: {
    position: 'absolute',
    top: -18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconBorder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6D2801',
  },
  iconInner: { flex: 1, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  iconCompleted: { backgroundColor: COMPLETED_COLOR },
  stepIconActive: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#F19B06',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  stepIcon: { width: 24, height: 24, tintColor: '#000' },
  card: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#c99bff80',
    width: '85%',
    maxHeight: height * 0.25,
  },
  iconAboveText: { alignItems: 'center', marginBottom: 12 },
  iconAbove: { width: 32, height: 32, resizeMode: 'contain' },
  cardText: { fontSize: 16, color: '#000', textAlign: 'center', marginBottom: 20 },
  cardBtns: { flexDirection: 'row', justifyContent: 'center' },
  btnWrap: { padding: 4, marginHorizontal: 12 },
  small: { width: 24, height: 24, resizeMode: 'contain' },
  savedMask: { width: 24, height: 24, resizeMode: 'contain' },
  meditationText: { fontSize: 16, color: '#000', textAlign: 'left', marginBottom: 24 },
  medContainer: { width: '85%', alignSelf: 'center', marginTop: 40 },
  timerBtnsRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 24 },
  timerBtnWrap: { width: 84, height: 84, borderRadius: 42, borderWidth: 1, borderColor: '#6D2801' },
  timerBtnGrad: { flex: 1, borderRadius: 41, justifyContent: 'center', alignItems: 'center' },
  timerBtnIcon: { width: 32, height: 32, tintColor: '#6A4B00', resizeMode: 'contain' },
  medBarWrap: { flexDirection: 'row', width: '100%', height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#6D2801', overflow: 'hidden', marginBottom: 10 },
  medFill: { height: '100%' },
  medLabelWrap: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  medLabel: { fontSize: 20, fontWeight: '700', color: '#000' },
  nextBtn: { width: '85%', height: 60, alignSelf: 'center', borderRadius: 36, overflow: 'hidden', marginVertical: 20, borderWidth: 2, borderColor: '#6D2801' },
  nextBtnDisabled: { backgroundColor: '#b0b0b0' },
  nextGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nextGradDisabled: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nextTxt: { fontSize: 18, fontWeight: '600', color: '#000' },
  completionText: { fontSize: 15, fontWeight: '600', paddingBottom: 30 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 12 },
  navItem: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  navIconImage: { width: 28, height: 28, tintColor: '#FFF', resizeMode: 'contain' },
});
