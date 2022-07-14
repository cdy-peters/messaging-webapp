import React, { useState, useEffect, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const MessageNotifications = (props) => {
  const { notifications } = props;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsBottom = useRef(null);
  var prevTime;

  const notificationTime = (notification) => {
    const time = moment(notification.date).fromNow();

    if (!prevTime || prevTime !== time) {
      prevTime = time;
      return (
        <Dropdown.Header>
          <p className="notification-time">
            <span>{time}</span>
          </p>
        </Dropdown.Header>
      );
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const scrollBottom = () => {
    notificationsBottom.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showNotifications) {
      scrollBottom();
    }
  }, [notifications, showNotifications]);

  return (
    <div id="messages-notifications">
      <Dropdown onToggle={toggleNotifications}>
        <Dropdown.Toggle id="notifications-button">
          <FontAwesomeIcon icon={faBell} />
        </Dropdown.Toggle>

        <Dropdown.Menu id="notifications-dropdown">
          {notifications.map((notification) => {
            return (
              <div key={notification._id}>
                {notificationTime(notification)}
                <Dropdown.Header id="notification-text">
                  {notification.message}
                </Dropdown.Header>
              </div>
            );
          })}
          {showNotifications && <div ref={notificationsBottom}></div>}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MessageNotifications;
