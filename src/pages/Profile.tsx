
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NicknameManager } from '@/components/profile/NicknameManager';
import { CognitiveBadgeWall } from '@/components/profile/CognitiveBadgeWall';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: 'Passionate debater with interests in philosophy, politics, and technology.'
  });

  const handleSaveProfile = () => {
    // In a real app, you would save this to the user's profile
    toast.success('Profile updated successfully');
    setEditingProfile(false);
  };

  if (!user) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        <div className="flex-shrink-0 flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm mb-4"
          >
            Change Avatar
          </Button>
        </div>
        
        <div className="flex-1">
          {editingProfile ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="max-w-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="max-w-md"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">{profileData.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {user.badges && user.badges.map((badge, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nicknames">Nicknames</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <CognitiveBadgeWall />
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-500 text-center py-8">
                Your recent debate activity will appear here.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="nicknames">
          <NicknameManager />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Email Preferences</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <label htmlFor="email-notifications">
                    Receive email notifications for new debate invitations
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Privacy</h3>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="public-profile" defaultChecked />
                  <label htmlFor="public-profile">
                    Make my profile visible to other users
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Account Security</h3>
                <Button variant="outline" className="mr-2">
                  Change Visual Password
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
