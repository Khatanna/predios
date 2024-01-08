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
                      <Route index Component={PropertyList} />
                      <Route
                        element={
                          <ProtectedRoute
                            isAllowed={isAdmin}
                            redirectTo="../"
                          />
                        }
                      >
                        <Route path="create" Component={PropertyForm} />
                      </Route>
                      <Route path=":id" Component={Property} />
                    </Route>
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute
                          isAllowed={isAdmin}
                          redirectTo="/properties"
                        />
                      }
                    >
                      <Route
                        index
                        element={<LazyComponent Component={UserPage} />}
                      />
                      <Route path="create" Component={FormCreateUser} />
                      <Route
                        path="edit"
                        Component={() => {
                          const { state } = useLocation();

                          return <FormCreateUser user={state} />;
                        }}
                      />
                      <Route
                        path="permissions"
                        element={<LazyComponent Component={Permission} />}
                      />
                    </Route>
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute
                          isAllowed={isAdmin}
                          redirectTo="/properties"
                        />
                      }
                    >
                      <Route
                        path="records"
                        element={<LazyComponent Component={RecordPage} />}
                      />
                      <Route path="permissions">
                        <Route
                          index
                          element={<LazyComponent Component={PermissionPage} />}
                        />
                        <Route path="create" Component={FormCreatePermission} />
                        <Route
                          path="edit"
                          Component={() => {
                            const { state } = useLocation();

                            return <FormCreatePermission permission={state} />;
                          }}
                        />
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
