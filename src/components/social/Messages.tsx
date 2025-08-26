import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ChevronLeft, MessageCircle, Send, Search, 
  Users, Phone, Video, MoreVertical, 
  Clock, CheckCheck, Plus
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface MessagesProps {
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
}

export function Messages({ onBack }: MessagesProps) {
  const [activeTab, setActiveTab] = useState<'conversations' | 'groups'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    friends, 
    currentUser, 
    allUsers, 
    getUserById 
  } = useAppContext();

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      participants: [currentUser.id, 'friend1'],
      lastMessage: {
        id: 'm1',
        senderId: 'friend1',
        content: 'Great round today! Your putting was on fire 🔥',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        read: false
      },
      unreadCount: 2,
      isGroup: false
    },
    {
      id: '2',
      participants: [currentUser.id, 'friend2'],
      lastMessage: {
        id: 'm2',
        senderId: currentUser.id,
        content: 'Want to play Pebble Beach this weekend?',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true
      },
      unreadCount: 0,
      isGroup: false
    },
    {
      id: '3',
      participants: [currentUser.id, 'friend1', 'friend2', 'user4'],
      lastMessage: {
        id: 'm3',
        senderId: 'user4',
        content: 'Tournament starts at 8am sharp!',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        read: true
      },
      unreadCount: 0,
      isGroup: true,
      groupName: 'Weekend Warriors'
    }
  ];

  // Mock messages for selected conversation
  const getMessages = (conversationId: string): Message[] => {
    return [
      {
        id: 'm1',
        senderId: 'friend1',
        content: 'Hey! How did your practice session go?',
        timestamp: new Date(Date.now() - 7200000),
        read: true
      },
      {
        id: 'm2',
        senderId: currentUser.id,
        content: 'Really well! Finally got my driver swing figured out. Shot a 78 today 🎉',
        timestamp: new Date(Date.now() - 6900000),
        read: true
      },
      {
        id: 'm3',
        senderId: 'friend1',
        content: 'That\'s awesome! What was the key change you made?',
        timestamp: new Date(Date.now() - 6600000),
        read: true
      },
      {
        id: 'm4',
        senderId: currentUser.id,
        content: 'Started focusing on my grip pressure and tempo. The AI coach really helped with that.',
        timestamp: new Date(Date.now() - 6300000),
        read: true
      },
      {
        id: 'm5',
        senderId: 'friend1',
        content: 'Great round today! Your putting was on fire 🔥',
        timestamp: new Date(Date.now() - 300000),
        read: false
      }
    ];
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the backend
    toast.success('Message sent!');
    setMessageText('');
  };

  const handleStartNewConversation = () => {
    toast.info('Select a friend to start messaging');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Individual conversation view
  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    const messages = getMessages(selectedConversation);
    const otherParticipant = conversation?.participants.find(p => p !== currentUser.id);
    const otherUser = otherParticipant ? getUserById(otherParticipant) : null;

    return (
      <div className="flex flex-col h-screen pb-20">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {conversation?.isGroup ? (
              <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            ) : (
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser?.avatar} />
                <AvatarFallback>{otherUser?.displayName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-medium">
                {conversation?.isGroup ? conversation.groupName : otherUser?.displayName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {conversation?.isGroup ? `${conversation.participants.length} members` : 'Online now'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-4 scroll-container overflow-y-auto">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;
            const sender = getUserById(message.senderId);
            
            return (
              <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && conversation?.isGroup && (
                    <p className="text-xs text-muted-foreground mb-1 ml-2">{sender?.displayName}</p>
                  )}
                  <div className={`p-3 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-4' 
                      : 'bg-background/30 backdrop-blur-sm border border-white/10 mr-4'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                      {isOwnMessage && (
                        <CheckCheck className={`w-3 h-3 ${message.read ? 'text-green-400' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-background/95 backdrop-blur-sm border-t border-white/10">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-background/50 border-white/20"
            />
            <Button 
              className="gradient-bg text-primary-foreground"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main messages screen
  return (
    <div className="p-4 pb-20 space-y-4 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Messages</h1>
          <p className="text-sm text-muted-foreground">Chat with golf friends</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="border-white/20"
          onClick={handleStartNewConversation}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="border-white/20"
        >
          <Users className="w-4 h-4 mr-2" />
          New Group
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger 
            value="conversations"
            className={activeTab === 'conversations' ? 'gradient-bg text-primary-foreground' : ''}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Direct
          </TabsTrigger>
          <TabsTrigger 
            value="groups"
            className={activeTab === 'groups' ? 'gradient-bg text-primary-foreground' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        {/* Direct Messages */}
        <TabsContent value="conversations" className="space-y-2 mt-4">
          {conversations
            .filter(c => !c.isGroup)
            .filter(c => {
              if (!searchQuery) return true;
              const otherUser = getUserById(c.participants.find(p => p !== currentUser.id) || '');
              return otherUser?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .map((conversation) => {
              const otherParticipant = conversation.participants.find(p => p !== currentUser.id);
              const otherUser = otherParticipant ? getUserById(otherParticipant) : null;
              
              return (
                <Card 
                  key={conversation.id}
                  className="gradient-card backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser?.avatar} />
                          <AvatarFallback>{otherUser?.displayName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground truncate">{otherUser?.displayName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-accent text-accent-foreground min-w-[1.25rem] h-5 text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        {/* Group Messages */}
        <TabsContent value="groups" className="space-y-2 mt-4">
          {conversations
            .filter(c => c.isGroup)
            .filter(c => {
              if (!searchQuery) return true;
              return c.groupName?.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .map((conversation) => (
              <Card 
                key={conversation.id}
                className="gradient-card backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground truncate">{conversation.groupName}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-accent text-accent-foreground min-w-[1.25rem] h-5 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.participants.length} members • {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {conversations.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-medium text-primary mb-2">No Messages Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start chatting with your golf friends!
          </p>
          <Button 
            className="gradient-bg text-primary-foreground"
            onClick={handleStartNewConversation}
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Conversation
          </Button>
        </div>
      )}
    </div>
  );
}