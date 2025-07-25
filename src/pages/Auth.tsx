
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageGridAuth } from '@/components/auth/ImageGridAuth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'credentials' | 'image-grid'>('credentials');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [imagePasscode, setImagePasscode] = useState<number[]>([]);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email) {
        toast.error('Please enter your email');
        return;
      }
    } else if (mode === 'signup') {
      if (!email || !name) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setStep('image-grid');
  };

  const handleImageGridComplete = async (selectedImages: number[]) => {
    setImagePasscode(selectedImages);
    
    try {
      if (mode === 'login') {
        // In a real app, you would verify this passcode sequence against the stored one
        // Here we just mock it with a direct login
        await login(email, JSON.stringify(selectedImages));
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        // In a real app, you would store this passcode sequence securely
        await register(name, email, JSON.stringify(selectedImages));
        toast.success('Account created successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Authentication failed');
      setStep('credentials');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setStep('credentials');
    setEmail('');
    setName('');
    setImagePasscode([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-debate-primary mb-4 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-white text-2xl font-bold">DC</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">
            {mode === 'login' ? 'Welcome Back' : 'Join DebateConnect'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Sign in using your visual passcode' 
              : 'Create an account to start debating'}
          </p>
        </div>

        {step === 'credentials' ? (
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleCredentialsSubmit}>
              {mode === 'signup' && (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-gray-300 focus:border-debate-primary focus:ring focus:ring-debate-primary/20"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-debate-primary focus:ring focus:ring-debate-primary/20"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-debate-primary hover:bg-debate-secondary transition-all duration-300"
              >
                {mode === 'login' ? 'Continue to Visual Passcode' : 'Continue to Create Passcode'}
              </Button>
              
              <div className="text-center text-sm mt-4">
                <span className="text-gray-600">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="text-debate-primary font-medium ml-1 hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            className="transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ImageGridAuth
              mode={mode}
              onComplete={handleImageGridComplete}
              size={4}
            />
            <button
              onClick={() => setStep('credentials')}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 block mx-auto flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to previous step
            </button>
          </motion.div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Using Visual Grid Password Authentication</p>
          <p className="mt-1">Select 4 images in sequence for enhanced security</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
