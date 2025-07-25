
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Users, Clock, AlertTriangle } from 'lucide-react';
import { useDebate } from '@/contexts/DebateContext';
import { formatDistanceToNow } from 'date-fns';

const DebateRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { activeSessions, currentSession, setCurrentSession, sendMessage, endDebate } = useDebate();
  const [message, setMessage] = useState('');
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [thankYouNote, setThankYouNote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id && activeSessions.length > 0) {
      setCurrentSession(activeSessions[0]);
    } else if (id) {
      const session = activeSessions.find(s => s.id === id);
      if (session) {
        setCurrentSession(session);
      } else {
        navigate('/debates');
      }
    }
  }, [id, activeSessions, setCurrentSession, navigate]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);
  
  if (!currentSession) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-semibold mb-4">Debate not found</h1>
        <p className="text-gray-600 mb-6">The debate session doesn't exist or has ended.</p>
        <Button asChild>
          <a href="/debates">Browse Active Debates</a>
        </Button>
      </div>
    );
  }
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessage(currentSession.id, message);
    setMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleEndDebate = async () => {
    if (!thankYouNote.trim()) return;
    
    await endDebate(currentSession.id, thankYouNote);
    setEndDialogOpen(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const isMessageFromCurrentUser = (senderId: string) => {
    return senderId === '1'; // Using mock user ID for demo
  };
  
  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-9rem)]">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" asChild>
          <a href="/debates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Debates
          </a>
        </Button>
        
        {currentSession.status === 'active' && (
          <Button 
            variant="destructive" 
            onClick={() => setEndDialogOpen(true)}
          >
            End Debate
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="md:w-3/4 flex flex-col">
          <Card className="mb-4">
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle>{currentSession.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{currentSession.participants.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(currentSession.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
            <div className="space-y-4">
              {currentSession.messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${isMessageFromCurrentUser(msg.senderId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] ${
                      msg.isAI 
                        ? 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-900/20' 
                        : isMessageFromCurrentUser(msg.senderId)
                        ? 'bg-debate-primary text-white'
                        : 'bg-white dark:bg-gray-700'
                    } rounded-lg shadow-sm p-3`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                        <AvatarFallback>{getInitials(msg.senderName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{msg.senderName}</span>
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {currentSession.status === 'active' ? (
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={currentSession.status !== 'active'}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim() || currentSession.status !== 'active'}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  <p>This debate has ended. You can no longer send messages.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:w-1/4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentSession.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      {currentSession.hostId === participant.id && (
                        <p className="text-xs text-gray-500">Host</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {currentSession.participants.length < 3 && (
                  <div className="text-sm text-amber-600 flex items-center gap-2 mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <p>Waiting for more participants to join ({currentSession.participants.length}/3)</p>
                  </div>
                )}
              </div>
              
              {currentSession.summary && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Debate Summary</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{currentSession.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Debate Session</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Please provide a thank you note or summary of what you learned from this debate.
          </p>
          <Textarea
            placeholder="Thank you everyone for your insights. I learned a lot about..."
            value={thankYouNote}
            onChange={(e) => setThankYouNote(e.target.value)}
            className="min-h-24"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEndDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEndDebate} 
              disabled={!thankYouNote.trim()}
              className="bg-debate-primary hover:bg-debate-secondary"
            >
              End Debate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DebateRoom;
