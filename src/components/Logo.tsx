interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 40, showText = true, className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Balão de conversa principal */}
        <path
          d="M20 25 C20 20 22 15 28 15 L72 15 C78 15 80 20 80 25 L80 55 C80 60 78 65 72 65 L45 65 L30 78 L30 65 L28 65 C22 65 20 60 20 55 Z"
          fill="url(#gradient1)"
        />
        
        {/* Três pontinhos de digitação */}
        <circle cx="38" cy="40" r="4" fill="white" />
        <circle cx="50" cy="40" r="4" fill="white" />
        <circle cx="62" cy="40" r="4" fill="white" />
        
        {/* Detalhe brilhante */}
        <circle cx="68" cy="28" r="3" fill="white" opacity="0.6" />
        
        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            FinStress AI
          </span>
        </div>
      )}
    </div>
  );
};
