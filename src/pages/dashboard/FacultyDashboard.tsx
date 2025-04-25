import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Calendar, Users, MapPin, Clock, CalendarDays, BookOpen, User, Award } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

// Mock data
const mockMyEvents = [
  {
    id: '1',
    title: 'Web Development Workshop',
    date: 'June 15, 2023',
    venue: 'Lab 101',
    status: 'Upcoming',
    participants: 35
  },
  {
    id: '2',
    title: 'Technical Symposium',
    date: 'July 10-12, 2023',
    venue: 'CS Department',
    status: 'Planning',
    participants: 0
  }
];

const mockStudentParticipations = [
  {
    id: '1',
    name: 'John Doe',
    eventName: 'Web Development Workshop (April 2023)',
    certificate: true,
    placement: 'Participation',
    verified: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    eventName: 'Technical Symposium (April 2023)',
    certificate: true,
    placement: '1st Place',
    verified: true
  },
  {
    id: '3',
    name: 'David Wilson',
    eventName: 'Technical Symposium (April 2023)',
    certificate: true,
    placement: '2nd Place',
    verified: false
  }
];

const FacultyDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  const handleAddEvent = () => {
    setIsEventDialogOpen(false);
    toast({
      title: "Event added",
      description: "Your event has been added successfully."
    });
  };
  
  const handleLogout = () => {
    // Optional: Clear auth tokens, session data, etc.
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system."
    });
    
    // Redirect to login page
    navigate('/login');
  };
  
  const handleVerifyParticipation = (studentId) => {
    toast({
      title: "Participation verified",
      description: "The student's participation has been verified."
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
              <p className="text-gray-500">Manage your events and student participations</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant="outline" className="mr-2">
                <Link to="/events/cultural">Events</Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
          
          <Tabs defaultValue="myEvents" className="w-full">
            <TabsList className="grid w-full md:w-[600px] grid-cols-3">
              <TabsTrigger value="myEvents">Manage Events</TabsTrigger>
              <TabsTrigger value="participations">Student Participations</TabsTrigger>
              <TabsTrigger value="venue">Venue Booking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="myEvents">
              <div className="flex justify-between items-center mt-6 mb-4">
                <h2 className="text-xl font-bold">My Events</h2>
                
                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <PlusCircle size={16} />
                      <span>Add Event</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>
                        Enter the details of the event you're coordinating
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Event Title</Label>
                          <Input id="event-title" placeholder="Enter event title" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="event-category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="workshops">Workshops</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" placeholder="Enter venue" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter event description" rows={3} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-name">Guest/Speaker Name</Label>
                          <Input id="guest-name" placeholder="Enter name if applicable" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="guest-contact">Guest/Speaker Contact</Label>
                          <Input id="guest-contact" placeholder="Enter contact details" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="session-details">Session Details</Label>
                        <Textarea id="session-details" placeholder="Enter session details, schedule, etc." rows={3} />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddEvent}>Add Event</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMyEvents.map(event => (
                  <Card key={event.id} className="animate-fade-in">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant={event.status === 'Upcoming' ? 'default' : 'outline'}>
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
                        <div className="flex items-center space-x-1 text-sm mt-1">
                          <Users size={14} />
                          <span>{event.participants} participants</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button variant="secondary">Edit</Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="border-2 border-dashed border-gray-200 bg-transparent flex flex-col items-center justify-center p-6 h-[220px] cursor-pointer hover:bg-gray-50 transition-colors animate-fade-in">
                      <PlusCircle size={32} className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">Add New Event</h3>
                      <p className="text-sm text-gray-500 text-center">Click to add a new event you're coordinating</p>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    {/* Same content as the dialog above */}
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            
            <TabsContent value="participations">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Student Participations</CardTitle>
                  <CardDescription>
                    Verify and manage student participation records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-gray-50 border-b">
                      <div className="col-span-3">Student</div>
                      <div className="col-span-5">Event</div>
                      <div className="col-span-2">Placement</div>
                      <div className="col-span-2">Action</div>
                    </div>
                    
                    {mockStudentParticipations.map(student => (
                      <div key={student.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0">
                        <div className="col-span-3 flex items-center gap-2">
                          <User size={18} className="text-gray-500" />
                          <span>{student.name}</span>
                        </div>
                        <div className="col-span-5">{student.eventName}</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Award size={14} /> {student.placement}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          {student.verified ? (
                            <Badge variant="secondary" className="w-fit">Verified</Badge>
                          ) : (
                            <Button size="sm" onClick={() => handleVerifyParticipation(student.id)}>
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="venue">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Venue Booking System</CardTitle>
                  <CardDescription>
                    Check venue availability and manage bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button className="flex items-center space-x-2 flex-1" variant="outline">
                      <Calendar size={18} />
                      <span>Check Availability</span>
                    </Button>
                    <Button className="flex items-center space-x-2 flex-1" variant="outline">
                      <BookOpen size={18} />
                      <span>Requests Received</span>
                    </Button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Venue Booking Module</h3>
                    <p className="text-gray-500 mb-4">
                      This is a placeholder for the venue booking system. In a complete implementation, 
                      you would be able to check availability and manage venue bookings here.
                    </p>
                    <Button>Open Booking Calendar</Button>
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

export default FacultyDashboard;