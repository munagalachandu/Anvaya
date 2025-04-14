
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Key } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'student';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock authentication logic - in a real app, you'd validate with a backend
      if (values.email === 'admin@example.com' && values.password === 'password') {
        toast({
          title: "Login successful",
          description: `Welcome back, ${role}!`,
        });
        
        // Redirect based on role
        switch(role) {
          case 'student':
            navigate('/dashboard/student');
            break;
          case 'faculty':
            navigate('/dashboard/faculty');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const roleLabels = {
    'student': 'Student Login',
    'faculty': 'Faculty Login',
    'admin': 'Administrator Login'
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{roleLabels[role as keyof typeof roleLabels]}</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="your.email@example.com" 
                        className="pl-10" 
                        {...field} 
                      />
                      <User 
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the email associated with your account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10" 
                        {...field} 
                      />
                      <Key 
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    For demo, use admin@example.com / password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Not registered? Contact your department administrator.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
