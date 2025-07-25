
import React, { useState } from 'react';
import { PlusCircle, X, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Nickname {
  id: string;
  name: string;
  emoji: string;
  theme: string;
  description: string;
}

// Sample emojis for different debate styles
const EMOJI_OPTIONS = [
  "🧠", "🔥", "💡", "🎯", "❄️", "🌊", "⚡", "🍃", "🔮", "🛡️", 
  "⚔️", "🏹", "🧩", "🎭", "🎮", "🎨", "📊", "⚖️", "🔍", "🧪"
];

// Sample themes for different debate styles
const THEME_OPTIONS = [
  "Logic", "Passion", "Creative", "Precise", "Calm", "Flow", "Sharp", 
  "Gentle", "Mystical", "Defensive", "Aggressive", "Strategic", "Analytical", 
  "Theatrical", "Playful", "Artistic", "Data-driven", "Balanced", "Investigative", "Experimental"
];

export const NicknameManager = () => {
  const [nicknames, setNicknames] = useState<Nickname[]>([
    { 
      id: '1', 
      name: 'LogicHammer', 
      emoji: '🔨', 
      theme: 'Logic',
      description: 'For structured, logical debates'
    },
    { 
      id: '2', 
      name: 'CalmStorm', 
      emoji: '🌪️', 
      theme: 'Calm',
      description: 'For measured, calm discussions'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNickname, setCurrentNickname] = useState<Nickname | null>(null);
  const [editingNickname, setEditingNickname] = useState<string | null>(null);

  const handleAddNickname = () => {
    setCurrentNickname({
      id: Date.now().toString(),
      name: '',
      emoji: EMOJI_OPTIONS[0],
      theme: THEME_OPTIONS[0],
      description: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditNickname = (nickname: Nickname) => {
    setCurrentNickname({...nickname});
    setIsDialogOpen(true);
  };

  const handleSaveNickname = () => {
    if (!currentNickname) return;
    
    if (nicknames.some(n => n.id === currentNickname.id)) {
      setNicknames(nicknames.map(n => 
        n.id === currentNickname.id ? currentNickname : n
      ));
    } else {
      setNicknames([...nicknames, currentNickname]);
    }
    
    setIsDialogOpen(false);
    setCurrentNickname(null);
  };

  const handleDeleteNickname = (id: string) => {
    setNicknames(nicknames.filter(n => n.id !== id));
  };

  const handleActivateNickname = (id: string) => {
    setEditingNickname(id);
    // In a real app, you would set this as the active nickname for debates
    setTimeout(() => {
      setEditingNickname(null);
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Debate Nicknames</h2>
        <Button onClick={handleAddNickname} size="sm" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Nickname</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nicknames.map((nickname) => (
          <Card key={nickname.id} className="overflow-hidden transition-all duration-300 group hover:shadow-md">
            <CardHeader className="bg-muted/50 pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{nickname.emoji}</span>
                  <CardTitle>{nickname.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    onClick={() => handleEditNickname(nickname)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                    onClick={() => handleDeleteNickname(nickname.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <CardDescription>Theme: {nickname.theme}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 mb-3">{nickname.description}</p>
              <Button 
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleActivateNickname(nickname.id)}
              >
                {editingNickname === nickname.id ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Activated
                  </span>
                ) : (
                  "Use this nickname"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentNickname && nicknames.some(n => n.id === currentNickname.id) 
                ? 'Edit Nickname' 
                : 'Create New Nickname'}
            </DialogTitle>
            <DialogDescription>
              Create a unique personality for different debate styles.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">Name</label>
              <Input
                id="name"
                value={currentNickname?.name || ''}
                onChange={(e) => setCurrentNickname(prev => 
                  prev ? {...prev, name: e.target.value} : null
                )}
                placeholder="e.g., LogicHammer"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emoji" className="text-right font-medium">Emoji</label>
              <Select
                value={currentNickname?.emoji}
                onValueChange={(value) => setCurrentNickname(prev => 
                  prev ? {...prev, emoji: value} : null
                )}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an emoji" />
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-5 gap-2 p-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <SelectItem key={emoji} value={emoji} className="text-center text-lg cursor-pointer">
                        {emoji}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="theme" className="text-right font-medium">Theme</label>
              <Select
                value={currentNickname?.theme}
                onValueChange={(value) => setCurrentNickname(prev => 
                  prev ? {...prev, theme: value} : null
                )}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right font-medium">Description</label>
              <Input
                id="description"
                value={currentNickname?.description || ''}
                onChange={(e) => setCurrentNickname(prev => 
                  prev ? {...prev, description: e.target.value} : null
                )}
                placeholder="Brief description of this debate style"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSaveNickname}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
