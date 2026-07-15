import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useTheme } from '@/components/theme-provider'
import { authService } from '@/services/authService'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

// Demo credentials for easy testing
const demoCredentials = [
    { email: 'hod@college.edu', password: 'password123', role: 'HOD' },
    { email: 'staff1@college.edu', password: 'password123', role: 'Staff' },
    { email: 'student1@college.edu', password: 'password123', role: 'Student' },
    { email: 'parent1@example.com', password: 'password123', role: 'Parent' },
]

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { setTheme } = useTheme()
    const { toast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsSubmitting(true)
        setError(null)
        
        try {
            const response = await authService.login(data)
            
            login(response.data.token, response.data.user)
            
            toast({
                title: 'Welcome back!',
                description: `Logged in as ${response.data.user.firstName} ${response.data.user.lastName}`,
            })
            
            navigate('/', { replace: true })
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Login failed. Please try again.'
            setError(errorMessage)
            toast({
                title: 'Login failed',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const fillDemoCredentials = (email: string, password: string) => {
        form.setValue('email', email)
        form.setValue('password', password)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 relative">
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            <div className="w-full max-w-md space-y-4">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-white">CT</span>
                        </div>
                        <CardTitle className="text-3xl font-bold">CampusTrack</CardTitle>
                        <CardDescription>
                            College Activity Monitoring System
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="your.email@college.edu" {...field} />
                                            </FormControl>
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
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button variant="link" className="text-sm text-muted-foreground">
                            Forgot password?
                        </Button>
                    </CardFooter>
                </Card>
                
                {/* Demo Credentials Card */}
                <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-sm">Demo Credentials</CardTitle>
                        <CardDescription className="text-xs">Click to auto-fill</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        {demoCredentials.map((cred) => (
                            <Button
                                key={cred.email}
                                variant="outline"
                                size="sm"
                                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                                className="text-xs"
                            >
                                {cred.role}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
