
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuestion } from '@/contexts/QuestionContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

const Explore = () => {
  const { questions } = useQuestion();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(questions);
  
  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => 
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Update search results when filteredQuestions changes
  useEffect(() => {
    setSearchResults(filteredQuestions);
  }, [searchQuery, questions]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Questions</h1>
        
        <div className="relative max-w-xl mx-auto mb-8">
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="relative w-full justify-start text-sm text-muted-foreground py-6"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search questions...</span>
            <kbd className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search questions, tags, or content..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Questions">
            {questions.map(question => (
              <CommandItem
                key={question.id}
                onSelect={() => {
                  setOpen(false);
                  setSearchQuery(question.title);
                }}
              >
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={question.user.avatar} alt={question.user.name} />
                    <AvatarFallback>{getInitials(question.user.name)}</AvatarFallback>
                  </Avatar>
                  <span>{question.title}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Tags">
            {Array.from(new Set(questions.flatMap(q => q.tags))).map((tag, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setOpen(false);
                  setSearchQuery(tag);
                }}
              >
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  {tag}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map(question => (
          <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={question.user.avatar} alt={question.user.name} />
                  <AvatarFallback>{getInitials(question.user.name)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium">{question.user.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-debate-primary">
                <Link to={`/question/${question.id}`}>
                  {question.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {question.content}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {question.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{question.upvotes}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{question.comments.length}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/question/${question.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {searchResults.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No questions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
