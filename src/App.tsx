import React, { useState, useEffect } from 'react'
import { MobileContainer } from './components/MobileContainer'
import { AuthView } from './components/AuthView'
import { OnboardingView } from './components/OnboardingView'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Sun, Cloud, CloudRain, Snowflake, ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PawNavigation, SPOT_TABS, SpotTab } from './components/PawNavigation'
import { CommunityView } from './components/CommunityView'
import { QAView } from './components/QAView'
import { ProfileView, DogProfileData } from './components/ProfileView'
import { SafetyCenterView } from './components/SafetyCenterView'
import { GuideView } from './components/GuideView'
import { DiscoveryView } from './components/DiscoveryView'
import { HomeView } from './components/HomeView'
import { SpotCategoryView } from './components/SpotCategoryView'
import { SpotDirectoryView } from './components/SpotDirectoryView'
import { CalendarView } from './components/CalendarView'
import { LikedDogsView } from './components/LikedDogsView'
import { NearbyDogsView } from './components/NearbyDogsView'
import { DogProfile } from './components/DogCard'

import { getCoordinates, getWeather } from './services/weatherService';


const renderMonochromeWeatherIcon = (iconStr: string) => {
  if (!iconStr) return <Cloud size={18} strokeWidth={2.5} className="text-gray-700" />;
  if (iconStr.includes('☀️') || iconStr.includes('晴') || iconStr.includes('☀')) return <Sun size={18} strokeWidth={2.5} className="text-gray-700" />;
  if (iconStr.includes('☂️') || iconStr.includes('☔️') || iconStr.includes('雨')) return <CloudRain size={18} strokeWidth={2.5} className="text-gray-700" />;
  if (iconStr.includes('❄️') || iconStr.includes('雪')) return <Snowflake size={18} strokeWidth={2.5} className="text-gray-700" />;
  return <Cloud size={18} strokeWidth={2.5} className="text-gray-700" />;
};

const WeatherNotification = ({ onClose, weatherDataMorning, weatherDataEvening, location, timeMorning, timeEvening }: {
  onClose: () => void,
  weatherDataMorning: any,
  weatherDataEvening: any,
  location: string,
  timeMorning: string,
  timeEvening: string
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 w-full max-w-[95vw] mx-auto pointer-events-auto overflow-hidden"
    >
      {/* 朝・夕方カード */}
      <div className="flex divide-x divide-gray-100 items-center">
        <div className="px-3 py-1.5">
          <span className="text-[7px] text-gray-400 font-bold tracking-widest block leading-none mb-0.5">散歩設定時刻</span>
        </div>
        {/* 朝のお散歩 */}
        <div className="flex-1 px-3 py-1.5 flex items-center gap-1.5">
          {renderMonochromeWeatherIcon(weatherDataMorning?.weatherIcon)}
          <div>
            <p className="text-[7px] font-bold text-gray-400 leading-none">朝 {timeMorning}</p>
            <span className="text-xs font-extrabold text-gray-900">
              {weatherDataMorning ? `${weatherDataMorning.temperature}℃` : '-'}
            </span>
          </div>
        </div>

        {/* 夕方のお散歩 */}
        <div className="flex-1 px-3 py-1.5 flex items-center gap-1.5">
          {renderMonochromeWeatherIcon(weatherDataEvening?.weatherIcon)}
          <div>
            <p className="text-[7px] font-bold text-gray-400 leading-none">夕方 {timeEvening}</p>
            <span className="text-xs font-extrabold text-gray-900">
              {weatherDataEvening ? `${weatherDataEvening.temperature}℃` : '-'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) setHasProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('dog_profiles').select('id').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      setHasProfile(!!data)
    })
  }, [user])

  const [currentTab, setCurrentTab] = useState('home')

  // Weather Notification Feature
  const [walkTimeMorning, setWalkTimeMorning] = useState(() => localStorage.getItem('walkTimeMorning') || '07:00');
  const [walkTimeEvening, setWalkTimeEvening] = useState(() => localStorage.getItem('walkTimeEvening') || '18:00');
  const [walkLocation, setWalkLocation] = useState(() => localStorage.getItem('walkLocation') || '東京都千代田区');

  const [showNotification, setShowNotification] = useState(true);
  const [weatherDataMorning, setWeatherDataMorning] = useState<any>(null);
  const [weatherDataEvening, setWeatherDataEvening] = useState<any>(null);

  // Persistence Effects
  React.useEffect(() => {
    localStorage.setItem('walkTimeMorning', walkTimeMorning);
  }, [walkTimeMorning]);

  React.useEffect(() => {
    localStorage.setItem('walkTimeEvening', walkTimeEvening);
  }, [walkTimeEvening]);

  React.useEffect(() => {
    localStorage.setItem('walkLocation', walkLocation);
  }, [walkLocation]);

  // Weather Check Logic
  // Weather Check Logic
  React.useEffect(() => {
    const checkWeather = async () => {
      try {
        // Dynamically import service to avoid top-level issues
        const { getCoordinates, getWeather } = await import('./services/weatherService');

        console.log(`Checking weather for location: ${walkLocation}, Morning: ${walkTimeMorning}, Evening: ${walkTimeEvening}`);

        // 1. Get Coordinates
        const coords = await getCoordinates(walkLocation);

        if (!coords) {
          console.error('Coordinates not found for:', walkLocation);
          return;
        }
        console.log('Coordinates found:', coords);

        // 2. Determine target hours
        const targetHourMorning = parseInt(walkTimeMorning.split(':')[0], 10);
        const targetHourEvening = parseInt(walkTimeEvening.split(':')[0], 10);

        // 3. Get Weather for both hours
        console.log('Fetching weather data...');
        const [weatherM, weatherE] = await Promise.all([
          getWeather(coords.latitude, coords.longitude, targetHourMorning),
          getWeather(coords.latitude, coords.longitude, targetHourEvening)
        ]);

        console.log('Weather data received:', { morning: weatherM, evening: weatherE });

        if (weatherM || weatherE) {
          setWeatherDataMorning(weatherM || { temperature: '-', weatherIcon: '❓' });
          setWeatherDataEvening(weatherE || { temperature: '-', weatherIcon: '❓' });
          setShowNotification(true);
        } else {
          console.warn('Weather data is null for both times');
        }
      } catch (error) {
        console.error('Error in checkWeather:', error);
      }
    };

    checkWeather();
  }, [walkTimeMorning, walkTimeEvening, walkLocation]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Safety Center Feature
  const [showSafetyCenter, setShowSafetyCenter] = useState(false);

  // Guide Feature
  const [showGuide, setShowGuide] = useState(false);

  // Bio Feature
  const [bio, setBio] = useState('ランニングパートナー募集中！走るの大好きだけど、匂い嗅ぎでよく止まります。');

  // Owner Feature
  const [ownerName, setOwnerName] = useState('渡辺 大樹');
  const [ownerBio, setOwnerBio] = useState('柴犬モチの飼い主です。週末は代々木公園によく行きます！');

  // Dog Profile Feature
  const [dogProfile, setDogProfile] = useState<DogProfileData>(() => {
    const saved = localStorage.getItem('dogProfile');
    return saved ? JSON.parse(saved) : {
      name: 'モチ',
      age: 2,
      breed: '柴犬',
      weight: 12,
      gender: 'male' as const,
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500',
    };
  });

  React.useEffect(() => {
    localStorage.setItem('dogProfile', JSON.stringify(dogProfile));
  }, [dogProfile]);

  // Liked Dogs Feature
  const [likedDogs, setLikedDogs] = useState<DogProfile[]>(() => {
    const saved = localStorage.getItem('likedDogs');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('likedDogs', JSON.stringify(likedDogs));
  }, [likedDogs]);

  const handleLikeDog = (dog: DogProfile) => {
    setLikedDogs(prev => {
      if (prev.find(d => d.id === dog.id)) return prev;
      return [...prev, dog];
    });
  };

  // Liked Dogs View
  const [showLikedDogs, setShowLikedDogs] = useState(false);

  // Chat from Liked Dogs
  const [chatDog, setChatDog] = useState<DogProfile | null>(null);

  // Calendar Feature (Lifted State)
  const [events, setEvents] = useState([
    { id: 1, date: 15, title: '混合ワクチン', type: 'vet', time: '10:00' },
    { id: 2, date: 18, title: 'ココちゃんとデート', type: 'play', time: '14:00' },
    { id: 3, date: 24, title: 'トリミング', type: 'grooming', time: '11:00' },
  ]);

  const handleAddEvent = (newEvent: any) => {
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleNavigateToCalendar = () => {
    setCurrentTab('calendar');
  };

  if (authLoading || (user && hasProfile === null)) return null
  if (!user) return <MobileContainer><AuthView /></MobileContainer>
  if (!hasProfile) return <MobileContainer><OnboardingView userId={user.id} onComplete={() => setHasProfile(true)} /></MobileContainer>

  return (
    <MobileContainer>
      <main className="flex-1 relative overflow-hidden bg-dog-bg">
        {/* Header - Removed */}


        {/* Safety Center Overlay */}
        <AnimatePresence>
          {showSafetyCenter && <SafetyCenterView onClose={() => setShowSafetyCenter(false)} />}
        </AnimatePresence>

        {/* Guide Overlay */}
        <AnimatePresence>
          {showGuide && <GuideView onClose={() => setShowGuide(false)} />}
        </AnimatePresence>

        {/* Home Screen Header Title & Logo */}
        {currentTab === 'home' && (
          <div className="absolute top-5 left-5 z-[9999] flex flex-col items-start" translate="no">
            <h1 className="font-sans font-black text-[1.3rem] tracking-[0.1em] text-gray-900 leading-none uppercase">
              WMC
            </h1>
            <span className="font-sans font-bold text-[0.5rem] tracking-[0.3em] text-gray-400 mt-0.5 uppercase">
              WANMATCH
            </span>
          </div>
        )}

        {/* Notification Overlay */}
        <div className="absolute top-[3.5rem] inset-x-0 w-full flex justify-center z-[9999] pointer-events-none px-2">
          {showNotification && currentTab === 'home' && (
            <WeatherNotification
              onClose={handleCloseNotification}
              location={walkLocation}
              weatherDataMorning={weatherDataMorning}
              weatherDataEvening={weatherDataEvening}
              timeMorning={walkTimeMorning}
              timeEvening={walkTimeEvening}
            />
          )}
        </div>

        {/* Content Area */}
        <div className={`h-full w-full relative flex flex-col transition-all duration-300 ${showNotification && currentTab === 'home' ? 'pt-20' : ''} ${currentTab === 'profile' ? 'overflow-y-auto' : ''}`}>
          {currentTab === 'home' && (
            <HomeView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'discovery' && (
            <DiscoveryView onLikeDog={handleLikeDog} />
          )}

          {(currentTab === 'spot' || SPOT_TABS.filter(t => t !== 'spot').includes(currentTab as SpotTab)) && (
            <SpotDirectoryView initialCategory={currentTab === 'spot' ? 'all' : currentTab as any} />
          )}

          {currentTab === 'matches' && <CommunityView />}

          {currentTab === 'qa' && <QAView />}

          {currentTab === 'liked' && (
            <LikedDogsView
              likedDogs={likedDogs}
              onBack={() => setCurrentTab('home')}
              onOpenChat={(dog) => {
                setCurrentTab('matches');
              }}
            />
          )}

          {currentTab === 'nearby' && (
            <NearbyDogsView likedDogs={likedDogs} />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              events={events}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {currentTab === 'profile' && (
            <>
              {/* Liked Dogs Overlay */}
              <AnimatePresence>
                {showLikedDogs && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="absolute inset-0 z-40 bg-white overflow-y-auto"
                  >
                    <LikedDogsView
                      likedDogs={likedDogs}
                      onBack={() => setShowLikedDogs(false)}
                      onOpenChat={(dog) => {
                        setChatDog(dog);
                        setShowLikedDogs(false);
                        setCurrentTab('matches');
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <ProfileView
                walkTimeMorning={walkTimeMorning}
                onWalkTimeMorningChange={setWalkTimeMorning}
                walkTimeEvening={walkTimeEvening}
                onWalkTimeEveningChange={setWalkTimeEvening}
                walkLocation={walkLocation}
                onWalkLocationChange={setWalkLocation}
                bio={bio}
                onBioChange={setBio}
                ownerName={ownerName}
                onOwnerNameChange={setOwnerName}
                ownerBio={ownerBio}
                onOwnerBioChange={setOwnerBio}
                dogProfile={dogProfile}
                onDogProfileChange={setDogProfile}
                onSOSClick={() => setShowSafetyCenter(true)}
                onGuideClick={() => setShowGuide(true)}
                onLikedDogsClick={() => setShowLikedDogs(true)}
                onCalendarClick={() => setCurrentTab('calendar')}

              />
            </>
          )}


        </div>


        {/* Back Button for Calendar */}
        {currentTab === 'calendar' && (
          <button
            onClick={() => setCurrentTab('profile')}
            className="absolute top-6 left-4 z-[9999] bg-white/90 backdrop-blur text-gray-800 p-3 rounded-full shadow-md hover:shadow-lg active:scale-90 transition-all flex items-center justify-center border border-gray-100"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        )}

        {/* Back Button for QA */}
        {currentTab === 'qa' && (
          <button
            onClick={() => setCurrentTab('home')}
            className="absolute top-6 left-4 z-[9999] bg-white/90 backdrop-blur text-gray-800 p-3 rounded-full shadow-md hover:shadow-lg active:scale-90 transition-all flex items-center justify-center border border-gray-100"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        )}

      </main>

      <PawNavigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userProfileImage="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=200"
      />
    </MobileContainer>
  )
}

export default App
