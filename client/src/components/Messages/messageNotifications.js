import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const MessageNotifications = (props) => {
  const { notifications } = props;

  var prevTime;

  const notificationTime = (notification) => {
    const time = moment(notification.date).fromNow();

    if (!prevTime || prevTime !== time) {
      prevTime = time;
      return time;
    }
  };

  return (
    <div id="messages-notifications">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <FontAwesomeIcon icon={faBell} />
        </Dropdown.Toggle>

        <Dropdown.Menu id="notifications-dropdown">
          {notifications.map((notification) => {
            return (
              <div key={notification._id}>
                <Dropdown.Header>
                  {notificationTime(notification)}
                </Dropdown.Header>
                <Dropdown.Item>{notification.message}</Dropdown.Item>
              </div>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MessageNotifications;
