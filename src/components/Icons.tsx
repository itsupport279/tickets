export function TicketIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="30" y="30" width="140" height="140" rx="12" fill="url(#ticketGrad)" />
      <rect x="40" y="40" width="40" height="40" rx="4" fill="white" opacity="0.9" />
      <circle cx="60" cy="60" r="8" fill="#10b981" />
      <line x1="95" y1="50" x2="160" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="95" y1="65" x2="160" y2="65" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="95" x2="160" y2="95" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="115" x2="160" y2="115" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="135" x2="120" y2="135" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function StatusIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="statusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#statusGrad)" />
      <circle cx="100" cy="100" r="60" fill="white" opacity="0.1" />
      <circle cx="70" cy="100" r="15" fill="white" />
      <circle cx="100" cy="70" r="15" fill="white" opacity="0.6" />
      <circle cx="130" cy="100" r="15" fill="white" opacity="0.6" />
      <circle cx="100" cy="130" r="15" fill="white" opacity="0.6" />
      <line x1="100" y1="100" x2="100" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AdminIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="160" height="160" rx="16" fill="url(#adminGrad)" />
      <circle cx="100" cy="65" r="20" fill="white" />
      <path
        d="M 70 95 L 70 130 Q 70 145 85 145 L 115 145 Q 130 145 130 130 L 130 95 Q 115 85 100 85 Q 85 85 70 95"
        fill="white"
      />
      <circle cx="145" cy="60" r="14" fill="white" opacity="0.8" />
      <path d="M 130 85 L 145 85 Q 160 85 160 100 L 160 130 Q 160 140 150 140 L 140 140 L 140 100 Q 140 90 130 85" fill="white" opacity="0.8" />
    </svg>
  );
}

export function DatabaseIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="50" rx="50" ry="20" fill="url(#dbGrad)" />
      <rect x="50" y="50" width="100" height="80" fill="#f59e0b" opacity="0.7" />
      <ellipse cx="100" cy="130" rx="50" ry="20" fill="url(#dbGrad)" />
      <line x1="50" y1="50" x2="50" y2="130" stroke="white" strokeWidth="2" opacity="0.3" />
      <line x1="150" y1="50" x2="150" y2="130" stroke="white" strokeWidth="2" opacity="0.3" />
      <line x1="60" y1="75" x2="140" y2="75" stroke="white" strokeWidth="2" opacity="0.5" />
      <line x1="60" y1="100" x2="140" y2="100" stroke="white" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function SecurityIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <path
        d="M 100 20 L 140 40 L 140 95 Q 140 135 100 160 Q 60 135 60 95 L 60 40 Z"
        fill="url(#secGrad)"
      />
      <path
        d="M 85 95 L 95 105 L 125 75"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReportsIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect x="30" y="25" width="140" height="150" rx="10" fill="url(#reportGrad)" />
      <rect x="40" y="35" width="120" height="10" rx="2" fill="white" opacity="0.9" />
      <rect x="40" y="52" width="30" height="40" rx="2" fill="white" opacity="0.8" />
      <rect x="75" y="62" width="30" height="30" rx="2" fill="white" opacity="0.7" />
      <rect x="110" y="45" width="30" height="47" rx="2" fill="white" opacity="0.8" />
      <line x1="40" y1="102" x2="130" y2="102" stroke="white" strokeWidth="2" opacity="0.4" />
      <rect x="40" y="110" width="90" height="6" rx="3" fill="white" opacity="0.5" />
      <rect x="40" y="122" width="80" height="6" rx="3" fill="white" opacity="0.5" />
      <rect x="40" y="134" width="70" height="6" rx="3" fill="white" opacity="0.5" />
    </svg>
  );
}

export function HelpDeskIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="helpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="160" height="160" rx="16" fill="url(#helpGrad)" />
      <rect x="35" y="35" width="130" height="95" rx="8" fill="white" opacity="0.95" />
      <circle cx="60" cy="60" r="12" fill="#6366f1" />
      <line x1="80" y1="55" x2="145" y2="55" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="70" x2="145" y2="70" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="60" cy="105" r="12" fill="#6366f1" />
      <line x1="80" y1="100" x2="145" y2="100" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="115" x2="145" y2="115" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="100" cy="160" r="16" fill="white" opacity="0.9" />
      <text x="100" y="168" fontSize="20" fontWeight="bold" fill="#6366f1" textAnchor="middle">?</text>
    </svg>
  );
}
