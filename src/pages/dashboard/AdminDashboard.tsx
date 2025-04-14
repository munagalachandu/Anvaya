
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Award, CheckCircle, Clock, BookOpen, FileText } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Mock data
const mockParticipationLogs = [
  {
    id: '1',
    studentName: 'John Doe',
    studentId: 'S12345',
    event: 'National Level Hackathon',
    date: 'March 10-12, 2023',
    placement: '2nd Place',
    verified: true
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    studentId: 'S12346',
    event: 'College Dance Competition',
    date: 'February 25, 2023',
    placement: 'Participation',
    verified: true
  },
  {
    id: '3',
    studentName: 'David Wilson',
    studentId: 'S12347',
    event: 'Technical Symposium',
    date: 'April 2-4, 2023',
    placement: '1st Place',
    verified: true
  },
  {
    id: '4',
    studentName: 'Emily Brown',
    studentId: 'S12348',
    event: 'Paper Presentation',
    date: 'March 20, 2023',
    placement: 'Participation',
    verified: false
  },
  {
    id: '5',
    studentName: 'Michael Johnson',
    studentId: 'S12349',
    event: 'Cricket Tournament',
    date: 'April 15, 2023',
    placement: 'Runner-up',
    verified: false
  }
];

const mockVenueRequests = [
  {
    id: '1',
    venue: 'Main Auditorium',
    requestedBy: 'Prof. Smith',
    event: 'Annual Cultural Fest',
    date: 'May 15-17, 2023',
    status: 'Pending'
  },
  {
    id: '2',
    venue: 'Conference Hall',
    requestedBy: 'Prof. Johnson',
    event: 'Technical Symposium',
    date: 'June 10, 2023',
    status: 'Approved'
  },
  {
    id: '3',
    venue: 'Seminar Hall',
    requestedBy: 'Prof. Davis',
    event: 'Guest Lecture',
    date: 'May 25, 2023',
    status: 'Pending'
  }
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [isVenueDialogOpen, setIsVenueDialogOpen] = useState(false);
  
  const handleVerifyParticipation = (studentId: string) => {
    toast({
      title: "Participation verified",
      description: `Student ID ${studentId} participation has been verified.`
    });
  };
  
  const handleApproveVenue = (requestId: string) => {
    toast({
      title: "Venue request approved",
      description: "The venue booking request has been approved."
    });
  };
  
  const handleRejectVenue = (requestId: string) => {
    toast({
      title: "Venue request rejected",
      description: "The venue booking request has been rejected."
    });
  };

  // Filter participation logs based on selection
  const filteredLogs = filter === 'all' 
    ? mockParticipationLogs 
    : filter === 'verified' 
      ? mockParticipationLogs.filter(log => log.verified) 
      : mockParticipationLogs.filter(log => !log.verified);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500">Manage events, venues and participation records</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="mr-2">
                <Link to="/">Home</Link>
              </Button>
              <Button variant="destructive">Log Out</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">12 upcoming, 12 past</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Student Participations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-sm text-muted-foreground">42 pending verification</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Venue Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">3 pending approval</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="participations" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="participations">Participation Logs</TabsTrigger>
              <TabsTrigger value="venues">Venue Booking System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="participations">
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <CardTitle>Student Participation Records</CardTitle>
                      <CardDescription>
                        View and verify participation records uploaded by students
                      </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 w-full md:w-[200px]">
                      <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter records" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Records</SelectItem>
                          <SelectItem value="verified">Verified Only</SelectItem>
                          <SelectItem value="pending">Pending Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of student participation records</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Achievement</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{log.studentName}</span>
                              <span className="text-xs text-gray-500">{log.studentId}</span>
                            </div>
                          </TableCell>
                          <TableCell>{log.event}</TableCell>
                          <TableCell>{log.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <Award size={14} /> {log.placement}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.verified ? (
                              <Badge variant="secondary" className="flex items-center w-fit gap-1">
                                <CheckCircle size={14} /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center w-fit gap-1">
                                <Clock size={14} /> Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost">
                                <FileText size={16} />
                              </Button>
                              {!log.verified && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleVerifyParticipation(log.studentId)}
                                >
                                  Verify
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="venues">
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="w-full md:w-2/3 animate-fade-in">
                  <CardHeader>
                    <CardTitle>Venue Booking Requests</CardTitle>
                    <CardDescription>
                      Approve or reject venue booking requests from faculty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>A list of venue booking requests</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Venue</TableHead>
                          <TableHead>Requested By</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockVenueRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.venue}</TableCell>
                            <TableCell>{request.requestedBy}</TableCell>
                            <TableCell>{request.event}</TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={request.status === 'Approved' ? 'default' : 'outline'}
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {request.status === 'Pending' && (
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleRejectVenue(request.id)}
                                  >
                                    Reject
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApproveVenue(request.id)}
                                  >
                                    Approve
                                  </Button>
                                </div>
                              )}
                              {request.status === 'Approved' && (
                                <div className="flex justify-end">
                                  <Button size="sm" variant="ghost">Details</Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card className="w-full md:w-1/3 animate-fade-in">
                  <CardHeader>
                    <CardTitle>Venue Management</CardTitle>
                    <CardDescription>Check availability and manage venues</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Dialog open={isVenueDialogOpen} onOpenChange={setIsVenueDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full flex items-center space-x-2" variant="outline">
                          <Calendar size={18} />
                          <span>Check Availability</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Venue Availability</DialogTitle>
                          <DialogDescription>
                            Check venue availability for specific dates
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">Venue Calendar</h3>
                          <p className="text-gray-500 mb-4">
                            This is a placeholder for the venue availability calendar. In a complete implementation, 
                            you would see a calendar view of all booked and available venues.
                          </p>
                        </div>
                        
                        <DialogFooter>
                          <Button onClick={() => setIsVenueDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button className="w-full flex items-center space-x-2" variant="outline">
                      <BookOpen size={18} />
                      <span>Generate Reports</span>
                    </Button>
                    
                    <div className="rounded-lg border p-4 bg-gray-50">
                      <h3 className="font-medium mb-2">Venue Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total venues:</span>
                          <span className="font-medium">6</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Currently booked:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending requests:</span>
                          <span className="font-medium">2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium">3</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
