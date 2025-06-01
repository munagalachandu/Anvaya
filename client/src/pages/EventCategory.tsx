
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Demo data
const mockEvents = {
  cultural: {
    upcoming: [
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
        title: 'Classical Dance Competition',
        date: 'June 5, 2023',
        venue: 'Dance Studio',
        image: '/placeholder.svg',
        category: 'cultural',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    cityLevel: [
      {
        id: '3',
        title: 'Inter-College Cultural Fest',
        date: 'May 20-22, 2023',
        venue: 'City Convention Center',
        image: '/placeholder.svg',
        category: 'cultural',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    past: [
      {
        id: '4',
        title: 'Music Concert 2022',
        date: 'December 10, 2022',
        venue: 'Open Air Theater',
        image: '/placeholder.svg',
        category: 'cultural',
        isPast: true
      }
    ]
  },
  sports: {
    upcoming: [
      {
        id: '5',
        title: 'Inter-College Sports Meet',
        date: 'May 28-30, 2023',
        venue: 'University Grounds',
        image: '/placeholder.svg',
        category: 'sports',
        registrationUrl: '#',
        brochureUrl: '#'
      },
      {
        id: '6',
        title: 'Basketball Tournament',
        date: 'June 12-15, 2023',
        venue: 'Indoor Stadium',
        image: '/placeholder.svg',
        category: 'sports',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    cityLevel: [
      {
        id: '7',
        title: 'City Marathon',
        date: 'June 25, 2023',
        venue: 'City Central Park',
        image: '/placeholder.svg',
        category: 'sports',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    past: [
      {
        id: '8',
        title: 'Cricket Championship 2022',
        date: 'November 15-20, 2022',
        venue: 'University Cricket Ground',
        image: '/placeholder.svg',
        category: 'sports',
        isPast: true
      }
    ]
  },
  technical: {
    upcoming: [
      {
        id: '9',
        title: 'Tech Hackathon 2023',
        date: 'June 5-7, 2023',
        venue: 'CS Department',
        image: '/placeholder.svg',
        category: 'technical',
        registrationUrl: '#',
        brochureUrl: '#'
      },
      {
        id: '10',
        title: 'AI Conference',
        date: 'June 18, 2023',
        venue: 'Conference Hall',
        image: '/placeholder.svg',
        category: 'technical',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    cityLevel: [
      {
        id: '11',
        title: 'City Tech Summit',
        date: 'July 10-12, 2023',
        venue: 'Tech Park',
        image: '/placeholder.svg',
        category: 'technical',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    past: [
      {
        id: '12',
        title: 'Technical Symposium',
        date: 'April 2-4, 2023',
        venue: 'CS Department',
        image: '/placeholder.svg',
        category: 'technical',
        isPast: true
      }
    ]
  },
  workshops: {
    upcoming: [
      {
        id: '13',
        title: 'Data Science Workshop',
        date: 'June 15, 2023',
        venue: 'Lab 101',
        image: '/placeholder.svg',
        category: 'workshops',
        registrationUrl: '#',
        brochureUrl: '#'
      },
      {
        id: '14',
        title: 'Design Thinking Workshop',
        date: 'June 25, 2023',
        venue: 'Seminar Hall',
        image: '/placeholder.svg',
        category: 'workshops',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    cityLevel: [
      {
        id: '15',
        title: 'Industry 4.0 Workshop',
        date: 'July 5, 2023',
        venue: 'Innovation Hub',
        image: '/placeholder.svg',
        category: 'workshops',
        registrationUrl: '#',
        brochureUrl: '#'
      }
    ],
    past: [
      {
        id: '16',
        title: 'Web Development Workshop',
        date: 'April 10, 2023',
        venue: 'Online',
        image: '/placeholder.svg',
        category: 'workshops',
        isPast: true
      }
    ]
  }
};

const categoryTitles: Record<string, string> = {
  cultural: 'Cultural Events',
  sports: 'Sports Events',
  technical: 'Technical Events',
  workshops: 'Workshops'
};

const categoryDescriptions: Record<string, string> = {
  cultural: 'Explore a vibrant showcase of artistic talents through dance, music, drama, and more.',
  sports: 'Participate in competitive sports events ranging from cricket and football to chess and athletics.',
  technical: 'Engage in hackathons, coding competitions, technical symposiums, and cutting-edge tech events.',
  workshops: 'Enhance your skills through hands-on training sessions conducted by experts in various domains.'
};

const EventCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  if (!category || !mockEvents[category as keyof typeof mockEvents]) {
    return <div>Category not found</div>;
  }
  
  const events = mockEvents[category as keyof typeof mockEvents];
  const title = categoryTitles[category];
  const description = categoryDescriptions[category];

  // Define background styles based on category
  const getBackgroundStyle = () => {
    switch (category) {
      case 'technical':
        return 'bg-technical text-white';
      case 'cultural':
        return 'bg-gradient-to-r from-cultural to-cultural/80';
      case 'sports':
        return 'bg-gradient-to-r from-sports to-sports/80 text-white';
      case 'workshops':
        return 'bg-white border-t border-b border-workshops/20';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className={`py-16 ${getBackgroundStyle()}`}>
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center text-sm mb-6 hover:opacity-80">
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg max-w-3xl mb-6">{description}</p>
          </div>
        </section>
        
        {/* Upcoming Events */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Upcoming {title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.upcoming.map((event) => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  venue={event.venue}
                  image={event.image}
                  category={event.category as 'cultural' | 'sports' | 'technical' | 'workshops'}
                  registrationUrl={event.registrationUrl}
                  brochureUrl={event.brochureUrl}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* City Level Events */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Bengaluru City Events</h2>
            <p className="text-gray-600 mb-8">Explore events happening across Bengaluru city</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.cityLevel.map((event) => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  venue={event.venue}
                  image={event.image}
                  category={event.category as 'cultural' | 'sports' | 'technical' | 'workshops'}
                  registrationUrl={event.registrationUrl}
                  brochureUrl={event.brochureUrl}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Past Events */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Past {title}</h2>
            <p className="text-gray-600 mb-8">Look back at our previous events</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.past.map((event) => (
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

export default EventCategory;
