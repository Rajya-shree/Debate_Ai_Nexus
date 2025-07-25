
import React from 'react';
import { Puzzle, Target, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  animation: string;
}

const Badge = ({ icon, title, value, color, animation }: BadgeProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm border ${color} transition-all duration-300 ${animation} hover:shadow-md`}
    >
      <div className="text-3xl mb-2">
        {icon}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
};

export const CognitiveBadgeWall = () => {
  const { user } = useAuth();
  
  // In a real app, these values would come from the user's profile data
  const badges = [
    {
      icon: <Puzzle className="text-blue-500" />,
      title: "Debates Initiated",
      value: 24,
      color: "bg-blue-50 border-blue-200",
      animation: "hover:scale-105"
    },
    {
      icon: <Target className="text-red-500" />,
      title: "Precision Score",
      value: "92%",
      color: "bg-red-50 border-red-200",
      animation: "hover:animate-pulse"
    },
    {
      icon: <Mic className="text-green-500" />,
      title: "Challenges Accepted",
      value: 18,
      color: "bg-green-50 border-green-200",
      animation: "group"
    }
  ];

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4">Cognitive Achievement</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <Badge
            key={index}
            icon={badge.icon}
            title={badge.title}
            value={badge.value}
            color={badge.color}
            animation={badge.animation}
          />
        ))}
      </div>
      
      <style>{`
        .group:hover svg {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }
          
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }
          
          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
        
        .hover\\:animate-pulse:hover {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
