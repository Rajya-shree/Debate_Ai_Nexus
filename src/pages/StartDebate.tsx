import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDebate } from '@/contexts/DebateContext';
import { toast } from 'sonner';

const StartDebate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const { createDebateRequest, myRequests, startDebate, loading } = useDebate();
  const navigate = useNavigate();
  
  const handleCreateRequest = async () => {
    if (!title.trim() || !description.trim() || !tags.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    await createDebateRequest(title, description, tagArray);
  };
  
  const handleStartDebate = async (requestId: string) => {
    await startDebate(requestId);
    navigate('/debate-room');
  };
  
  const debateRules = [
    {
      title: 'Respect Others',
      description: 'Always engage in respectful discussions and avoid personal attacks.'
    },
    {
      title: 'Stay on Topic',
      description: 'Keep the discussion relevant to the topic at hand.'
    },
    {
      title: 'No Hate Speech',
      description: 'Any form of discrimination or hate speech is strictly prohibited.'
    },
    {
      title: 'Fact-Based Arguments',
      description: 'Use credible sources to support your claims and arguments.'
    },
    {
      title: 'Moderation Rules',
      description: 'Debates are monitored, and violations may lead to removal.'
    },
    {
      title: 'Constructive Criticism',
      description: 'Critique ideas constructively rather than attacking individuals.'
    }
  ];
  
  const debateProcess = [
    'Send a request to start a debate session.',
    'Wait for approval from the admin.',
    'Once approved, you can host the debate.',
    'Wait until at least three members join the session (you can wait for more).',
    'Start the debate session once ready.',
    'When you find your answer, end the session with a thank-you note.'
  ];
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debate Sessions</h1>
      <p className="text-gray-600 mb-8">Read Below boxes before starting a debate.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {debateRules.map((rule, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{rule.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{rule.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-debate-primary p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Debate Process:</h2>
        <ul className="list-disc list-inside space-y-2">
          {debateProcess.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a Debate Request</CardTitle>
            <CardDescription>
              Fill out the form below to request a new debate session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Debate Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Impact of AI on Education"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the topic you want to debate..."
                  className="min-h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., AI, Education, Technology"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-debate-primary hover:bg-debate-secondary"
                onClick={handleCreateRequest}
                disabled={loading || !title.trim() || !description.trim() || !tags.trim()}
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Debate Requests</CardTitle>
            <CardDescription>
              View the status of your submitted debate requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{request.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {request.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {request.status === 'approved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStartDebate(request.id)}
                        >
                          Start Debate
                        </Button>
                      )}
                    </div>
                    
                    {request.status === 'approved' && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Session Code:</span> {request.code}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't submitted any debate requests yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          size="lg" 
          className="bg-debate-primary hover:bg-debate-secondary"
          asChild
        >
          <a href="#start-form">Start Debate</a>
        </Button>
      </div>
    </div>
  );
};

export default StartDebate;
