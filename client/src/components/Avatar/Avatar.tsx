import { gql, useMutation, useQuery } from "@apollo/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Dropdown, Offcanvas, Toast } from "react-bootstrap";
import {
  Bell,
  BellFill,
  Check2All,
  EyeFill,
  Filter,
  InfoCircle,
  PersonCircle,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { buildFullName } from "../../pages/UserPage/utils/buildFullName";
import { useAuthStore } from "../../state/useAuthStore";
import { Notification, fieldNames } from "../../state/useNotificationStore";
import { CustomClipboard } from "../CustomClipboard";
import { Tooltip } from "../Tooltip";
import { buildTimeAgo } from "../../utilities/buildTimeAgo";

const LOGOUT = gql`
  mutation Logout($username: String, $token: String) {
    logout(username: $username, token: $token)
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
const TOGGLE_READ_NOTIFICATION_MUTATION = gql`
  mutation ToggleReadNotification($id: String, $read: Boolean) {
    notification: toggleReadNotification(id: $id, read: $read) {
      id
    }
  }
`;
const Avatar: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout: logoutLocal, user, refreshToken } = useAuthStore();
  const [show, setShow] = useState(false);
  const [showOnlyRead, setShowOnlyRead] = useState<boolean | undefined>(
    undefined,
  );
  const [logout] = useMutation<
    { logout: boolean },
    { username: string; token: string }
  >(LOGOUT, {
    onCompleted({ logout }) {
      if (logout) {
        logoutLocal();
      }
    },
  });
  const { data } = useQuery<{ notifications: Notification[] }>(
    GET_ALL_NOTIFICATIONS,
  );
  const [toggleReadNotification] = useMutation<
    { notification: Notification },
    { id: string; read: boolean }
  >(TOGGLE_READ_NOTIFICATION_MUTATION, {
    refetchQueries: [GET_ALL_NOTIFICATIONS],
  });
  const handleLogout = () => {
    if (user && refreshToken) {
      const promise = logout({
        variables: { username: user.username, token: refreshToken },
      });
      toast.promise(promise, {
        loading: "Cerrando sesión",
      });

      queryClient.clear();
    }
  };
  const unreadNotifications = data?.notifications.filter((n) => !n.read).length;
  return (
    <>
      <div className="position-relative">
        {unreadNotifications && unreadNotifications > 0 ? (
          <div
            className={`position-absolute translate-middle-y text-center z-1 border rounded-circle bg-danger text-white px-1 ${
              unreadNotifications >= 100 ? "py-1" : ""
            }`}
            style={{
              fontSize: 9,
            }}
          >
            {unreadNotifications >= 100 ? "+99" : unreadNotifications}
          </div>
        ) : undefined}
        <BellFill
          fontSize={36}
          color="skyblue"
          onClick={() => setShow(true)}
          role="button"
          title="Notificaciones"
        />
        <Offcanvas show={show} onHide={() => setShow(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Panel de notificaciones</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex gap-2 flex-column">
            <Dropdown role="button">
              <div className="d-flex gap-1 align-items-center">
                <Dropdown.Toggle as={Filter} fontSize={24} />
                <strong>Filtrar por</strong> (
                {typeof showOnlyRead === "undefined"
                  ? "Todos"
                  : showOnlyRead
                  ? "Leidos"
                  : "No leidos"}
                )
                <div>
                  <Tooltip label="Esta funcion es suceptible a errores, reporte cualquier inconveniente | v1.1-beta">
                    <InfoCircle color="red" fontSize={18} className="ms-2"/>
                  </Tooltip>
                </div>
              </div>

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
            {filterNotification(data?.notifications, showOnlyRead).map(
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
                          onClick={() => {
                            navigate(`/properties/${property.id}`, {
                              replace: true,
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        label={
                          read ? "Marcar como no leido" : "Marcar como leido"
                        }
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
      </div>
      <div className="mx-4 align-items-center d-flex flex-column">
        <div className="text-success fw-bold">{user?.username}</div>
        <div className="text-warning fw-medium">
          <small>{user?.role.name ?? "usuario sin rol"}</small>
        </div>
      </div>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Tooltip label="Mi Perfil" placement="bottom-end">
          <Dropdown align={"end"} role="button">
            <Dropdown.Toggle as={PersonCircle} fontSize={32} />
            <Dropdown.Menu>
              {/* <Dropdown.Item>👁‍🗨 Mi cuenta</Dropdown.Item>
              <Dropdown.Item>⚙ Configuraciones</Dropdown.Item> */}
              <Dropdown.Item onClick={handleLogout}>
                🔐 Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Tooltip>
      </div>
    </>
  );
};

export default Avatar;
