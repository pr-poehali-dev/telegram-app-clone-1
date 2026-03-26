import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from './Avatar';
import { CHATS, CONTACTS, STATUSES } from './types';
import type { AuthUser, Chat } from './types';

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

const ProfileTab = ({ user, onLogout }: { user: AuthUser; onLogout: () => void }) => {
  const initials = user.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const items = [
    { icon: 'AtSign', label: 'Имя пользователя', value: '@' + user.username },
    ...(user.phone ? [{ icon: 'Phone', label: 'Телефон', value: user.phone }] : []),
    { icon: 'Info', label: 'О себе', value: user.about || 'Привет! Я использую Линк' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">Профиль</h1>
      </div>

      <div className="px-4 pb-6">
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Icon name="Camera" size={14} />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.display_name}</h2>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon as 'AtSign' | 'Phone' | 'Info'} size={18} className="text-primary" />
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

        <button
          onClick={onLogout}
          className="mt-4 w-full py-3 rounded-2xl text-red-500 text-sm font-semibold border border-red-100 hover:bg-red-50 transition-colors"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

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

    </div>
  );
};

export { ChatsTab, StatusesTab, ContactsTab, ProfileTab, SettingsTab };
