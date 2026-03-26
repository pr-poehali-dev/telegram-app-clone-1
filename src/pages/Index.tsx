import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'chats' | 'statuses' | 'contacts' | 'profile' | 'settings';
type CallType = 'voice' | 'video' | null;

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
}

interface Status {
  id: number;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHATS: Chat[] = [
  {
    id: 1, name: 'Анна Соколова', avatar: 'АС', lastMsg: 'Окей, увидимся в 18:00!', time: '14:32', unread: 2, online: true,
    messages: [
      { id: 1, text: 'Привет! Ты сегодня будешь на встрече?', time: '14:20', out: false, read: true },
      { id: 2, text: 'Да, конечно буду 👍', time: '14:25', out: true, read: true },
      { id: 3, text: 'Отлично! Тогда до встречи', time: '14:30', out: false, read: true },
      { id: 4, text: 'Окей, увидимся в 18:00!', time: '14:32', out: false, read: false },
    ]
  },
  {
    id: 2, name: 'Дмитрий Волков', avatar: 'ДВ', lastMsg: 'Файлы отправил на почту', time: '13:15', unread: 0, online: false,
    messages: [
      { id: 1, text: 'Дмитрий, можешь скинуть документы?', time: '12:50', out: true, read: true },
      { id: 2, text: 'Сейчас подготовлю', time: '13:00', out: false, read: true },
      { id: 3, text: 'Файлы отправил на почту', time: '13:15', out: false, read: true },
    ]
  },
  {
    id: 3, name: 'Мария Кузнецова', avatar: 'МК', lastMsg: 'Спасибо за помощь!', time: '11:48', unread: 1, online: true,
    messages: [
      { id: 1, text: 'Помогла разобраться с задачей, спасибо!', time: '11:40', out: false, read: true },
      { id: 2, text: 'Всегда пожалуйста 😊', time: '11:45', out: true, read: true },
      { id: 3, text: 'Спасибо за помощь!', time: '11:48', out: false, read: false },
    ]
  },
  {
    id: 4, name: 'Команда проекта', avatar: '👥', lastMsg: 'Артём: Дедлайн завтра в 10:00', time: 'вчера', unread: 5, online: false,
    messages: [
      { id: 1, text: 'Всем привет! Напоминаю о митинге', time: '10:00', out: false, read: true },
      { id: 2, text: 'Буду!', time: '10:05', out: true, read: true },
      { id: 3, text: 'Артём: Дедлайн завтра в 10:00', time: '18:30', out: false, read: false },
    ]
  },
  {
    id: 5, name: 'Иван Петров', avatar: 'ИП', lastMsg: 'Позвони когда будет время', time: 'вчера', unread: 0, online: false,
    messages: [
      { id: 1, text: 'Есть минута?', time: 'вчера', out: false, read: true },
      { id: 2, text: 'Позвони когда будет время', time: 'вчера', out: false, read: true },
    ]
  },
];

const CONTACTS: Contact[] = [
  { id: 1, name: 'Анна Соколова', avatar: 'АС', phone: '+7 (912) 345-67-89', online: true },
  { id: 2, name: 'Дмитрий Волков', avatar: 'ДВ', phone: '+7 (923) 456-78-90', online: false },
  { id: 3, name: 'Иван Петров', avatar: 'ИП', phone: '+7 (934) 567-89-01', online: false },
  { id: 4, name: 'Мария Кузнецова', avatar: 'МК', phone: '+7 (945) 678-90-12', online: true },
  { id: 5, name: 'Ольга Новикова', avatar: 'ОН', phone: '+7 (956) 789-01-23', online: true },
  { id: 6, name: 'Сергей Морозов', avatar: 'СМ', phone: '+7 (967) 890-12-34', online: false },
  { id: 7, name: 'Татьяна Белова', avatar: 'ТБ', phone: '+7 (978) 901-23-45', online: false },
  { id: 8, name: 'Алексей Козлов', avatar: 'АК', phone: '+7 (989) 012-34-56', online: true },
];

const STATUSES: Status[] = [
  { id: 1, name: 'Анна Соколова', avatar: 'АС', time: '5 мин назад', viewed: false, color: 'from-blue-400 to-blue-600' },
  { id: 2, name: 'Мария Кузнецова', avatar: 'МК', time: '23 мин назад', viewed: false, color: 'from-pink-400 to-purple-500' },
  { id: 3, name: 'Ольга Новикова', avatar: 'ОН', time: '1 час назад', viewed: true, color: 'from-green-400 to-teal-500' },
  { id: 4, name: 'Алексей Козлов', avatar: 'АК', time: '2 часа назад', viewed: true, color: 'from-orange-400 to-red-500' },
  { id: 5, name: 'Сергей Морозов', avatar: 'СМ', time: '3 часа назад', viewed: true, color: 'from-yellow-400 to-orange-500' },
];

// ─── Avatar Component ─────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<string, string> = {
  'АС': 'bg-blue-100 text-blue-600',
  'ДВ': 'bg-green-100 text-green-600',
  'МК': 'bg-pink-100 text-pink-600',
  'ИП': 'bg-orange-100 text-orange-600',
  'ОН': 'bg-teal-100 text-teal-600',
  'СМ': 'bg-purple-100 text-purple-600',
  'ТБ': 'bg-rose-100 text-rose-600',
  'АК': 'bg-indigo-100 text-indigo-600',
  '👥': 'bg-slate-100 text-slate-600',
};

const Avatar = ({ initials, size = 'md', online }: { initials: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) => {
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl' };
  const colorClass = AVATAR_COLORS[initials] || 'bg-blue-100 text-blue-600';
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold`}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${online ? 'bg-green-400' : 'bg-gray-300'}`} />
      )}
    </div>
  );
};

// ─── Call Screen ──────────────────────────────────────────────────────────────

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

// ─── Chat View ────────────────────────────────────────────────────────────────

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

// ─── Chats Tab ────────────────────────────────────────────────────────────────

const ChatsTab = ({ onOpenChat }: { onOpenChat: (chat: Chat) => void }) => {
  const [search, setSearch] = useState('');
  const filtered = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Чаты</h1>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <Icon name="PenSquare" size={18} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск"
            className="w-full bg-muted rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
          >
            <Avatar initials={chat.avatar} online={chat.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{chat.name}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMsg}</p>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Statuses Tab ─────────────────────────────────────────────────────────────

const StatusesTab = () => (
  <div className="flex flex-col h-full">
    <div className="px-4 pt-4 pb-3">
      <h1 className="text-xl font-bold">Статусы</h1>
    </div>

    <div className="px-4 mb-4">
      <div className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
            <Icon name="User" size={20} className="text-muted-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
            <Icon name="Plus" size={12} />
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm">Мой статус</p>
          <p className="text-xs text-muted-foreground">Добавить статус</p>
        </div>
      </div>
    </div>

    <div className="px-4 mb-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Недавние</p>
    </div>

    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-1">
      {STATUSES.map((s) => (
        <div key={s.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/30 rounded-2xl px-2 -mx-2 transition-colors">
          <div className={`p-0.5 rounded-full bg-gradient-to-br ${s.color} ${s.viewed ? 'opacity-40' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Avatar initials={s.avatar} size="sm" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.time}</p>
          </div>
          {!s.viewed && <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>
      ))}
    </div>
  </div>
);

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

const ContactsTab = ({ onStartChat }: { onStartChat: (name: string, avatar: string) => void }) => {
  const [search, setSearch] = useState('');
  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Контакты</h1>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <Icon name="UserPlus" size={18} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск контактов"
            className="w-full bg-muted rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
            <Avatar initials={c.avatar} online={c.online} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.phone}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => onStartChat(c.name, c.avatar)} className="p-2 rounded-xl hover:bg-muted transition-colors text-primary">
                <Icon name="MessageCircle" size={18} />
              </button>
              <button className="p-2 rounded-xl hover:bg-muted transition-colors text-primary">
                <Icon name="Phone" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────

const ProfileTab = () => (
  <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
    <div className="px-4 pt-4 pb-3">
      <h1 className="text-xl font-bold">Профиль</h1>
    </div>

    <div className="px-4 pb-6">
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            ВП
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
            <Icon name="Camera" size={14} />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Владимир Петров</h2>
          <p className="text-muted-foreground text-sm">@vpetrov</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: 'Phone', label: 'Телефон', value: '+7 (900) 000-00-00' },
          { icon: 'Mail', label: 'Email', value: 'v.petrov@mail.ru' },
          { icon: 'Info', label: 'О себе', value: 'Привет! Я использую Линк' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon as 'Phone' | 'Mail' | 'Info'} size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </div>
        ))}
      </div>

      <div className="mt-4 px-4 py-3.5 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Star" size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Линк Премиум</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Разблокируй эксклюзивные функции: большие файлы, отсутствие рекламы, приоритетная поддержка</p>
        <button className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold transition-all active:scale-95">
          Попробовать бесплатно
        </button>
      </div>
    </div>
  </div>
);

// ─── Settings Tab ─────────────────────────────────────────────────────────────

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const SettingsRow = ({ icon, label, right }: { icon: string; label: string; right?: React.ReactNode }) => (
  <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
      <Icon name={icon as 'User' | 'Lock' | 'Shield' | 'Bell' | 'Volume2' | 'Moon' | 'Globe' | 'Type' | 'HardDrive' | 'Download' | 'HelpCircle' | 'MessageSquare' | 'Info'} size={16} className="text-muted-foreground" />
    </div>
    <span className="flex-1 text-sm font-medium">{label}</span>
    {right ?? <Icon name="ChevronRight" size={16} className="text-muted-foreground" />}
  </div>
);

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-4">{title}</p>
    <div className="mx-4 rounded-2xl border border-border overflow-hidden divide-y divide-border bg-white">
      {children}
    </div>
  </div>
);

const SettingsTab = () => {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-6">
      <div className="px-4 pt-4 pb-4">
        <h1 className="text-xl font-bold">Настройки</h1>
      </div>

      <SettingsSection title="Аккаунт">
        <SettingsRow icon="User" label="Личные данные" />
        <SettingsRow icon="Lock" label="Конфиденциальность" />
        <SettingsRow icon="Shield" label="Безопасность" />
      </SettingsSection>

      <SettingsSection title="Уведомления">
        <SettingsRow icon="Bell" label="Уведомления" right={<Toggle value={notifications} onChange={() => setNotifications(v => !v)} />} />
        <SettingsRow icon="Volume2" label="Звуки" right={<Toggle value={sounds} onChange={() => setSounds(v => !v)} />} />
      </SettingsSection>

      <SettingsSection title="Интерфейс">
        <SettingsRow icon="Moon" label="Тёмная тема" right={<Toggle value={darkMode} onChange={() => setDarkMode(v => !v)} />} />
        <SettingsRow icon="Globe" label="Язык" right={<span className="text-sm text-muted-foreground">Русский</span>} />
        <SettingsRow icon="Type" label="Размер шрифта" />
      </SettingsSection>

      <SettingsSection title="Хранилище">
        <SettingsRow icon="HardDrive" label="Управление данными" />
        <SettingsRow icon="Download" label="Авто-загрузка медиа" />
      </SettingsSection>

      <SettingsSection title="Поддержка">
        <SettingsRow icon="HelpCircle" label="Помощь" />
        <SettingsRow icon="MessageSquare" label="Написать нам" />
        <SettingsRow icon="Info" label="О приложении" right={<span className="text-sm text-muted-foreground">1.0.0</span>} />
      </SettingsSection>

      <div className="px-4">
        <button className="w-full py-3 rounded-2xl text-red-500 text-sm font-semibold border border-red-100 hover:bg-red-50 transition-colors">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'statuses', icon: 'Circle', label: 'Статусы' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const Index = () => {
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [call, setCall] = useState<{ type: CallType; name: string; avatar: string } | null>(null);

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

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-white flex-shrink-0">
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1 text-foreground">
            <Icon name="Signal" size={14} />
            <Icon name="Wifi" size={14} />
            <Icon name="Battery" size={14} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeChat ? (
            <ChatView chat={activeChat} onBack={() => setActiveChat(null)} onCall={handleCall} />
          ) : (
            <div className="h-full animate-fade-in">
              {tab === 'chats' && <ChatsTab onOpenChat={handleOpenChat} />}
              {tab === 'statuses' && <StatusesTab />}
              {tab === 'contacts' && <ContactsTab onStartChat={handleStartChat} />}
              {tab === 'profile' && <ProfileTab />}
              {tab === 'settings' && <SettingsTab />}
            </div>
          )}

          {call && (
            <CallScreen type={call.type} name={call.name} avatar={call.avatar} onEnd={() => setCall(null)} />
          )}
        </div>

        {/* Bottom nav */}
        {!activeChat && (
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
