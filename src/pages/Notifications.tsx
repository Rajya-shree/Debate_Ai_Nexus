
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'answer',
    user: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=John'
    },
    content: "answered your question: 'How to improve AI ethics?'",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Emma Watson',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Emma'
    },
    content: "commented on your question: 'Future of AI'",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: false
  },
  {
    id: '3',
    type: 'debate_approved',
    user: {
      name: 'System',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI'
    },
    content: "Your debate request 'AI Ethics Discussion' has been approved. Session code: AI-ETH-123",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true
  },
  {
    id: '4',
    type: 'debate_started',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex'
    },
    content: "started a new debate: 'Future of Remote Work'",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Filter notifications by type
  const answeredPosts = notifications.filter(n => n.type === 'answer');
  const followersPosts = notifications.filter(n => n.type === 'comment');
  const followingDebates = notifications.filter(n => n.type === 'debate_started');
  const approvedRequests = notifications.filter(n => n.type === 'debate_approved');
  
  // Render a notification item
  const renderNotification = (notification: typeof mockNotifications[0]) => (
    <div key={notification.id} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
        <AvatarFallback>{getInitials(notification.user.name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-col">
          <h3 className="font-medium">
            {notification.user.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {notification.content}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </Button>
    </div>
  );
  
  const emptyNotifications = (
    <div className="text-center py-12">
      <p className="text-gray-500">No notifications in this category.</p>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        <Button variant="ghost" onClick={clearAll} disabled={notifications.length === 0}>
          Clear All
        </Button>
      </div>
      
      <Tabs defaultValue="answered">
        <TabsList className="mb-8">
          <TabsTrigger value="answered">Answered Posts</TabsTrigger>
          <TabsTrigger value="followers">Followers' Posts</TabsTrigger>
          <TabsTrigger value="following">Following's Debates</TabsTrigger>
          <TabsTrigger value="approved">Approved Requests</TabsTrigger>
          <TabsTrigger value="suggested">Suggested Debates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="answered">
          <h2 className="text-xl font-semibold mb-4">Your Questions Answered</h2>
          <div className="space-y-4">
            {answeredPosts.length > 0 ? answeredPosts.map(renderNotification) : emptyNotifications}
          </div>
        </TabsContent>
        
        <TabsContent value="followers">
          <div className="space-y-4">
            {followersPosts.length > 0 ? followersPosts.map(renderNotification) : emptyNotifications}
          </div>
        </TabsContent>
        
        <TabsContent value="following">
          <div className="space-y-4">
            {followingDebates.length > 0 ? followingDebates.map(renderNotification) : emptyNotifications}
          </div>
        </TabsContent>
        
        <TabsContent value="approved">
          <div className="space-y-4">
            {approvedRequests.length > 0 ? approvedRequests.map(renderNotification) : emptyNotifications}
          </div>
        </TabsContent>
        
        <TabsContent value="suggested">
          <div className="space-y-4">
            {emptyNotifications}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
