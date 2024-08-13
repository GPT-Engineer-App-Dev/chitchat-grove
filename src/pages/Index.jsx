import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simulated chat data
const initialMessages = [
  { id: 1, sender: 'Alice', content: 'Hey there!' },
  { id: 2, sender: 'Bob', content: 'Hi Alice! How are you?' },
  { id: 3, sender: 'Alice', content: 'I'm doing great, thanks for asking!' },
];

const fetchMessages = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return initialMessages;
};

const sendMessage = async (message) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: Date.now(), sender: 'You', content: message };
};

const ChatMessage = ({ message }) => (
  <div className="flex items-start space-x-2 mb-4">
    <Avatar>
      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
      <AvatarFallback>{message.sender[0]}</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-semibold">{message.sender}</p>
      <p>{message.content}</p>
    </div>
  </div>
);

const Index = () => {
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.setQueryData(['messages'], (oldData) => [...oldData, data]);
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      mutation.mutate(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chat App</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
