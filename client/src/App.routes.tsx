import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AxiosProvider } from "./context/AxiosContext";
import { SeekerProvider } from "./context/SeekerContext";
import { LoginPage } from "./pages/LoginPage";
import { FormCreatePermission } from "./pages/PermissionPage/components/FormCreatePermission";
import { Property } from "./pages/PropertyPage/components/Property";
import { PropertyForm } from "./pages/PropertyPage/components/PropertyForm";
import { PropertyList } from "./pages/PropertyPage/components/PropertyList";
import UserPage from "./pages/UserPage/UserPage";
import { FormCreateUser } from "./pages/UserPage/components/FormCreateUser";
import {
  Level,
  Resource,
} from "./pages/UserPage/components/Permission/Permission";
import { useAuthStore } from "./state/useAuthStore";
import { User } from "./pages/UserPage/models/types";
import { Spinner } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { toast } from "sonner";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const Permission = lazy(
  () => import("./pages/UserPage/components/Permission/Permission"),
);
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const PermissionPage = lazy(
  () => import("./pages/PermissionPage/PermissionPage"),
);
const PropertyPage = lazy(() => import("./pages/PropertyPage/PropertyPage"));
const RecordPage = lazy(() => import("./pages/RecordPage/RecordPage"));
const RolePage = lazy(() => import("./pages/RolePage/RolePage"));
const NavBar = lazy(() => import("./components/Navbar/Navbar"));

const LazyComponent = ({
  Component,
}: {
  Component: React.ComponentType<NonNullable<unknown>>;
}) => {
  return (
    <Suspense fallback={<div>Cargando modulo...</div>}>
      <Component />
    </Suspense>
  );
};

const ProtectedRouteWithPermission: React.ComponentType<{
  level: Level;
  resource: Resource;
}> = ({ level, resource }) => {
  const { can } = useAuthStore();

  if (can(`${level}@${resource}`)) {
    return <Outlet />;
  }

  return <Navigate to={"../"} />;
};

const GET_NEW_ACCESSTOKEN_QUERY = gql`
  query GetNewAccessToken($refreshToken: String) {
    result: getNewAccessToken(refreshToken: $refreshToken) {
      accessToken
      user {
        username
        role {
          name
          permissions {
            permission {
              level
              resource
            }
          }
        }
      }
    }
  }
`;

const VerifyAuthRoute: React.ComponentType = () => {
  const { isAuth, refreshToken, setAccessToken, logout, setUser } =
    useAuthStore();
  const navigate = useNavigate();
  useQuery<
    { result: { accessToken: string; user: User } },
    { refreshToken?: string }
  >(GET_NEW_ACCESSTOKEN_QUERY, {
    variables: {
      refreshToken,
    },
    onCompleted({ result: { accessToken, user } }) {
      setAccessToken(accessToken);
      setUser(user);
    },
    onError(error) {
      toast.error(error.message);
      logout();
      navigate("/auth");
    },
    context: {
      headers: {
        operation: "Login",
      },
    },
    skip: !refreshToken,
  });

  if (isAuth) {
    return <Outlet />;
  }

  if (!refreshToken) {
    return <Navigate to={"/auth"} />;
  }
};

const VerifyUnauthRoute: React.ComponentType = () => {
  const { refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  useQuery<
    { result: { accessToken: string; user: User } },
    { refreshToken?: string }
  >(GET_NEW_ACCESSTOKEN_QUERY, {
    variables: {
      refreshToken,
    },
    onCompleted() {
      navigate(-1);
    },
    onError(error) {
      toast.error(error.message);
      logout();
    },
    context: {
      headers: {
        operation: "Login",
      },
    },
    skip: !refreshToken,
  });

  if (!refreshToken) {
    return <Outlet />;
  }

  return (
    <div className="position-absolute translate-middle top-50 start-50 d-flex flex-column align-items-center gap-2">
      <Spinner variant="info" />
      <div>
        <b>Verificando credenciales</b>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <SeekerProvider>
          <Routes>
            <Route element={<VerifyAuthRoute />}>
              <Route path="/" element={<LazyComponent Component={NavBar} />}>
                <Route index element={<LazyComponent Component={HomePage} />} />
                <Route
                  path="properties"
                  element={<LazyComponent Component={PropertyPage} />}
                >
                  <Route
                    element={
                      <ProtectedRouteWithPermission
                        resource="PROPERTY"
                        level="READ"
                      />
                    }
                  >
                    <Route index Component={PropertyList} />
                    <Route path=":id" Component={Property} />
                  </Route>
                  <Route
                    element={
                      <ProtectedRouteWithPermission
                        resource="PROPERTY"
                        level="CREATE"
                      />
                    }
                  >
                    <Route path="create" Component={PropertyForm} />
                  </Route>
                </Route>
                <Route
                  path="/users"
                  element={
                    <ProtectedRouteWithPermission
                      level="READ"
                      resource="USER"
                    />
                  }
                >
                  <Route
                    index
                    element={<LazyComponent Component={UserPage} />}
                  />
                  <Route
                    path="permissions"
                    element={<LazyComponent Component={Permission} />}
                  />
                  <Route path="create" Component={FormCreateUser} />
                  <Route
                    path="edit"
                    Component={() => {
                      const { state } = useLocation();

                      return <FormCreateUser user={state} />;
                    }}
                  />
                </Route>
                <Route path="/admin">
                  <Route
                    path="records"
                    element={<LazyComponent Component={RecordPage} />}
                  />
                  <Route path="permissions">
                    <Route
                      element={
                        <ProtectedRouteWithPermission
                          level="READ"
                          resource="PERMISSION"
                        />
                      }
                    >
                      <Route
                        index
                        element={<LazyComponent Component={PermissionPage} />}
                      />
                    </Route>
                    <Route
                      element={
                        <ProtectedRouteWithPermission
                          level="CREATE"
                          resource="PERMISSION"
                        />
                      }
                    >
                      <Route path="create" Component={FormCreatePermission} />
                    </Route>
                    <Route
                      element={
                        <ProtectedRouteWithPermission
                          level="UPDATE"
                          resource="PERMISSION"
                        />
                      }
                    >
                      <Route
                        path="edit"
                        Component={() => {
                          const { state } = useLocation();

                          return <FormCreatePermission permission={state} />;
                        }}
                      />
                    </Route>
                    <Route
                      element={
                        <ProtectedRouteWithPermission
                          level="READ"
                          resource="ROLE"
                        />
                      }
                    >
                      <Route
                        element={
                          <ProtectedRouteWithPermission
                            level="CREATE"
                            resource="ROLE"
                          />
                        }
                      >
                        <Route
                          element={
                            <ProtectedRouteWithPermission
                              level="UPDATE"
                              resource="ROLE"
                            />
                          }
                        >
                          <Route
                            path=":role"
                            element={<LazyComponent Component={RolePage} />}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route
              path="*"
              element={<LazyComponent Component={NotFoundPage} />}
            />
            <Route element={<VerifyUnauthRoute />}>
              <Route path="/auth" Component={LoginPage} />
            </Route>
          </Routes>
        </SeekerProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export default App;
