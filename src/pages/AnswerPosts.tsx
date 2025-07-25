
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';
import { CreatePostModal } from '@/components/CreatePostModal';
import { PostCard } from '@/components/PostCard';
import { useQuestion } from '@/contexts/QuestionContext';

const AnswerPosts = () => {
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const { questions, myQuestions, answeredQuestions, followingQuestions } = useQuestion();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredQuestions = questions.filter(question => 
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questions</h1>
        
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
          
          <Button onClick={() => setCreatePostModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="my-questions">
        <TabsList className="mb-8">
          <TabsTrigger value="my-questions">My Questions</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="answered">Answered</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-questions" className="space-y-6">
          {searchQuery ? (
            filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <PostCard key={index} question={question} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found matching your search.</p>
              </div>
            )
          ) : (
            myQuestions.length > 0 ? (
              myQuestions.map((question, index) => (
                <PostCard key={index} question={question} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't asked any questions yet.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setCreatePostModalOpen(true)}
                >
                  Ask Your First Question
                </Button>
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="following" className="space-y-6">
          {followingQuestions.length > 0 ? (
            followingQuestions.map((question, index) => (
              <PostCard key={index} question={question} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You're not following any questions yet.</p>
              <Button 
                className="mt-4"
                onClick={() => setCreatePostModalOpen(true)}
              >
                Browse Questions
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="answered" className="space-y-6">
          {answeredQuestions.length > 0 ? (
            answeredQuestions.map((question, index) => (
              <PostCard key={index} question={question} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't answered any questions yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <CreatePostModal 
        isOpen={createPostModalOpen} 
        onClose={() => setCreatePostModalOpen(false)} 
      />
    </div>
  );
};

export default AnswerPosts;
