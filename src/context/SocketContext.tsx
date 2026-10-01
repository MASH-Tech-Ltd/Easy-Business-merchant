'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getWsUrl } from '@/utils/api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const storedUser = sessionStorage.getItem('merchantUser');
    if (!storedUser) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const wsUrl = getWsUrl();

      socketInstance = io(wsUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
        if (user?._id) {
          socketInstance?.emit('join_user_room', user._id);
        }
        const tenantId = user?.tenantId || user?._id;
        if (tenantId) {
          socketInstance?.emit('join_tenant_room', tenantId);
        }
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);
    } catch (e) {
      console.error('Socket connection error:', e);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
