import { Dropdown, NavDropdown, Offcanvas, Toast } from "react-bootstrap";
import { Avatar } from "../Avatar";
import { useAuthStore } from "../../state/useAuthStore";
import { useLogout } from "../../hooks/useLogout";
import React, { useCallback, useState } from "react";
import { useSettingsStore } from "../../state/useSettingsStore";
import { useNavigate } from "react-router";
import { Notification, fieldNames } from "../../state/useNotificationStore";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AvatarPill } from "../AvatarPill";
import { Tooltip } from "../Tooltip";
import { Bell, Check2All, EyeFill, Filter } from "react-bootstrap-icons";
import { CustomClipboard } from "../CustomClipboard";
import { buildFullName } from "../../pages/UserPage/utils/buildFullName";
import { buildTimeAgo } from "../../utilities/buildTimeAgo";

const TOGGLE_READ_NOTIFICATION_MUTATION = gql`
  mutation ToggleReadNotification($id: String, $read: Boolean) {
    notification: toggleReadNotification(id: $id, read: $read) {
      id
    }
  }
`;

const filterNotification = (notifications?: Notification[], show?: boolean) => {
  if (!notifications) {
    return [];
  }
  if (typeof show === "undefined") {
    return notifications;
  }
  return notifications.filter((n) => n.read === show);
};

const FilterToggle: React.FC<{ filter: string }> = ({ filter, ...props }) => {
  return (
    <strong {...props}>
      Filtrar por <Filter fontSize={24} /> ({filter})
    </strong>
  );
};

const NotificationPanel: React.FC<{
  notifications?: Notification[];
  show: boolean;
  onHide: () => void;
}> = ({ show, onHide, notifications }) => {
  const [showOnlyRead, setShowOnlyRead] = useState<boolean | undefined>(
    undefined,
  );

  const [toggleReadNotification] = useMutation<
    { notification: Notification },
    { id: string; read: boolean }
  >(TOGGLE_READ_NOTIFICATION_MUTATION, {
    refetchQueries: [GET_ALL_NOTIFICATIONS],
  });

  return (
    <Offcanvas show={show} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Panel de notificaciones</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex gap-2 flex-column">
        <Dropdown role="button">
          <Dropdown.Toggle
            as={FilterToggle}
            filter={
              typeof showOnlyRead === "undefined"
                ? "Todos"
                : showOnlyRead
                ? "Leidos"
                : "No Leidos"
            }
          />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setShowOnlyRead(true)}>
              <div className="d-flex gap-1 align-items-center">
                <Check2All color={"#10c2b3"} fontSize={20} />
                <div>Leidos</div>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowOnlyRead(false)}>
              <div className="d-flex gap-1 align-items-center">
                <Check2All color={"gray"} fontSize={20} />
                <div>No leidos</div>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowOnlyRead(undefined)}>
              <div className="d-flex gap-1 align-items-center">
                <Check2All fontSize={20} color="red" />
                <div>Todos</div>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {filterNotification(notifications, showOnlyRead).map(
          ({ id, title, read, fieldName, property, timeAgo, from, to }) => (
            <Toast className="w-100">
              <Toast.Header closeButton={false}>
                <Bell className="rounded me-2" color="red" fontSize={18} />
                <strong className="me-auto">{title}</strong>
                <small>{buildTimeAgo(timeAgo)}</small>
              </Toast.Header>
              <Toast.Body>
                <div>
                  De:{" "}
                  <i>
                    <b>{buildFullName(from)}</b>
                  </i>
                </div>
                <div>
                  Para:{" "}
                  <i>
                    <b>{buildFullName(to)}</b>
                  </i>
                </div>
                <div>
                  Campo modificado:{" "}
                  <span className="text-primary fw-bold">
                    {fieldNames[fieldName]}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div>Codigo de predio: {property.code}</div>
                  <CustomClipboard text={property.code!} />
                </div>
                <div>
                  <div>Nombre del predio:</div>
                  <p className="text-success fw-bold">{property.name}</p>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <Tooltip label="Revisar">
                    <EyeFill
                      color="#3c7714"
                      fontSize={20}
                      role="button"
                      // onClick={() => {
                      //   navigate(`/properties/${property.id}`, {
                      //     replace: true,
                      //   });
                      // }}
                    />
                  </Tooltip>
                  <Tooltip
                    label={read ? "Marcar como no leido" : "Marcar como leido"}
                  >
                    <Check2All
                      color={read ? "#10c2b3" : "gray"}
                      fontSize={20}
                      role="button"
                      onClick={() => {
                        toggleReadNotification({
                          variables: {
                            id,
                            read: !read,
                          },
                        });
                        // toast.promise(
                        //   ,
                        //   {
                        //     loading: "cargando",
                        //     success: "listo",
                        //     error: "ups",
                        //   },
                        // );
                      }}
                    />
                  </Tooltip>
                </div>
              </Toast.Body>
            </Toast>
          ),
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { closeSession } = useLogout();
  const { sizeOfAvatar } = useSettingsStore();
  const [showPanel, setShowPanel] = useState(false);

  const { data } = useQuery<{ notifications: Notification[] }>(
    GET_ALL_NOTIFICATIONS,
  );

  const unreadNotifications = data?.notifications.filter((n) => !n.read).length;

  const handleLogout = () => closeSession();
  const navigateConfigurationPage = useCallback(
    () => navigate("/settings"),
    [navigate],
  );

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
        <NavDropdown.Item onClick={navigateConfigurationPage}>
          ⚙ Configuraciones
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => setShowPanel(true)}>
          🔔 Notificaciones
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>
          🔐 Cerrar sesión
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default Profile;
