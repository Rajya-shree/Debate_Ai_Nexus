
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Search, ChevronDown } from 'lucide-react';
import { useQuestion } from '@/contexts/QuestionContext';
import { CreatePostModal } from '@/components/CreatePostModal';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const { popularQuestions } = useQuestion();
  const [currentTab, setCurrentTab] = useState('faq');
  
  const faqItems = [
    {
      question: 'About our profile?',
      answer: 'DebateConnect is a platform where you can engage in meaningful debates, ask questions, and expand your knowledge through community discussions moderated by AI.'
    },
    {
      question: 'News and topics?',
      answer: 'We cover a wide range of topics including technology, science, philosophy, politics, and more. Our community contributes diverse perspectives on current events and evergreen subjects.'
    },
    {
      question: 'How to use?',
      answer: 'You can browse questions, join debates, start your own debate sessions, or post questions. Our AI helps moderate discussions and ensures a respectful environment for all participants.'
    }
  ];
  
  const trendingTopics = [
    { title: "AI Ethics in Modern Society", engagement: "5.2k" },
    { title: "Climate Change Solutions", engagement: "4.8k" },
    { title: "Future of Remote Work", engagement: "3.9k" },
    { title: "Education Reform", engagement: "3.5k" },
    { title: "Healthcare Access", engagement: "3.1k" }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="bg-gray-100 p-1 rounded-lg mb-4">
              <TabsTrigger value="faq" className="text-sm">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="topics" className="text-sm">Trending Topics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <div className="mb-6">
                <div className="relative mb-6">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <Input
                      type="text"
                      placeholder="Search FAQs..."
                      className="w-full border-0 focus-visible:ring-0"
                    />
                    <Button variant="ghost" className="h-9 w-9 p-0 mr-1">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg font-medium text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="topics">
              <div className="mb-6">
                <div className="relative mb-6">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <Input
                      type="text"
                      placeholder="Search trending topics..."
                      className="w-full border-0 focus-visible:ring-0"
                    />
                    <Button variant="ghost" className="h-9 w-9 p-0 mr-1">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{topic.title}</h3>
                        <span className="text-sm text-gray-500">{topic.engagement} participants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-2">Join the Discussion</h2>
            <p className="text-gray-600 mb-6">
              Engage in meaningful debates and expand your horizons with our community of thinkers and learners.
            </p>
            
            <p className="text-gray-600 mb-6">
              Connect with like-minded individuals, explore diverse perspectives, and enhance your critical thinking skills through structured debates.
            </p>
            
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={() => setCreatePostModalOpen(true)}
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Ask a Question
            </Button>
          </div>
        </div>
      </div>
      
      <CreatePostModal 
        isOpen={createPostModalOpen} 
        onClose={() => setCreatePostModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
