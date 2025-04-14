
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GridNavigation from '../components/GridNavigation';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Demo data
const upcomingEvents = [
  {
    id: '1',
    title: 'Annual Cultural Fest 2023',
    date: 'May 15-17, 2023',
    venue: 'Main Auditorium',
    image: '/placeholder.svg',
    category: 'cultural',
    registrationUrl: '#',
    brochureUrl: '#'
  },
  {
    id: '2',
    title: 'Tech Hackathon 2023',
    date: 'June 5-7, 2023',
    venue: 'CS Department',
    image: '/placeholder.svg',
    category: 'technical',
    registrationUrl: '#',
    brochureUrl: '#'
  },
  {
    id: '3',
    title: 'Inter-College Sports Meet',
    date: 'May 28-30, 2023',
    venue: 'University Grounds',
    image: '/placeholder.svg',
    category: 'sports',
    registrationUrl: '#',
    brochureUrl: '#'
  }
];

const recentEvents = [
  {
    id: '4',
    title: 'Web Development Workshop',
    date: 'April 10, 2023',
    venue: 'Online',
    image: '/placeholder.svg',
    category: 'workshops',
    isPast: true
  },
  {
    id: '5',
    title: 'Technical Symposium',
    date: 'April 2-4, 2023',
    venue: 'CS Department',
    image: '/placeholder.svg',
    category: 'technical',
    isPast: true
  },
  {
    id: '6',
    title: 'Classical Dance Competition',
    date: 'March 15, 2023',
    venue: 'Main Auditorium',
    image: '/placeholder.svg',
    category: 'cultural',
    isPast: true
  }
];

const Index = () => {
  const carouselItems = upcomingEvents.map(event => (
    <div key={event.id} className="relative h-[400px] w-full">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
      
      {/* Background image */}
      <img
        src={event.image}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
        <div className="inline-block px-2 py-1 bg-primary text-white text-xs uppercase tracking-wider rounded mb-2">
          {event.category}
        </div>
        <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
        <div className="flex items-center space-x-2 mb-4 text-white/90">
          <span>{event.date} • {event.venue}</span>
        </div>
        <Link to={`/events/${event.category}/${event.id}`}>
          <Button>Explore Event</Button>
        </Link>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Grid Navigation */}
        <GridNavigation />
        
        {/* Dynamic Banner */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Anvaya</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Connecting students, faculty, and the community through enriching events 
                  and experiences. Anvaya serves as a platform to showcase talent, foster 
                  learning, and build lasting connections.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline">Learn More</Button>
                  <Button>Browse Events</Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/placeholder.svg" 
                  alt="Anvaya Events" 
                  className="rounded-lg shadow-lg w-full h-auto animate-slide-up" 
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Carousel Section */}
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
              <EventCarousel>
                {carouselItems}
              </EventCarousel>
            </div>
          </div>
        </section>
        
        {/* Recent Highlights Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Recent Highlights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  venue={event.venue}
                  image={event.image}
                  category={event.category as 'cultural' | 'sports' | 'technical' | 'workshops'}
                  isPast={event.isPast}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
