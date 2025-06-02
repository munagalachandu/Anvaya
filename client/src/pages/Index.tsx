import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GridNavigation from '../components/GridNavigation';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Demo data
const upcomingEvents = [
  {
    id: '1',
    title: 'Lumina 2024',
    date: 'Nov 9, 2024',
    venue: 'CD Sagar Auditorium',
    image: 'cultural.jpg',
    category: 'cultural',
    registrationUrl: '#',
    brochureUrl: '#'
  },
  {
    id: '2',
    title: 'Aventus 3.0',
    date: 'May 17-18, 2024',
    venue: 'AIML Dept',
    image: 'techaventus.jpg',
    category: 'technical',
    registrationUrl: '#',
    brochureUrl: '#'
  },
  {
    id: '3',
    title: 'Utsaha',
    date: 'April 04-05, 2023',
    venue: 'FootBall Ground',
    image: 'sportutsaha.jpg',
    category: 'sports',
    registrationUrl: '#',
    brochureUrl: '#'
  }
];

const recentEvents = [
  {
    id: '4',
    title: 'Web Development Workshop',
    date: 'April 10, 2025',
    venue: 'Online',
    image: 'webdev.jpg',
    category: 'workshops',
    isPast: true
  },
  {
    id: '5',
    title: 'Technical Symposium',
    date: 'April 2-4, 2025',
    venue: 'CS Department',
    image: 'tech.jpg',
    category: 'technical',
    isPast: true
  },
  {
    id: '6',
    title: 'Cultural Competition',
    date: 'March 15, 2025',
    venue: 'Main Auditorium',
    image: 'culturalevent.jpg',
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
        
  {/* Dynamic Banner with 3D Animation and Purple Gradients - All included */}
<section className="relative min-h-[500px] flex items-center overflow-hidden">
  {/* Base gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-purple-200 to-pink-100">
    {/* Animated 3D gradient shapes */}
    <div className="absolute inset-0" style={{
      background: `radial-gradient(circle at 20% 30%, rgba(216, 180, 254, 0.4) 0%, rgba(216, 180, 254, 0) 50%),
                  radial-gradient(circle at 80% 60%, rgba(233, 213, 255, 0.4) 0%, rgba(233, 213, 255, 0) 60%),
                  radial-gradient(circle at 50% 50%, rgba(245, 208, 254, 0.2) 0%, rgba(245, 208, 254, 0) 70%)`,
    }}></div>
    
    {/* Moving background elements with inline animations */}
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-300/30 rounded-full blur-3xl" 
         style={{
           animation: 'float 15s ease-in-out infinite',
         }}></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl" 
         style={{
           animation: 'float-delay 18s ease-in-out infinite',
         }}></div>
    
    {/* 3D floating elements with inline animations */}
    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg transform rotate-12 opacity-30"
         style={{
           animation: 'float 15s ease-in-out infinite',
         }}></div>
    <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full shadow-lg opacity-20"
         style={{
           animation: 'float-delay 18s ease-in-out infinite',
         }}></div>
    <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-lg shadow-lg transform -rotate-12 opacity-30"
         style={{
           animation: 'pulse 6s ease-in-out infinite',
         }}></div>
  </div>
  
  {/* Content with 3D effect */}
  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-900 drop-shadow-md transition-transform duration-500 hover:scale-105">
        Welcome to Anvaya
      </h1>
      <p className="text-lg md:text-xl mb-8 text-purple-800 drop-shadow transition-all duration-500 hover:translate-y-1">
        Connecting students, faculty, and the community through enriching events 
        and experiences. Anvaya serves as a platform to showcase talent, foster 
        learning, and build lasting connections.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          variant="outline" 
          className="text-purple-700 border-purple-400 hover:bg-purple-50 font-medium px-6 py-3 rounded-md shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          Learn More
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-purple-600 text-white hover:bg-purple-700 font-medium px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Browse Events
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/events/cultural" className="cursor-pointer">Cultural Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/events/technical" className="cursor-pointer">Technical Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/events/sports" className="cursor-pointer">Sports Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/events/workshops" className="cursor-pointer">Workshops</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
  
  {/* Foreground glass effect */}
  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent backdrop-blur-sm"></div>

  {/* Embedded style for animations - this stays within the component */}
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes float {
      0% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0) rotate(0); }
    }
    
    @keyframes float-delay {
      0% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-15px) rotate(-5deg); }
      100% { transform: translateY(0) rotate(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1) rotate(-12deg); }
      50% { transform: scale(1.1) rotate(-8deg); }
      100% { transform: scale(1) rotate(-12deg); }
    }
  `}} />
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
