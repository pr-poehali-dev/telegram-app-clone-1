import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from './Avatar';
import type { Chat, CallType } from './types';

const CallScreen = ({ type, name, avatar, onEnd }: { type: CallType; name: string; avatar: string; onEnd: () => void }) => {
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-800 to-slate-900 text-white animate-fade-in rounded-none sm:rounded-[2.5rem] overflow-hidden">
      <div className="flex flex-col items-center pt-20 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" />
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-semibold backdrop-blur-sm">
            {avatar}
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold">{name}</p>
          <p className="text-white/60 text-sm mt-1">{type === 'video' ? 'Видеозвонок' : 'Голосовой звонок'} · {fmt(seconds)}</p>
        </div>
      </div>

      {type === 'video' && (
        <div className="w-full flex-1 flex items-center justify-center relative">
          <div className="w-64 h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Icon name="VideoOff" size={32} className="text-white/30" />
          </div>
          <div className="absolute bottom-4 right-6 w-20 h-28 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
            <Icon name="User" size={20} className="text-white/40" />
          </div>
        </div>
      )}

      <div className="pb-14 flex flex-col items-center gap-6 w-full px-8">
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-white text-slate-800' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <Icon name={muted ? 'MicOff' : 'Mic'} size={22} />
          </button>
          <button
            onClick={() => setSpeakerOn(!speakerOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${speakerOn ? 'bg-white text-slate-800' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <Icon name="Volume2" size={22} />
          </button>
          {type === 'video' && (
            <button className="w-14 h-14 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-all">
              <Icon name="CameraOff" size={22} />
            </button>
          )}
        </div>
        <button
          onClick={onEnd}
          className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all active:scale-95"
        >
          <Icon name="PhoneOff" size={24} />
        </button>
      </div>
    </div>
  );
};

const ChatView = ({
  chat,
  onBack,
  onCall,
}: {
  chat: Chat;
  onBack: () => void;
  onCall: (type: 'voice' | 'video') => void;
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chat.messages);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(m => [...m, { id: Date.now(), text: input.trim(), time, out: true, read: false }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white">
        <button onClick={onBack} className="p-1 -ml-1 rounded-lg hover:bg-muted transition-colors">
          <Icon name="ArrowLeft" size={20} className="text-muted-foreground" />
        </button>
        <Avatar initials={chat.avatar} size="sm" online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{chat.name}</p>
          <p className="text-xs text-muted-foreground">{chat.online ? 'в сети' : 'был(а) давно'}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onCall('voice')} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Phone" size={18} />
          </button>
          <button onClick={() => onCall('video')} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Video" size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-hide" style={{ background: 'hsl(var(--chat-bg))' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.out ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed ${msg.out ? 'msg-bubble-out' : 'msg-bubble-in'}`}>
              <p>{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-[10px] ${msg.out ? 'text-white/70' : 'text-muted-foreground'}`}>{msg.time}</span>
                {msg.out && (
                  <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className="text-white/70" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-3 border-t border-border bg-white flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
          <Icon name="Paperclip" size={18} />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Сообщение..."
          className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        {input.trim() ? (
          <button onClick={send} className="p-2 rounded-xl bg-primary text-white transition-all active:scale-95">
            <Icon name="Send" size={18} />
          </button>
        ) : (
          <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <Icon name="Mic" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export { CallScreen };
export default ChatView;
