import React from 'react';

const NotificationToast = ({ message, type, onClose }) => {
  const styles = {
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 duration-300 ${styles[type] || styles.info}`}>
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-white/30 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationToast;
