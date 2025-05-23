"use client"
import React, { createContext, useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFetch } from '@/hooks/user-fetch';
import { useAuth } from '@clerk/nextjs';
type MessageType = {
  role: string,
  content: string,
  createdAt?: string|Date,
  functionCall?:string,
}

interface MessageContextType {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  hasStreamingMessageRef: React.MutableRefObject<boolean>;
  streaming:boolean;
  error:string | null;
}

const SocketContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => {},
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  hasStreamingMessageRef:{current:false} as React.MutableRefObject<boolean>,
  streaming: false,
  error:null
  

});
const URL ={
  production:'https://skillsynx-socket-backend-1.onrender.com',
  development:'https://skillsynx-socket-backend-1.onrender.com'
  // development:'http://localhost:4000' // socket local server url
} as const

const env = (process.env.NODE_ENV ?? 'development') as keyof typeof URL;
const SOCKET_URL = URL[env];


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {userId} =useAuth()
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error,setError]= useState<string | null>(null);
  const [streaming,setStreaming] = useState(false);
  const currentStreamRef = useRef<string>('');
  const hasStreamingMessageRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,

    });
    
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected with ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('chat_response', (data) => {    
      if (data.stream) {
        if (!hasStreamingMessageRef.current) {
          hasStreamingMessageRef.current = true;
          currentStreamRef.current = data.content
          setError(null);
          setMessages(prev => [...prev, { 
            role: data.role, 
            content: data.content 
          }]);
        } else {
          if(!streaming && !data.content){
            setStreaming(true)
          }
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
    
    socketInstance.on('stream_complete', (data) => {
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
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setIsConnected(false);
    });

    socketInstance.on('error',(err:string)=>{
      setError(err)
    })

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (message: string ='') => {
    if (socket && isConnected) {
      setStreaming(true);
      hasStreamingMessageRef.current = false;
      currentStreamRef.current = '';
      
      setMessages(prev => [...prev, { role: 'user', content: message }]);
    
      const timeoutId = setTimeout(() => {
        if (!hasStreamingMessageRef.current) {
          setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        }
      }, 300); 
      let payload ={
        msg:message,
        user:userId
      }
      socket.emit('chat_message', payload);
      return () => clearTimeout(timeoutId);
    } else {
      console.error('Socket not connected');
    }
  };

  return (
    <SocketContext.Provider value={{ 
      messages, 
      setMessages, 
      socket, 
      isConnected,
      sendMessage,
      hasStreamingMessageRef,
      streaming,
      error
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