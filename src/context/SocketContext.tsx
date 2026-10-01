'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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

let globalSocket: Socket | null = null;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [isConnected, setIsConnected] = useState(globalSocket?.connected || false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('merchantUser');

    if (!storedUser) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket.close();
        globalSocket = null;
      }
      setSocket(null);
      setIsConnected(false);
      return;
    }

    let user: any = null;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {}

    if (!globalSocket) {
      const wsUrl = getWsUrl();
      globalSocket = io(wsUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
    }

    const currentSocket = globalSocket;
    if (!currentSocket.connected) {
      currentSocket.connect();
    }

    setSocket(currentSocket);

    const onConnect = () => {
      setIsConnected(true);
      if (user?._id) {
        currentSocket.emit('join_user_room', user._id);
      }
      const tenantId = user?.tenantId || user?._id;
      if (tenantId) {
        currentSocket.emit('join_tenant_room', tenantId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    if (currentSocket.connected) {
      onConnect();
    }

    currentSocket.on('connect', onConnect);
    currentSocket.on('disconnect', onDisconnect);

    return () => {
      currentSocket.off('connect', onConnect);
      currentSocket.off('disconnect', onDisconnect);
    };
  }, [pathname]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
