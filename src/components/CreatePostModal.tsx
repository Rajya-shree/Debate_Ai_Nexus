import { useState, ChangeEvent, useRef } from 'react';
import { X, Image, Link2, BarChart, Upload, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuestion } from '@/contexts/QuestionContext';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [addedLinks, setAddedLinks] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { createQuestion, loading } = useQuestion();
  
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    await createQuestion(title, content, tagArray);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setImageUrl('');
    setExternalLink('');
    setAddedLinks([]);
    setSelectedImage(null);
    setShowImageInput(false);
    setShowLinkInput(false);
    setShowPollInput(false);
    setPollOptions(['', '']);
  };
  
  const handleImageClick = () => {
    setShowImageInput(true);
    setShowLinkInput(false);
    setShowPollInput(false);
  };
  
  const handleLinkClick = () => {
    setShowLinkInput(true);
    setShowImageInput(false);
    setShowPollInput(false);
  };

  const handlePollClick = () => {
    setShowPollInput(true);
    setShowImageInput(false);
    setShowLinkInput(false);
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const addExternalLink = () => {
    if (!externalLink) {
      toast.error('Please enter a URL');
      return;
    }
    
    try {
      // Simple URL validation - adding protocol if missing
      let urlToAdd = externalLink;
      if (!urlToAdd.startsWith('http://') && !urlToAdd.startsWith('https://')) {
        urlToAdd = 'https://' + urlToAdd;
      }
      
      // Check if URL is valid
      new URL(urlToAdd);
      
      // Add to links array
      setAddedLinks(prev => [...prev, urlToAdd]);
      setContent(prev => `${prev}\n\n${urlToAdd}`);
      setExternalLink('');
      toast.success('Link added to your post');
    } catch (err) {
      toast.error('Please enter a valid URL');
    }
  };

  const removeLink = (indexToRemove: number) => {
    const linkToRemove = addedLinks[indexToRemove];
    
    // Remove from added links array
    setAddedLinks(prev => prev.filter((_, i) => i !== indexToRemove));
    
    // Remove from content
    setContent(prev => prev.replace(`\n\n${linkToRemove}`, ''));
    toast.success('Link removed from your post');
  };

  const addPollOption = () => {
    setPollOptions(prev => [...prev, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length <= 2) {
      toast.error('Polls require at least 2 options');
      return;
    }
    setPollOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePollOptionChange = (index: number, value: string) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option));
  };

  const addPoll = () => {
    const validOptions = pollOptions.filter(option => option.trim() !== '');
    
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 valid poll options');
      return;
    }
    
    const pollText = `\n\n[POLL]\n${validOptions.join('\n')}`;
    setContent(prev => `${prev}${pollText}`);
    
    setShowPollInput(false);
    toast.success('Poll added to your post');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Create a Post</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Share your thoughts, questions, or discussions with the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="space-y-4">
            <Input
              placeholder="Enter a clear, specific title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={handleImageClick}
                className={showImageInput ? "border-primary" : ""}
              >
                <Image className="h-4 w-4 mr-2" />
                Images & Video
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={handleLinkClick}
                className={showLinkInput ? "border-primary" : ""}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Link
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={handlePollClick}
                className={showPollInput ? "border-primary" : ""}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Poll
              </Button>
            </div>
            
            {showImageInput && (
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4" />
                  <span className="font-medium">Add an image</span>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button 
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full h-32 border-dashed flex flex-col gap-2 justify-center"
                >
                  <Image className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload an image</span>
                </Button>
                
                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          setSelectedImage(null);
                          setImageUrl('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {showLinkInput && (
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="h-4 w-4" />
                  <span className="font-medium">Add a link</span>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="example.com"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addExternalLink}>
                    Add
                  </Button>
                </div>

                {addedLinks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Added Links:</p>
                    <div className="space-y-2">
                      {addedLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="text-sm text-blue-600 truncate max-w-[80%]">
                            {link}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeLink(index)}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showPollInput && (
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart className="h-4 w-4" />
                  <span className="font-medium">Create a poll</span>
                </div>
                
                <div className="space-y-3">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removePollOption(index)}
                        disabled={pollOptions.length <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addPollOption}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Option
                    </Button>
                    
                    <Button onClick={addPoll}>
                      Add Poll to Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <Textarea
              placeholder="Provide more details or context..."
              className="min-h-32 resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <Input
              placeholder="Add tags (comma separated)..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-debate-primary hover:bg-debate-secondary"
              disabled={!title.trim() || !content.trim() || loading}
            >
              Submit Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
