import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { Bell, PersonLock } from "react-bootstrap-icons";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../state/useAuthStore";
import { Notification } from "../../state/useNotificationStore";
import { useSettingsStore } from "../../state/useSettingsStore";
import { Avatar } from "../Avatar";
import { AvatarPill } from "../AvatarPill";
import { NotificationPanel } from "../NotificationPanel";

export const GET_ALL_NOTIFICATIONS = gql`
  query GetAllNotifications {
    notifications: getAllNotifications {
      id
      fieldName
      title
      timeAgo
      read
      to {
        names
        firstLastName
        secondLastName
        username
      }
      from {
        names
        firstLastName
        secondLastName
        username
      }
      property {
        id
        name
        code
      }
    }
  }
`;

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { closeSession } = useLogout();
  const { sizeOfAvatar } = useSettingsStore();
  const [showPanel, setShowPanel] = useState(false);

  const { data } = useQuery<{ notifications: Notification[] }>(
    GET_ALL_NOTIFICATIONS,
  );

  const unreadNotifications = useMemo(() => data?.notifications.filter((n) => !n.read).length, [
    data?.notifications,
  ]);

  const handleLogout = () => closeSession();

  return (
    <>
      <NotificationPanel
        show={showPanel}
        onHide={() => setShowPanel(false)}
        notifications={data?.notifications}
      />
      <NavDropdown
        align={"end"}
        role="button"
        title={
          <Avatar
            sizing={sizeOfAvatar}
            letter={user?.username}
            badge={
              unreadNotifications && (
                <AvatarPill size={sizeOfAvatar} number={unreadNotifications} />
              )
            }
          />
        }
      >
        {/* <NavDropdown.Item onClick={navigateConfigurationPage}>
          <Gear fontSize={20} color="gray"/> Configuraciones
        </NavDropdown.Item> */}
        <NavDropdown.Item onClick={() => setShowPanel(true)}>
          <Bell fontSize={20} color="orange" /> Notificaciones
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>
          <PersonLock fontSize={20} color="red" /> Cerrar sesión
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default Profile;
