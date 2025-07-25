import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  user: User;
  tags: string[];
  upvotes: number;
  comments: Comment[];
  timestamp: Date;
  views: number;
}

interface QuestionContextType {
  questions: Question[];
  myQuestions: Question[];
  answeredQuestions: Question[];
  followingQuestions: Question[];
  popularQuestions: Question[];
  createQuestion: (title: string, content: string, tags: string[]) => Promise<void>;
  upvoteQuestion: (id: string) => void;
  commentOnQuestion: (questionId: string, content: string) => Promise<void>;
  loading: boolean;
}

// Sample mock data
const mockUsers: User[] = [
  { id: '1', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Demo' },
  { id: '2', name: 'User 1', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User1' },
  { id: '3', name: 'User 2', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User2' },
  { id: '4', name: 'User 3', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User3' },
  { id: '5', name: 'User 4', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User4' },
  { id: '6', name: 'User 5', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User5' },
];

const generateMockQuestions = (count: number): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
    const user = mockUsers[randomUserIndex];
    
    questions.push({
      id: `q${i + 1}`,
      title: 'What is the impact of AI on future jobs?',
      content: 'AI is transforming the job market, but is it creating more opportunities or taking them away?',
      user,
      tags: ['AI', 'Jobs', 'Future'],
      upvotes: Math.floor(Math.random() * 1000),
      comments: [],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      views: Math.floor(Math.random() * 5000)
    });
  }
  
  return questions;
};

const mockAllQuestions = generateMockQuestions(20);
const mockMyQuestions = mockAllQuestions.slice(0, 3).map(q => ({ ...q, user: mockUsers[0] }));
const mockAnsweredQuestions = mockAllQuestions.slice(3, 6);
const mockFollowingQuestions = mockAllQuestions.slice(6, 9);
const mockPopularQuestions = [...mockAllQuestions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 10);

// Create the question context
const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Provider component
export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>(mockAllQuestions);
  const [myQuestions, setMyQuestions] = useState<Question[]>(mockMyQuestions);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>(mockAnsweredQuestions);
  const [followingQuestions, setFollowingQuestions] = useState<Question[]>(mockFollowingQuestions);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>(mockPopularQuestions);
  const [loading, setLoading] = useState<boolean>(false);

  // Create a new question
  const createQuestion = async (title: string, content: string, tags: string[]) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newQuestion: Question = {
        id: `q${Date.now()}`,
        title,
        content,
        user: mockUsers[0], // Current user
        tags,
        upvotes: 0,
        comments: [],
        timestamp: new Date(),
        views: 0
      };
      
      setQuestions(prev => [newQuestion, ...prev]);
      setMyQuestions(prev => [newQuestion, ...prev]);
      
      toast.success('Question posted successfully');
      return;
    } catch (error) {
      toast.error('Failed to post question');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Upvote a question
  const upvoteQuestion = (id: string) => {
    const updateQuestions = (questionsList: Question[]): Question[] => {
      return questionsList.map(q => 
        q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
      );
    };
    
    setQuestions(updateQuestions);
    setMyQuestions(updateQuestions);
    setAnsweredQuestions(updateQuestions);
    setFollowingQuestions(updateQuestions);
    
    // Update popular questions and sort them again
    setPopularQuestions(prev => {
      const updated = updateQuestions(prev);
      return [...updated].sort((a, b) => b.upvotes - a.upvotes);
    });
    
    toast.success('Question upvoted');
  };

  // Comment on a question
  const commentOnQuestion = async (questionId: string, content: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComment: Comment = {
        id: `c${Date.now()}`,
        user: mockUsers[0], // Current user
        content,
        timestamp: new Date()
      };
      
      const updateQuestions = (questionsList: Question[]): Question[] => {
        return questionsList.map(q => 
          q.id === questionId 
            ? { ...q, comments: [...q.comments, newComment] } 
            : q
        );
      };
      
      setQuestions(updateQuestions);
      setMyQuestions(updateQuestions);
      setAnsweredQuestions(updateQuestions);
      setFollowingQuestions(updateQuestions);
      setPopularQuestions(updateQuestions);
      
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionContext.Provider value={{ 
      questions,
      myQuestions,
      answeredQuestions,
      followingQuestions,
      popularQuestions,
      createQuestion,
      upvoteQuestion,
      commentOnQuestion,
      loading
    }}>
      {children}
    </QuestionContext.Provider>
  );
};

// Custom hook to use the question context
export const useQuestion = () => {
  const context = useContext(QuestionContext);
  
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  
  return context;
};
