import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Types
interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

interface DebateSession {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  participants: Participant[];
  messages: Message[];
  status: 'pending' | 'active' | 'ended';
  createdAt: Date;
  tags: string[];
  code: string;
  summary?: string;
  warnings: number;
}

interface DebateRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  code?: string;
}

interface DebateContextType {
  activeSessions: DebateSession[];
  myRequests: DebateRequest[];
  currentSession: DebateSession | null;
  createDebateRequest: (title: string, description: string, tags: string[]) => Promise<void>;
  joinDebate: (sessionId: string) => Promise<void>;
  startDebate: (requestId: string) => Promise<void>;
  endDebate: (sessionId: string, thankYouNote: string) => Promise<void>;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
  setCurrentSession: (session: DebateSession | null) => void;
  loading: boolean;
}

// Initial mock data
const mockSessions: DebateSession[] = [
  {
    id: '1',
    title: 'Debate on AI Ethics',
    description: 'Discussing the ethical implications of AI development and deployment.',
    hostId: '2',
    hostName: 'John Doe',
    hostAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=John',
    participants: [
      { id: '2', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=John' },
      { id: '3', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane' },
      { id: '4', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex' }
    ],
    messages: [],
    status: 'active',
    createdAt: new Date(),
    tags: ['AI', 'Ethics', 'Technology'],
    code: 'AI-ETH-123',
    warnings: 0
  },
  {
    id: '2',
    title: 'Future of Remote Work',
    description: 'How will remote work shape the future of employment?',
    hostId: '3',
    hostName: 'Jane Smith',
    hostAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane',
    participants: [
      { id: '3', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane' },
      { id: '4', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex' }
    ],
    messages: [],
    status: 'active',
    createdAt: new Date(),
    tags: ['Work', 'Remote', 'Future'],
    code: 'RMT-WRK-456',
    warnings: 0
  }
];

const mockRequests: DebateRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Demo User',
    userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
    title: 'Impact of Blockchain on Finance',
    description: 'How will blockchain technology transform the financial industry?',
    tags: ['Blockchain', 'Finance', 'Technology'],
    status: 'pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    userId: '1',
    userName: 'Demo User',
    userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
    title: 'Climate Change Solutions',
    description: 'Discussing effective approaches to combat climate change.',
    tags: ['Climate', 'Environment', 'Policy'],
    status: 'approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    code: 'CLM-CHG-789'
  }
];

// Create the debate context
const DebateContext = createContext<DebateContextType | undefined>(undefined);

// AI response function (simulated)
const generateAIResponse = async (prompt: string): Promise<string> => {
  // In a real app, this would call an API like OpenAI
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate different responses based on prompt content
  if (prompt.toLowerCase().includes('hate') || prompt.toLowerCase().includes('stupid')) {
    return "⚠️ Warning: Please keep the conversation respectful and constructive. Personal attacks or offensive language are not allowed.";
  }
  
  if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('question')) {
    return "I'm here to help facilitate this debate. Remember to support your arguments with evidence and stay on topic.";
  }
  
  if (prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('summary')) {
    return "Based on the conversation so far, the key points discussed include the importance of ethical considerations, the need for regulation, and the potential benefits and risks. Participants have shared diverse perspectives on this topic.";
  }
  
  // Default response
  return "I'm monitoring this debate to ensure it stays constructive and on-topic. Continue sharing your perspectives while respecting others' viewpoints.";
};

// Provider component
export const DebateProvider = ({ children }: { children: ReactNode }) => {
  const [activeSessions, setActiveSessions] = useState<DebateSession[]>(mockSessions);
  const [myRequests, setMyRequests] = useState<DebateRequest[]>(mockRequests);
  const [currentSession, setCurrentSession] = useState<DebateSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Create a debate request
  const createDebateRequest = async (title: string, description: string, tags: string[]) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: DebateRequest = {
        id: Date.now().toString(),
        userId: '1', // Should come from auth context in a real app
        userName: 'Demo User',
        userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
        title,
        description,
        tags,
        status: 'pending',
        createdAt: new Date()
      };
      
      setMyRequests(prev => [newRequest, ...prev]);
      
      // Simulate AI approval after 3 seconds
      setTimeout(() => {
        approveDebateRequest(newRequest.id);
      }, 3000);
      
      toast.success('Debate request created successfully');
    } catch (error) {
      toast.error('Failed to create debate request');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Approve a debate request (simulated AI approval)
  const approveDebateRequest = (requestId: string) => {
    setMyRequests(prev => 
      prev.map(request => 
        request.id === requestId
          ? { 
              ...request, 
              status: 'approved', 
              code: `${request.tags[0]?.substring(0, 3).toUpperCase() || 'DBT'}-${Math.floor(Math.random() * 1000)}` 
            }
          : request
      )
    );
    
    toast.success('Your debate request has been approved! You can now start the debate session.');
  };

  // Start a debate session
  const startDebate = async (requestId: string) => {
    try {
      setLoading(true);
      
      // Find the approved request
      const request = myRequests.find(req => req.id === requestId && req.status === 'approved');
      
      if (!request) {
        throw new Error('Debate request not found or not approved');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSession: DebateSession = {
        id: Date.now().toString(),
        title: request.title,
        description: request.description,
        hostId: '1', // Should come from auth context in a real app
        hostName: 'Demo User',
        hostAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
        participants: [
          { id: '1', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo' }
        ],
        messages: [],
        status: 'active',
        createdAt: new Date(),
        tags: request.tags,
        code: request.code || 'DBT-000',
        warnings: 0
      };
      
      setActiveSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      
      // Add AI welcome message
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          senderId: 'ai',
          senderName: 'DebateAI',
          senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
          content: `Welcome to the debate on "${request.title}". I'll be moderating this session. Please keep the conversation respectful and on-topic. Once three participants have joined, you can begin the discussion.`,
          timestamp: new Date(),
          isAI: true
        };
        
        addMessageToSession(newSession.id, aiMessage);
      }, 1000);
      
      toast.success('Debate session started');
    } catch (error) {
      toast.error('Failed to start debate session');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Join a debate session
  const joinDebate = async (sessionId: string) => {
    try {
      setLoading(true);
      
      // Find the session
      const session = activeSessions.find(s => s.id === sessionId);
      
      if (!session) {
        throw new Error('Debate session not found');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is already a participant
      const isParticipant = session.participants.some(p => p.id === '1');
      
      if (!isParticipant) {
        // Add user to participants
        const updatedSession = {
          ...session,
          participants: [
            ...session.participants,
            { id: '1', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo' }
          ]
        };
        
        // Update the session
        setActiveSessions(prev => 
          prev.map(s => s.id === sessionId ? updatedSession : s)
        );
        
        setCurrentSession(updatedSession);
        
        // Add AI notification
        const aiMessage: Message = {
          id: Date.now().toString(),
          senderId: 'ai',
          senderName: 'DebateAI',
          senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
          content: `Demo User has joined the debate. ${updatedSession.participants.length >= 3 ? 'There are now enough participants to begin the discussion.' : ''}`,
          timestamp: new Date(),
          isAI: true
        };
        
        addMessageToSession(sessionId, aiMessage);
      } else {
        setCurrentSession(session);
      }
      
      toast.success('Joined debate session');
    } catch (error) {
      toast.error('Failed to join debate session');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // End a debate session
  const endDebate = async (sessionId: string, thankYouNote: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update session status
      setActiveSessions(prev => 
        prev.map(session => 
          session.id === sessionId
            ? { ...session, status: 'ended' }
            : session
        )
      );
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => 
          prev ? { ...prev, status: 'ended' } : null
        );
        
        // Add thank you note as message
        const thankYouMessage: Message = {
          id: Date.now().toString(),
          senderId: '1',
          senderName: 'Demo User',
          senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
          content: thankYouNote,
          timestamp: new Date()
        };
        
        addMessageToSession(sessionId, thankYouMessage);
        
        // Generate AI summary
        const aiSummary = "Thank you all for participating in this debate. Key points discussed included the ethical implications of AI, the need for regulatory frameworks, and the balance between innovation and safety. The debate highlighted diverse perspectives and raised important questions for future consideration.";
        
        setTimeout(() => {
          const summaryMessage: Message = {
            id: Date.now().toString(),
            senderId: 'ai',
            senderName: 'DebateAI',
            senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
            content: `Debate Summary: ${aiSummary}`,
            timestamp: new Date(),
            isAI: true
          };
          
          addMessageToSession(sessionId, summaryMessage);
          
          setCurrentSession(prev => 
            prev ? { ...prev, summary: aiSummary } : null
          );
        }, 2000);
      }
      
      toast.success('Debate session ended');
    } catch (error) {
      toast.error('Failed to end debate session');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message in a debate session
  const sendMessage = async (sessionId: string, content: string) => {
    try {
      // Find the session
      const session = activeSessions.find(s => s.id === sessionId);
      
      if (!session || session.status !== 'active') {
        throw new Error('Debate session not found or not active');
      }
      
      // Create the message
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: '1',
        senderName: 'Demo User',
        senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo',
        content,
        timestamp: new Date()
      };
      
      // Add the message to the session
      addMessageToSession(sessionId, newMessage);
      
      // Check if message contains prohibited content (simulated AI moderation)
      const hasProhibitedContent = 
        content.toLowerCase().includes('hate') || 
        content.toLowerCase().includes('stupid') || 
        content.toLowerCase().includes('idiot');
      
      if (hasProhibitedContent) {
        // Update session warnings
        updateSessionWarnings(sessionId);
      }
      
      // Generate AI response if needed
      setTimeout(async () => {
        if (content.includes('?') || content.toLowerCase().includes('ai') || hasProhibitedContent) {
          const aiResponse = await generateAIResponse(content);
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            senderId: 'ai',
            senderName: 'DebateAI',
            senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
            content: aiResponse,
            timestamp: new Date(),
            isAI: true
          };
          
          addMessageToSession(sessionId, aiMessage);
        }
      }, 1500);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  // Helper function to add a message to a session
  const addMessageToSession = (sessionId: string, message: Message) => {
    setActiveSessions(prev => 
      prev.map(session => 
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
    
    setCurrentSession(prev => 
      prev?.id === sessionId
        ? { ...prev, messages: [...prev.messages, message] }
        : prev
    );
  };

  // Helper function to update session warnings
  const updateSessionWarnings = (sessionId: string) => {
    setActiveSessions(prev => 
      prev.map(session => {
        if (session.id !== sessionId) return session;
        
        const newWarnings = session.warnings + 1;
        
        if (newWarnings >= 3) {
          // Terminate session after 3 warnings
          setTimeout(() => {
            const terminationMessage: Message = {
              id: Date.now().toString(),
              senderId: 'ai',
              senderName: 'DebateAI',
              senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
              content: 'Due to repeated violations of our community guidelines, this debate session is being terminated.',
              timestamp: new Date(),
              isAI: true
            };
            
            addMessageToSession(sessionId, terminationMessage);
            
            // End the session
            setActiveSessions(prev => 
              prev.map(s => 
                s.id === sessionId
                  ? { ...s, status: 'ended' }
                  : s
              )
            );
            
            setCurrentSession(prev => 
              prev?.id === sessionId
                ? { ...prev, status: 'ended' }
                : prev
            );
            
            toast.error('Debate session terminated due to policy violations');
          }, 2000);
        }
        
        return { ...session, warnings: newWarnings };
      })
    );
    
    setCurrentSession(prev => {
      if (!prev || prev.id !== sessionId) return prev;
      
      const newWarnings = prev.warnings + 1;
      
      return { ...prev, warnings: newWarnings };
    });
  };

  return (
    <DebateContext.Provider value={{ 
      activeSessions,
      myRequests,
      currentSession,
      createDebateRequest,
      joinDebate,
      startDebate,
      endDebate,
      sendMessage,
      setCurrentSession,
      loading
    }}>
      {children}
    </DebateContext.Provider>
  );
};

// Custom hook to use the debate context
export const useDebate = () => {
  const context = useContext(DebateContext);
  
  if (context === undefined) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  
  return context;
};
