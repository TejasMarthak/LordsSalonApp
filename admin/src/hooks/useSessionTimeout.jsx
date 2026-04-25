import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminConfig from '../adminConfig';

/**
 * Custom hook to handle session timeout after 1 hour of inactivity
 * Call this hook in your main App component with the admin token
 * 
 * Usage:
 * useSessionTimeout(adminToken, onLogout)
 */
export const useSessionTimeout = (adminToken, onLogout) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) return;

    let timeoutId;
    let activityCheckInterval;
    const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour
    const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

    // Function to update activity
    const updateActivity = async () => {
      try {
        const response = await axios.post(
          `${adminConfig.api.baseUrl}/api/auth/activity`,
          {},
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        return true;
      } catch (error) {
        // If activity update fails due to 401 (Unauthorized), token has expired
        if (error.response?.status === 401) {
          handleSessionTimeout();
          return false;
        }
        // Other errors are not critical, continue
        return true;
      }
    };

    // Function to show warning and clear session
    const handleSessionTimeout = () => {
      // Show warning dialog
      alert(
        'Your session has expired due to inactivity. Please log in again.'
      );

      // Clear token and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      onLogout?.();
      navigate('/login');
    };

    // Function to reset the timeout on activity
    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        handleSessionTimeout();
      }, INACTIVITY_TIMEOUT);
    };

    // Track user activity
    const trackActivity = (e) => {
      // Ignore certain events to avoid constant resets
      if (e.target.tagName === 'INPUT' && e.target.type === 'hidden') return;

      resetTimeout();

      // Update activity on server every 5 minutes of actual user activity
      updateActivity();
    };

    // Initial timeout setup
    resetTimeout();

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, trackActivity);
    });

    // Periodic activity check (validates token and updates activity)
    activityCheckInterval = setInterval(() => {
      updateActivity();
    }, CHECK_INTERVAL);

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (activityCheckInterval) clearInterval(activityCheckInterval);
      events.forEach((event) => {
        document.removeEventListener(event, trackActivity);
      });
    };
  }, [adminToken, navigate, onLogout]);
};

/**
 * Alternative: Modal warning component for session timeout
 * Shows a warning 5 minutes before timeout
 */
export const SessionWarningModal = ({
  isOpen,
  onExtendSession,
  onLogout,
  minutesRemaining,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Session Expiring Soon
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Your session will expire in {minutesRemaining} minute
          {minutesRemaining !== 1 ? 's' : ''} due to inactivity. Would you like
          to continue?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-400 transition"
          >
            Logout
          </button>
          <button
            onClick={onExtendSession}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};
