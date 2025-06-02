import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GridNavigation from '../components/GridNavigation';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log('Starting API call to /api/all_events'); // Debug log
        // Try with full URL - replace 5000 with your actual backend port
        const res = await fetch('http://localhost:5001/api/all_events');
        console.log('API response status:', res.status, res.statusText); // Debug log
        
        if (!res.ok) {
          console.error('API response not ok:', res.status, res.statusText);
          throw new Error('Failed to fetch events');
        }
        
        const data = await res.json();
        console.log('Raw API data:', data); // Debug log
        console.log('Data type:', typeof data, 'Is array:', Array.isArray(data)); // Debug log

        // Map API data into our event structure
        const mappedEvents = data.map(event => ({
          id: event._id,
          title: event.event_name,
          date: event.start_date, // Keep as 'date' for consistency
          venue: event.venue,
          image: event.image,
          category: event.category,
        }));

        console.log('Mapped events:', mappedEvents); // Debug log
        setEvents(mappedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        console.error('Full error object:', err); // More detailed error logging
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Helper to normalize event date to start of day
  function normalizeDate(dateString) {
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Normalize today's date to start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('Events state:', events); // Debug log
  console.log('Events length:', events.length); // Debug log
  console.log('Loading state:', loading); // Debug log

  // Filter valid events with valid start dates
  const validEvents = events.filter(e => {
    const d = new Date(e.date);
    const isValid = e.date && !isNaN(d.getTime());
    console.log(`Event ${e.title}: date=${e.date}, isValid=${isValid}`); // Debug log
    return isValid;
  });

  console.log('Valid events:', validEvents); // Debug log

  // Sort events by date ascending (earliest first)
  const sortedEvents = validEvents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
  
    // If invalid date, treat as earliest date (so it goes to end)
    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
  
    return timeA - timeB; // ascending order: earliest date first
  });

  console.log('Sorted events:', sortedEvents); // Debug log

  // Just show all events instead of filtering by upcoming/recent
  const allEvents = sortedEvents;

  console.log('All events to display:', allEvents); // Debug log

  // Upcoming: start_date >= today (using normalized dates)
  const upcomingEvents = sortedEvents.filter(event => {
    const eventDate = normalizeDate(event.date);
    const isUpcoming = eventDate >= today;
    console.log(`Event ${event.title}: eventDate=${eventDate}, today=${today}, isUpcoming=${isUpcoming}`); // Debug log
    return isUpcoming;
  });

  console.log('Upcoming events:', upcomingEvents); // Debug log

  // Recent: start_date < today, max 5
  const recentEvents = sortedEvents.filter(event => {
    const eventDate = normalizeDate(event.date);
    const isRecent = eventDate < today;
    console.log(`Event ${event.title}: eventDate=${eventDate}, today=${today}, isRecent=${isRecent}`); // Debug log
    return isRecent;
  }).slice(0, 5);

  console.log('Recent events:', recentEvents); // Debug log

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <GridNavigation />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link to="/events" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                <span className="mr-2">View all</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="h-[400px]">
              {loading ? (
                <p>Loading upcoming events...</p>
              ) : upcomingEvents.length ? (
                <EventCarousel>
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="relative h-[400px] w-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                        <div className="inline-block px-2 py-1 bg-primary text-white text-xs uppercase tracking-wider rounded mb-2">
                          {event.category}
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                        <div className="flex items-center space-x-2 mb-4 text-white/90">
                          <span>{new Date(event.date).toLocaleDateString()} • {event.venue}</span>
                        </div>
                        <Link to={`/events/${event.category}/${event.id}`}>
                          <Button>Explore Event</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </EventCarousel>
              ) : (
                <p>No upcoming events available.</p>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Recent Events</h2>
            {loading ? (
              <p>Loading recent events...</p>
            ) : recentEvents.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {recentEvents.map(event => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    venue={event.venue}
                    image={event.image}
                    category={event.category}
                  />
                ))}
              </div>
            ) : (
              <p>No recent events available.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;