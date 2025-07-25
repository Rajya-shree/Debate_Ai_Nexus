
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestion } from '@/contexts/QuestionContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ArrowLeft, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Question = () => {
  const { id } = useParams<{ id: string }>();
  const { questions, upvoteQuestion, commentOnQuestion, loading } = useQuestion();
  const [comment, setComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-semibold mb-4">Question not found</h1>
        <p className="text-gray-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/answer-posts">Browse Questions</Link>
        </Button>
      </div>
    );
  }
  
  const handleUpvote = () => {
    if (!hasUpvoted) {
      upvoteQuestion(question.id);
      setHasUpvoted(true);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    await commentOnQuestion(question.id, comment);
    setComment('');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/answer-posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Link>
        </Button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleUpvote}
                className={hasUpvoted ? "text-debate-primary" : ""}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <span className="text-lg font-medium">{question.upvotes}</span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.user.avatar} alt={question.user.name} />
                  <AvatarFallback>{getInitials(question.user.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{question.user.name}</span>
                <span className="text-sm text-gray-500">
                  posted {formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-6 whitespace-pre-line">
                {question.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Answers & Comments</h2>
        
        <div className="mb-6">
          <Textarea 
            placeholder="Write your comment or answer..."
            className="mb-3 min-h-32"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <Button 
            onClick={handleSubmitComment} 
            disabled={!comment.trim() || loading}
            className="bg-debate-primary hover:bg-debate-secondary"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </div>
        
        <div className="space-y-4">
          {question.comments.length > 0 ? (
            question.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
