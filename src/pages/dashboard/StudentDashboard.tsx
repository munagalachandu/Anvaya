import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Award, MapPin, CalendarDays, Clock, CheckCircle, Link, ExternalLink, Upload } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [placement, setPlacement] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const studentId = parseInt(localStorage.getItem("studentId"));

  useEffect(() => {
    if (studentId) {
      fetchRegisteredEvents(studentId);
      fetchAchievements(studentId);
    } else {
      toast({
        title: "Error",
        description: "Student ID not found. Please login again.",
      });
      navigate('/login');
    }
  }, [studentId, navigate, toast]);

  const fetchRegisteredEvents = async (studentId) => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`http://localhost:5000/student_events/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });

      if (response.status === 200) {
        setRegisteredEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching registered events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registered events. Please try again.",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAchievements = async (studentId) => {
    setLoadingAchievements(true);
    try {
      const response = await axios.get(`http://localhost:5000/student_achievements/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
      });

      if (response.status === 200) {
        setAchievements(response.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error",
        description: "Failed to fetch achievements. Please try again.",
      });
    } finally {
      setLoadingAchievements(false);
    }
  };

  const handleUploadAchievement = async () => {
    if (!eventName || !eventDate || !venue || !certificateFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload a certificate file.",
      });
      return;
    }

    setIsUploading(true);

    // Create form data to send file
    const formData = new FormData();
    formData.append('event_name', eventName);
    formData.append('event_date', eventDate);
    formData.append('venue', venue);
    formData.append('placement', placement);
    formData.append('certificate', certificateFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/student_add_achievement/${studentId}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast({
          title: "Achievement uploaded",
          description: "Your achievement has been uploaded successfully and is pending verification.",
        });

        setEventName('');
        setEventDate('');
        setVenue('');
        setPlacement('');
        setCertificateFile(null);

        fetchAchievements(studentId);
      }
    } catch (error) {
      console.error("Failed to upload achievement:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload achievement. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system."
    });
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-gray-500">Manage your events and achievements</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <RouterLink to="/">Home</RouterLink>
              </Button>
              <Button asChild variant="outline" className="mr-2">
                <RouterLink to="/events/cultural">Events</RouterLink>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
          
          <Tabs defaultValue="registered" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="registered">Registered Events</TabsTrigger>
              <TabsTrigger value="participation">My Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="registered">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loadingEvents ? (
                  <div className="col-span-full flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                  </div>
                ) : registeredEvents.length > 0 ? (
                  registeredEvents.map(event => (
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
                            <span>{event.start_date} - {event.end_date}</span>
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
                  ))
                ) : (
                  <Card className="col-span-full text-center p-8 bg-gray-50 rounded-md animate-fade-in">
                    <Calendar size={36} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Registered Events</h3>
                    <p className="text-gray-500">
                      You haven't registered for any events yet.
                    </p>
                    <Button asChild variant="secondary" className="mt-4">
                      <RouterLink to="/events/cultural">Browse Events</RouterLink>
                    </Button>
                  </Card>
                )}
                
                <Card className="border-2 border-dashed border-gray-200 bg-transparent flex flex-col items-center justify-center p-6 h-[220px] animate-fade-in">
                  <Calendar size={32} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Find New Events</h3>
                  <Button asChild variant="secondary">
                    <RouterLink to="/events/cultural">Browse Events</RouterLink>
                  </Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="participation">
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Upload Achievement</CardTitle>
                  <CardDescription>
                    Add details about events you've participated in
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-name">Event Name</Label>
                      <Input 
                        id="event-name" 
                        placeholder="Enter event name" 
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input 
                        id="event-date" 
                        type="date" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-venue">Venue</Label>
                      <Input 
                        id="event-venue" 
                        placeholder="Enter venue" 
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placement">Placement (if any)</Label>
                      <Input 
                        id="placement" 
                        placeholder="e.g., 1st Place, Runner-up" 
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-file">Certificate File</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input 
                          id="certificate-file" 
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        {certificateFile ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle size={16} className="mr-1" /> {certificateFile.name.length > 25 ? 
                              certificateFile.name.substring(0, 25) + '...' : 
                              certificateFile.name}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Upload size={16} className="mr-1" /> Support PDF, JPG, PNG
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEventName('');
                      setEventDate('');
                      setVenue('');
                      setPlacement('');
                      setCertificateFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUploadAchievement}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Achievement'
                    )}
                  </Button>
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
                  {loadingAchievements ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600"></div>
                    </div>
                  ) : achievements.length > 0 ? (
                    <div className="rounded-md border">
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0"
                        >
                          <div className="col-span-3">
                            <div className="font-medium">{achievement.event_name}</div>
                            <div className="text-sm text-gray-500">{achievement.date}</div>
                            <div className="text-sm text-gray-500">{achievement.venue}</div>
                          </div>
                          <div className="col-span-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Award size={14} /> 
                              {achievement.placement || 'Participation'}
                            </Badge>
                          </div>
                          <div className="col-span-3">
                            <Badge 
                              variant={achievement.verification === 'Verified' ? 'secondary' : 'outline'} 
                              className="flex items-center gap-1"
                            >
                              {achievement.verification === 'Verified' ? (
                                <>
                                  <CheckCircle size={14} /> Verified
                                </>
                              ) : (
                                <>
                                  <Clock size={14} /> Pending
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="col-span-3">
                            {achievement.certificate && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(achievement.certificate, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink size={14} />
                                View Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <Award size={36} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Achievements Found</h3>
                      <p className="text-gray-500">
                        You haven't uploaded any achievements yet.
                      </p>
                    </div>
                  )}
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