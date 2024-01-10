import { ApolloProvider } from "@apollo/client";
import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { client } from "./config/wsClient";
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContext";
import { SeekerProvider } from "./context/SeekerContext";
import { useAuth } from "./hooks";
import { LoginPage } from "./pages/LoginPage";
import { FormCreatePermission } from "./pages/PermissionPage/components/FormCreatePermission";
import { Property } from "./pages/PropertyPage/components/Property";
import { PropertyForm } from "./pages/PropertyPage/components/PropertyForm";
import { PropertyList } from "./pages/PropertyPage/components/PropertyList";
import UserPage from "./pages/UserPage/UserPage";
import { FormCreateUser } from "./pages/UserPage/components/FormCreateUser";
import { useCan } from "./hooks/useCan";
import {
  Level,
  Resource,
} from "./pages/UserPage/components/Permission/Permission";

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
  const { data, loading } = useCan({
    can: [{ resource, level }],
  });

  if (loading) {
    return <div>Verificando sus permisos</div>;
  }

  if (data[`${level}@${resource}`]) {
    return <Outlet />;
  }

  return <Navigate to={"../"} />;
};

const ProtectedRoute: React.ComponentType<{
  isAllowed: boolean;
  redirectTo: string;
}> = ({ isAllowed, redirectTo }) => {
  if (isAllowed) {
    return <Outlet />;
  }

  return <Navigate to={redirectTo} />;
};

function App() {
  const { role, isAuth } = useAuth();
  const isAdmin = role === "administrador";

  return (
    <BrowserRouter>
      <AxiosProvider>
        <ApolloProvider client={client}>
          <AuthProvider>
            <SeekerProvider>
              <Routes>
                <Route path="/" element={<LazyComponent Component={NavBar} />}>
                  <Route
                    element={
                      <ProtectedRoute isAllowed={isAuth} redirectTo="/auth" />
                    }
                  >
                    <Route
                      index
                      element={<LazyComponent Component={HomePage} />}
                    />
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
                      <Route
                        element={
                          <ProtectedRouteWithPermission
                            level="CREATE"
                            resource="USER"
                          />
                        }
                      >
                        <Route path="create" Component={FormCreateUser} />
                        <Route
                          element={
                            <ProtectedRouteWithPermission
                              level="UPDATE"
                              resource="USER"
                            />
                          }
                        >
                          <Route
                            path="edit"
                            Component={() => {
                              const { state } = useLocation();

                              return <FormCreateUser user={state} />;
                            }}
                          />
                        </Route>
                      </Route>
                    </Route>
                    <Route path="/admin">
                      <Route
                        element={
                          <ProtectedRoute
                            isAllowed={isAdmin}
                            redirectTo="../"
                          />
                        }
                      >
                        <Route
                          path="records"
                          element={<LazyComponent Component={RecordPage} />}
                        />
                      </Route>
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
                            element={
                              <LazyComponent Component={PermissionPage} />
                            }
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
                          <Route
                            path="create"
                            Component={FormCreatePermission}
                          />
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

                              return (
                                <FormCreatePermission permission={state} />
                              );
                            }}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route
                  path="*"
                  element={<LazyComponent Component={NotFoundPage} />}
                />
                <Route path="/auth" Component={LoginPage} />
              </Routes>
            </SeekerProvider>
          </AuthProvider>
        </ApolloProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export default App;
