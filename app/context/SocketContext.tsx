"use client"
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';

type MessageType = {
  role: string,
  content: string,
}

interface MessageContextType {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  hasStreamingMessageRef: React.MutableRefObject<boolean>;
  streaming: boolean;
}

const SocketContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => {},
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  hasStreamingMessageRef: {current: false} as React.MutableRefObject<boolean>,
  streaming: false
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useRef for socket to persist across renders
  const socketRef = useRef<Socket | null>(null);
  const { userId } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const currentStreamRef = useRef<string>('');
  const hasStreamingMessageRef = useRef<boolean>(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {

    if (!socketRef.current) {
      socketRef.current = io({
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5
      });
      console.log("Socket initialized");
    }

    const socket = socketRef.current;
    
    function onConnect() {
      setIsConnected(true);
      if (socket.io && socket.io.engine) {
        setTransport(socket.io.engine.transport.name);
        
        socket.io.engine.on("upgrade", (transport) => {
          console.log("Transport upgraded to:", transport.name);
          setTransport(transport.name);
        });
      }
    }
    
    function onDisconnect() {
      console.log('Socket disconnected');
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setIsConnected(false);
    });

  
    socket.on('chat_response', (data) => {
      console.log('Received chat_response:', data);
      
      if (data.stream) {
        if (!hasStreamingMessageRef.current) {
          hasStreamingMessageRef.current = true;
          currentStreamRef.current = data.content || '';
          
          setMessages(prev => [...prev, { 
            role: data.role, 
            content: data.content || ''
          }]);
        } else {
          currentStreamRef.current += data.content || '';
          
          setMessages(prev => {
            const updatedMessages = [...prev];
            const lastIndex = updatedMessages.length - 1;
            if (lastIndex >= 0) {
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                content: currentStreamRef.current
              };
            }
            return updatedMessages;
          });
        }
      }
    });
    
    socket.on('stream_complete', (data) => {
      
      hasStreamingMessageRef.current = false;
      currentStreamRef.current = '';
      
      setMessages(prev => {
        const assistantIndex = prev.findLastIndex(msg => msg.role === 'assistant');
        if (assistantIndex >= 0) {
          const updatedMessages = [...prev];
          updatedMessages[assistantIndex] = {
            role: data.role,
            content: data.content
          };
          return updatedMessages;
        }

        return [...prev, {
          role: data.role,
          content: data.content
        }];
      });
      
      setStreaming(false);
    });

    if (socket.connected) {
      onConnect();
    }

  
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off('chat_response');
      socket.off('stream_complete');
      socket.off('connect_error');
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const sendMessage = (message: string = '') => {
    const socket = socketRef.current;
    
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }
    
    if (!isConnected) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('Sending message:', message);
    setStreaming(true);
    hasStreamingMessageRef.current = false;
    currentStreamRef.current = '';
    
    // Add user message to the UI immediately
    setMessages(prev => [...prev, { role: 'user', content: message }]);
  
    // Add a placeholder for the assistant's response after a short delay
    const timeoutId = setTimeout(() => {
      if (!hasStreamingMessageRef.current) {
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      }
    }, 300); 
    
    // Prepare payload and send message
    const payload = {
      msg: message,
      user: userId
    };
    
    socket.emit('chat_message', payload);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <SocketContext.Provider value={{ 
      messages, 
      setMessages, 
      socket: socketRef.current, 
      isConnected,
      sendMessage,
      hasStreamingMessageRef,
      streaming
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};