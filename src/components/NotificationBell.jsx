import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { requestNotificationPermission, subscribeToNotifications } from "../utils/notifications";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    requestNotificationPermission();
    const unsubscribe = subscribeToNotifications(user.uid, (newNotifs) => {
      setNotifications((prev) => [...newNotifs, ...prev]);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="notification-bell">
      🔔 <span className="notif-count">{notifications.length}</span>
    </div>
  );
}