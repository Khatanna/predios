import React from "react";
import { NavDropdown } from "react-bootstrap";
import { Bell, PersonLock } from "react-bootstrap-icons";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../state/useAuthStore";
import { useNotificationStore } from "../../state/useNotificationStore";
import { useSettingsStore } from "../../state/useSettingsStore";
import { Avatar } from "../Avatar";
import { AvatarPill } from "../AvatarPill";

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { closeSession } = useLogout();
  const { sizeOfAvatar } = useSettingsStore();
  const { showPanel, unreadNotifications } = useNotificationStore();
  const handleLogout = () => closeSession();

  return (
    <>
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
        <NavDropdown.Item onClick={showPanel}>
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
