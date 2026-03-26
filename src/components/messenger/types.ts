export const API = {
  register: 'https://functions.poehali.dev/ed281b66-bba8-4ecb-ad7a-ece655b6adb8',
  login: 'https://functions.poehali.dev/6a7861d8-ff15-432d-9e79-2368dcfe4824',
  me: 'https://functions.poehali.dev/4fee15bd-40cf-4124-a98f-e0a3660fbdf8',
};

const TOKEN_KEY = 'link_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export interface AuthUser {
  id: number;
  username: string;
  display_name: string;
  phone: string | null;
  about: string;
}

export type Tab = 'chats' | 'statuses' | 'contacts' | 'profile' | 'settings';
export type CallType = 'voice' | 'video' | null;

export interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  read: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
}

export interface Status {
  id: number;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  color: string;
}

export const CHATS: Chat[] = [
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

export const CONTACTS: Contact[] = [
  { id: 1, name: 'Анна Соколова', avatar: 'АС', phone: '+7 (912) 345-67-89', online: true },
  { id: 2, name: 'Дмитрий Волков', avatar: 'ДВ', phone: '+7 (923) 456-78-90', online: false },
  { id: 3, name: 'Иван Петров', avatar: 'ИП', phone: '+7 (934) 567-89-01', online: false },
  { id: 4, name: 'Мария Кузнецова', avatar: 'МК', phone: '+7 (945) 678-90-12', online: true },
  { id: 5, name: 'Ольга Новикова', avatar: 'ОН', phone: '+7 (956) 789-01-23', online: true },
  { id: 6, name: 'Сергей Морозов', avatar: 'СМ', phone: '+7 (967) 890-12-34', online: false },
  { id: 7, name: 'Татьяна Белова', avatar: 'ТБ', phone: '+7 (978) 901-23-45', online: false },
  { id: 8, name: 'Алексей Козлов', avatar: 'АК', phone: '+7 (989) 012-34-56', online: true },
];

export const STATUSES: Status[] = [
  { id: 1, name: 'Анна Соколова', avatar: 'АС', time: '5 мин назад', viewed: false, color: 'from-blue-400 to-blue-600' },
  { id: 2, name: 'Мария Кузнецова', avatar: 'МК', time: '23 мин назад', viewed: false, color: 'from-pink-400 to-purple-500' },
  { id: 3, name: 'Ольга Новикова', avatar: 'ОН', time: '1 час назад', viewed: true, color: 'from-green-400 to-teal-500' },
  { id: 4, name: 'Алексей Козлов', avatar: 'АК', time: '2 часа назад', viewed: true, color: 'from-orange-400 to-red-500' },
  { id: 5, name: 'Сергей Морозов', avatar: 'СМ', time: '3 часа назад', viewed: true, color: 'from-yellow-400 to-orange-500' },
];

export const AVATAR_COLORS: Record<string, string> = {
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

export const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'statuses', icon: 'Circle', label: 'Статусы' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];
