
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus } from 'lucide-react';
import { useDebate } from '@/contexts/DebateContext';
import { useNavigate } from 'react-router-dom';
import { DebateCard } from '@/components/DebateCard';

const Debates = () => {
  const { activeSessions } = useDebate();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSessions = activeSessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Active Debates</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search questions..." 
              className="pl-10 w-60 md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all-debates">
        <TabsList className="mb-8">
          <TabsTrigger value="all-debates">All Debates</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-debates" className="space-y-6">
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <DebateCard
                key={session.id}
                id={session.id}
                title={session.title}
                hostName={session.hostName}
                hostAvatar={session.hostAvatar}
                participantCount={session.participants.length}
                startTime={session.createdAt}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active debates found matching your search.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/start-debate')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Start a Debate
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-6">
          {activeSessions.length > 0 ? (
            [...activeSessions]
              .sort((a, b) => b.participants.length - a.participants.length)
              .map(session => (
                <DebateCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  hostName={session.hostName}
                  hostAvatar={session.hostAvatar}
                  participantCount={session.participants.length}
                  startTime={session.createdAt}
                />
              ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active debates found.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/start-debate')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Start a Debate
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new" className="space-y-6">
          {activeSessions.length > 0 ? (
            [...activeSessions]
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map(session => (
                <DebateCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  hostName={session.hostName}
                  hostAvatar={session.hostAvatar}
                  participantCount={session.participants.length}
                  startTime={session.createdAt}
                />
              ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active debates found.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/start-debate')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Start a Debate
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Debates;
