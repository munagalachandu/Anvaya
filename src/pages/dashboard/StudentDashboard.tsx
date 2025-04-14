
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Upload, Award, MapPin, CalendarDays, Clock, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Mock data
const mockRegisteredEvents = [
  {
    id: '1',
    title: 'Annual Cultural Fest 2023',
    date: 'May 15-17, 2023',
    venue: 'Main Auditorium',
    status: 'Upcoming'
  },
  {
    id: '2',
    title: 'Tech Hackathon 2023',
    date: 'June 5-7, 2023',
    venue: 'CS Department',
    status: 'Registered'
  }
];

const StudentDashboard = () => {
  const { toast } = useToast();
  
  const handleUpload = () => {
    toast({
      title: "Certificate uploaded",
      description: "Your certificate has been uploaded successfully."
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-gray-500">Manage your events and participation</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant="outline" className="mr-2">
                <Link to="/events/cultural">Events</Link>
              </Button>
              <Button variant="destructive">Log Out</Button>
            </div>
          </div>
          
          <Tabs defaultValue="registered" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="registered">Registered Events</TabsTrigger>
              <TabsTrigger value="participation">My Participation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="registered">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {mockRegisteredEvents.map(event => (
                  <Card key={event.id} className="animate-fade-in">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant={event.status === 'Upcoming' ? 'outline' : 'default'}>
                          {event.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center space-x-1 text-sm">
                          <CalendarDays size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm mt-1">
                          <MapPin size={14} />
                          <span>{event.venue}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-2 border-dashed border-gray-200 bg-transparent flex flex-col items-center justify-center p-6 h-[220px] animate-fade-in">
                  <Calendar size={32} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Find New Events</h3>
                  <Button asChild variant="secondary">
                    <Link to="/events/cultural">Browse Events</Link>
                  </Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="participation">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Upload Participation Details</CardTitle>
                  <CardDescription>
                    Add information about events you've participated in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-name">Event Name</Label>
                      <Input id="event-name" placeholder="Enter event name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input id="event-date" placeholder="Select date" type="date" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-venue">Venue</Label>
                      <Input id="event-venue" placeholder="Enter venue" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placement">Placement (if any)</Label>
                      <Input id="placement" placeholder="e.g., 1st Place, Runner-up" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate">Certificate Upload</Label>
                    <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Drag and drop your certificate here, or click to browse</p>
                      <Input id="certificate" type="file" className="hidden" />
                      <Button variant="outline" onClick={() => document.getElementById('certificate')?.click()}>
                        Select File
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleUpload}>Upload Participation</Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>My Achievements</CardTitle>
                  <CardDescription>
                    Your past participations and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border-b">
                      <div className="flex-1">
                        <div className="font-medium">National Level Hackathon</div>
                        <div className="text-sm text-gray-500">March 10-12, 2023</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Award size={14} /> 2nd Place
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle size={14} /> Verified
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
                      <div className="flex-1">
                        <div className="font-medium">College Dance Competition</div>
                        <div className="text-sm text-gray-500">February 25, 2023</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Award size={14} /> Participation
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock size={14} /> Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
