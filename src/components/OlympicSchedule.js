import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, Clock, ChevronDown, ChevronUp, Info, Link, Moon, Sun, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import 'tailwindcss/tailwind.css';

const sportIcons = {
  'Football': '⚽', 'Rugby Sevens': '🏉', 'Archery': '🏹', 'Rowing': '🚣', 'Shooting': '🎯',
  'Skateboarding': '🛹', 'Opening Ceremony': '🎭', 'Equestrian': '🐎', 'Fencing': '🤺',
  'Hockey': '🏑', 'Judo': '🥋', 'Basketball': '🏀', 'Diving': '🤿', 'Swimming': '🏊',
  'Tennis': '🎾', 'Badminton': '🏸', 'Beach Volleyball': '🏐', 'Handball': '🤾',
  'Water Polo': '🤽', 'Cycling': '🚴', 'Canoe Slalom': '🚣‍♂️', 'Boxing': '🥊',
  'Artistic Gymnastics': '🤸', 'Table Tennis': '🏓', 'Surfing': '🏄', 'Sport Climbing': '🧗',
};

const typeIcons = { '🔷': '🔵', '🔶': '🟠', '🏅': '🥇', '🥇': '🏆' };

const EventCard = ({ event, isSelected, onToggleSelect, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 border-l-4 ${
        isSelected ? 'border-yellow-500' : 'border-transparent'
      } rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 mb-4`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <Clock className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} size={16} />
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{event.time}</span>
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{event.duration}</span>
            <span className="ml-2 text-sm">{typeIcons[event.event.split(' ')[0]] || event.event.split(' ')[0]}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="text-2xl mr-2" role="img" aria-label={event.sport}>
              {sportIcons[event.sport] || '🏅'}
            </span>
            <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{event.sport}</span>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.event}</p>
        </div>
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleSelect(event.id)}
            className={`p-2 rounded-full ${
              isSelected 
                ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-600 dark:text-yellow-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            } hover:bg-yellow-200 dark:hover:bg-yellow-600 transition-colors duration-300`}
          >
            <Star size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`ml-2 p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            } transition-colors duration-300`}
          >
            <Info size={20} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Weitere Informationen über das Event...</p>
            {event.link && (
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center mt-2">
                <Link className="mr-1" size={16} /> Mehr erfahren
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(moment.duration(moment(targetDate).diff(moment())));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(moment.duration(moment(targetDate).diff(moment())));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">Countdown zur Eröffnungsfeier</h2>
      <div className="flex justify-center space-x-4">
        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
          <div key={unit} className="bg-blue-600 text-white rounded-lg p-3 w-24">
            <div className="text-3xl font-bold">{Math.floor(timeLeft[unit]())}</div>
            <div className="text-sm">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
    ))}
  </div>
);

const VenueMap = ({ isOpen, closeModal }) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={closeModal}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Wettkampfstätten
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Hier würde eine interaktive Karte der Olympischen Wettkampfstätten angezeigt werden.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  Schließen
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

const OlympicSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [collapsedDays, setCollapsedDays] = useState({});
  const [filterMedalEvents, setFilterMedalEvents] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulieren Sie eine Netzwerkanfrage
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/scheduleData.json');
      const data = await response.json();
      setScheduleData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const uniqueSports = useMemo(() => {
    const sports = [...new Set(scheduleData.flatMap(day => day.events.map(event => event.sport)))];
    return sports.sort();
  }, [scheduleData]);

  const filteredSchedule = useMemo(() => {
    return scheduleData.map(day => ({
      ...day,
      events: day.events.filter(event =>
        (event.sport.toLowerCase().includes(searchTerm.toLowerCase()) || event.event.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSport === '' || event.sport === filterSport) &&
        (!filterMedalEvents || event.event.includes('🥇'))
      )
    })).filter(day => day.events.length > 0);
  }, [scheduleData, searchTerm, filterSport, filterMedalEvents]);

  const toggleEventSelection = (eventId) => {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const getMySchedule = () => {
    return scheduleData.map(day => ({
      ...day,
      events: day.events.filter(event => selectedEvents.includes(event.id))
    })).filter(day => day.events.length > 0);
  };

  const toggleDayCollapse = (day) => {
    setCollapsedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList. add('dark');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Olympische Spiele 2024</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <CountdownTimer targetDate="2024-07-26T20:00:00" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Mein persönlicher Kalender</h2>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <AnimatePresence>
              {getMySchedule().map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-4"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {`${day.day} - ${day.date}`}
                  </h3>
                  {day.events.map((event, eventIndex) => (
                    <EventCard
                      key={eventIndex}
                      event={event}
                      isSelected={selectedEvents.includes(event.id)}
                      onToggleSelect={toggleEventSelection}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-grow">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full bg-white dark:bg-gray-800">
                <Search className="text-gray-400 dark:text-gray-500 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Veranstaltung suchen..."
                  className="flex-grow outline-none bg-transparent text-gray-800 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800">
              <Filter className="text-gray-400 dark:text-gray-500 mr-2" size={20} />
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="outline-none bg-transparent text-gray-800 dark:text-white"
              >
                <option value="">Alle Sportarten</option>
                {uniqueSports.map((sport, index) => (
                  <option key={index} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                  checked={filterMedalEvents}
                  onChange={(e) => setFilterMedalEvents(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-800 dark:text-white">Nur Medaillenevents</span>
              </label>
            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <AnimatePresence>
              {filteredSchedule.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <h2 
                    className={`text-xl font-bold mb-2 cursor-pointer flex items-center justify-between p-4 rounded-lg ${
                      day.date === moment().format('ddd, MMMM D')
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-gray-100 dark:bg-gray-800'
                    } text-gray-800 dark:text-white`}
                    onClick={() => toggleDayCollapse(day.day)}
                  >
                    <span>{`${day.day} - ${day.date}`}</span>
                    <span className="text-sm font-normal">{`${day.events.length} Events`}</span>
                    {collapsedDays[day.day] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </h2>
                  <AnimatePresence>
                    {!collapsedDays[day.day] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {day.events.map((event, eventIndex) => (
                          <EventCard
                            key={eventIndex}
                            event={event}
                            isSelected={selectedEvents.includes(event.id)}
                            onToggleSelect={toggleEventSelection}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsMapOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300"
          >
            <MapPin className="mr-2" size={20} />
            Wettkampfstätten anzeigen
          </button>
        </div>

        <VenueMap isOpen={isMapOpen} closeModal={() => setIsMapOpen(false)} />
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2024 Olympische Spiele Kalender. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OlympicSchedule;