import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import 'tailwindcss/tailwind.css';

const sportIcons = {
  'Football': '⚽', 'Rugby Sevens': '🏉', 'Archery': '🏹', 'Rowing': '🚣',
  'Shooting': '🎯', 'Skateboarding': '🛹', 'Opening Ceremony': '🎭',
  'Equestrian': '🐎', 'Fencing': '🤺', 'Hockey': '🏑', 'Judo': '🥋',
  'Basketball': '🏀', 'Diving': '🤿', 'Swimming': '🏊', 'Tennis': '🎾',
  'Badminton': '🏸', 'Beach Volleyball': '🏐', 'Handball': '🤾',
  'Water Polo': '🤽', 'Cycling': '🚴', 'Canoe Slalom': '🚣‍♂️', 'Boxing': '🥊',
  'Artistic Gymnastics': '🤸', 'Table Tennis': '🏓', 'Surfing': '🏄',
  'Sport Climbing': '🧗',
};

const typeIcons = { '🔷': '🔵', '🔶': '🟠', '🏅': '🥇', '🥇': '🏆' };

const EventCard = ({ event, isSelected, onToggleSelect }) => {
  return (
    <div className={`bg-white border-l-4 ${isSelected ? 'border-yellow-500' : 'border-blue-500'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-4`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <Calendar className="text-gray-500 mr-2" size={16} />
            <span className="font-semibold text-gray-800">{event.time}</span>
            <span className="ml-2 text-sm text-gray-500">{event.duration}</span>
            <span className="ml-2 text-sm">{typeIcons[event.event.split(' ')[0]] || event.event.split(' ')[0]}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="text-2xl mr-2" role="img" aria-label={event.sport}>
              {sportIcons[event.sport] || '🏅'}
            </span>
            <span className="font-bold text-blue-700">{event.sport}</span>
          </div>
          <p className="text-gray-600">{event.event}</p>
        </div>
        <button
          onClick={() => onToggleSelect(event.id)}
          className={`p-2 rounded-full ${isSelected ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'} hover:bg-yellow-200 transition-colors duration-300`}
        >
          <Star size={20} />
        </button>
      </div>
    </div>
  );
};

const OlympicSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedDays, setCollapsedDays] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/scheduleData.json');
        const data = await response.json();
        // Ensure each event has a unique id
        const dataWithIds = data.map(day => ({
          ...day,
          events: day.events.map((event, index) => ({
            ...event,
            id: `${day.day}-${index}`
          }))
        }));
        setScheduleData(dataWithIds);
        // Initialize all days as collapsed
        const initialCollapsedState = dataWithIds.reduce((acc, day) => {
          acc[day.day] = true;
          return acc;
        }, {});
        setCollapsedDays(initialCollapsedState);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
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
        (event.sport.toLowerCase().includes(searchTerm.toLowerCase()) || 
         event.event.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSport === '' || event.sport === filterSport)
      )
    })).filter(day => day.events.length > 0);
  }, [scheduleData, searchTerm, filterSport]);

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
    setCollapsedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center">Dennis Olympia Kalender 2024</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Mein persönlicher Kalender</h2>
          {getMySchedule().length > 0 ? (
            getMySchedule().map((day, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  {`${day.day} - ${day.date}`}
                </h3>
                {day.events.map((event, eventIndex) => (
                  <EventCard
                    key={eventIndex}
                    event={event}
                    isSelected={selectedEvents.includes(event.id)}
                    onToggleSelect={toggleEventSelection}
                  />
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-600">Du hast noch keine Events ausgewählt. Klicke auf den Stern bei den Events unten, um sie zu deinem persönlichen Kalender hinzuzufügen.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6 flex flex-wrap items-center space-x-2">
            <div className="flex-grow mb-2 sm:mb-0">
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Veranstaltung suchen..."
                  className="w-full outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <Filter className="text-gray-400 mr-2" size={20} />
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="outline-none bg-transparent"
              >
                <option value="">Alle Sportarten</option>
                {uniqueSports.map((sport, index) => (
                  <option key={index} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredSchedule.map((day, index) => (
            <div key={index} className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
              <button
                className="w-full text-left text-xl font-bold p-4 bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                onClick={() => toggleDayCollapse(day.day)}
              >
                <span>{`${day.day} - ${day.date}`}</span>
                {collapsedDays[day.day] ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              </button>
              {!collapsedDays[day.day] && (
                <div className="p-4">
                  {day.events.map((event, eventIndex) => (
                    <EventCard
                      key={eventIndex}
                      event={event}
                      isSelected={selectedEvents.includes(event.id)}
                      onToggleSelect={toggleEventSelection}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Dennis Olympia Kalender</p>
      </footer>
    </div>
  );
};

export default OlympicSchedule;