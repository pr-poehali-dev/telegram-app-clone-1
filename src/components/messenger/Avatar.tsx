import { AVATAR_COLORS } from './types';

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

export default Avatar;
