import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { API, getToken, clearToken, CHATS, NAV_ITEMS } from '@/components/messenger/types';
import type { AuthUser, Tab, CallType, Chat } from '@/components/messenger/types';
import AuthScreen from '@/components/messenger/AuthScreen';
import ChatView, { CallScreen } from '@/components/messenger/ChatView';
import { ChatsTab, StatusesTab, ContactsTab, ProfileTab, SettingsTab } from '@/components/messenger/Tabs';

const Index = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [call, setCall] = useState<{ type: CallType; name: string; avatar: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthLoading(false); return; }
    fetch(API.me, { headers: { 'X-Auth-Token': token } })
      .then(r => r.json())
      .then(d => {
        const parsed = typeof d === 'string' ? JSON.parse(d) : d;
        if (parsed.user) setAuthUser(parsed.user);
        else clearToken();
      })
      .catch(() => clearToken())
      .finally(() => setAuthLoading(false));
  }, []);

  const handleAuth = useCallback((user: AuthUser) => setAuthUser(user), []);

  const handleLogout = useCallback(() => {
    clearToken();
    setAuthUser(null);
    setTab('chats');
    setActiveChat(null);
  }, []);

  const handleOpenChat = (chat: Chat) => setActiveChat(chat);

  const handleStartChat = (name: string, avatar: string) => {
    const existing = CHATS.find(c => c.name === name);
    setActiveChat(existing ?? { id: Date.now(), name, avatar, lastMsg: '', time: '', unread: 0, online: true, messages: [] });
    setTab('chats');
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (!activeChat) return;
    setCall({ type, name: activeChat.name, avatar: activeChat.avatar });
  };

  const totalUnread = CHATS.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-golos">
      <div className="w-full max-w-sm h-screen max-h-[812px] flex flex-col bg-white relative overflow-hidden shadow-2xl shadow-black/10 rounded-none sm:rounded-[2.5rem] sm:border border-border">

        <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-white flex-shrink-0">
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1 text-foreground">
            <Icon name="Signal" size={14} />
            <Icon name="Wifi" size={14} />
            <Icon name="Battery" size={14} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {authLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : !authUser ? (
            <AuthScreen onAuth={handleAuth} />
          ) : activeChat ? (
            <ChatView chat={activeChat} onBack={() => setActiveChat(null)} onCall={handleCall} />
          ) : (
            <div className="h-full animate-fade-in">
              {tab === 'chats' && <ChatsTab onOpenChat={handleOpenChat} />}
              {tab === 'statuses' && <StatusesTab />}
              {tab === 'contacts' && <ContactsTab onStartChat={handleStartChat} />}
              {tab === 'profile' && authUser && <ProfileTab user={authUser} onLogout={handleLogout} />}
              {tab === 'settings' && <SettingsTab />}
            </div>
          )}

          {call && (
            <CallScreen type={call.type} name={call.name} avatar={call.avatar} onEnd={() => setCall(null)} />
          )}
        </div>

        {authUser && !activeChat && (
          <div className="flex-shrink-0 bg-white border-t border-border">
            <div className="flex items-center justify-around px-2 py-2">
              {NAV_ITEMS.map(item => {
                const isActive = tab === item.id;
                const showBadge = item.id === 'chats' && totalUnread > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <div className="relative">
                      <Icon name={item.icon as 'MessageCircle' | 'Circle' | 'Users' | 'User' | 'Settings'} size={22} />
                      {showBadge && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                          {totalUnread}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
