
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Question } from '@/contexts/QuestionContext';
import { useQuestion } from '@/contexts/QuestionContext';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  question: Question;
  showUpvoteCount?: boolean;
  showCommentCount?: boolean;
  showViewButton?: boolean;
  compact?: boolean;
}

export function PostCard({ 
  question, 
  showUpvoteCount = true, 
  showCommentCount = true, 
  showViewButton = true,
  compact = false
}: PostCardProps) {
  const { upvoteQuestion } = useQuestion();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  
  const handleUpvote = () => {
    if (!hasUpvoted) {
      upvoteQuestion(question.id);
      setHasUpvoted(true);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="debate-card">
      <div className="flex items-start gap-4">
        {/* Vote column (or user avatar for compact view) */}
        {compact ? (
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={question.user.avatar} alt={question.user.name} />
              <AvatarFallback>{getInitials(question.user.name)}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleUpvote}
              className={hasUpvoted ? "text-debate-primary" : ""}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
            {showUpvoteCount && <span className="text-sm font-medium">{question.upvotes}</span>}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {compact && (
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}
              </span>
            )}
            {!compact && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.user.avatar} alt={question.user.name} />
                <AvatarFallback>{getInitials(question.user.name)}</AvatarFallback>
              </Avatar>
            )}
            {!compact && (
              <span className="text-sm font-medium">{question.user.name}</span>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-1">
            <Link to={`/question/${question.id}`} className="hover:text-debate-primary">
              {question.title}
            </Link>
          </h3>
          
          {!compact && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {question.content}
            </p>
          )}
          
          <div className={compact ? "flex items-center justify-between mt-2" : "flex flex-wrap gap-2 mb-3"}>
            {!compact && question.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="rounded-full">
                {tag}
              </Badge>
            ))}
            
            {compact && (
              <div className="flex items-center gap-4">
                {showUpvoteCount && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{question.upvotes}</span>
                  </div>
                )}
                
                {showCommentCount && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{question.comments.length}</span>
                  </div>
                )}
              </div>
            )}
            
            {compact && showViewButton && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/question/${question.id}`}>View</Link>
              </Button>
            )}
          </div>
          
          {!compact && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showCommentCount && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{question.comments.length} comments</span>
                  </div>
                )}
                
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              {showViewButton && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/question/${question.id}`}>View</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
