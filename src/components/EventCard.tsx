
import React from 'react';
import { CalendarDays, MapPin, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
  category: 'cultural' | 'sports' | 'technical' | 'workshops';
  registrationUrl?: string;
  brochureUrl?: string;
  isPast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  venue,
  image,
  category,
  registrationUrl,
  brochureUrl,
  isPast = false
}) => {
  const categoryClasses = {
    'cultural': 'event-card-cultural',
    'sports': 'event-card-sports',
    'technical': 'event-card-technical',
    'workshops': 'event-card-workshops'
  };

  const categoryTextClasses = {
    'cultural': 'text-cultural-foreground',
    'sports': 'text-white',
    'technical': 'text-technical-foreground',
    'workshops': 'text-gray-800'
  };

  return (
    <div className={`event-card ${categoryClasses[category]} overflow-hidden`}>
      <div className="h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <h3 className={`text-lg font-bold mb-2 ${categoryTextClasses[category]}`}>{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className={`flex items-center space-x-2 ${categoryTextClasses[category]} text-sm opacity-90`}>
            <CalendarDays size={16} />
            <span>{date}</span>
          </div>
          
          <div className={`flex items-center space-x-2 ${categoryTextClasses[category]} text-sm opacity-90`}>
            <MapPin size={16} />
            <span>{venue}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          {brochureUrl && (
            <a 
              href={brochureUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-1 text-sm font-medium p-2 rounded-md 
                bg-white/20 hover:bg-white/30 transition-colors ${categoryTextClasses[category]}`}
            >
              <ExternalLink size={14} />
              <span>View Brochure</span>
            </a>
          )}
          
          {isPast ? (
            <Link 
              to={`/events/${category}/${id}`}
              className={`flex items-center justify-center space-x-1 text-sm font-medium p-2 rounded-md 
                bg-white/20 hover:bg-white/30 transition-colors ${categoryTextClasses[category]}`}
            >
              <Users size={14} />
              <span>View Summary</span>
            </Link>
          ) : registrationUrl ? (
            <a 
              href={registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="secondary" className="w-full">Register Now</Button>
            </a>
          ) : (
            <Link to={`/events/${category}/${id}`} className="w-full">
              <Button variant="secondary" className="w-full">Explore</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
