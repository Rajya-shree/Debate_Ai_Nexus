
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebate } from '@/contexts/DebateContext';

interface DebateCardProps {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  participantCount: number;
  startTime: Date;
}

export function DebateCard({
  id,
  title,
  hostName,
  hostAvatar,
  participantCount,
  startTime,
}: DebateCardProps) {
  const navigate = useNavigate();
  const { joinDebate } = useDebate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleJoinDebate = async () => {
    await joinDebate(id);
    navigate(`/debate-room/${id}`);
  };
  
  return (
    <div className="debate-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={hostAvatar} alt={hostName} />
          <AvatarFallback>{getInitials(hostName)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <div className="flex flex-col gap-1 mb-3">
            <div className="text-sm">Hosted by {hostName}</div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{participantCount} participants</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Started {formatDistanceToNow(startTime, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <Button onClick={handleJoinDebate} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700">
            Join Debate
          </Button>
        </div>
      </div>
    </div>
  );
}
