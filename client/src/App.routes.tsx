import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
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

const VerifyAuthRoute: React.ComponentType<{
  redirectTo: string;
}> = ({ redirectTo }) => {
  const { isAuth } = useAuthStore();
  if (isAuth) {
    return <Outlet />;
  }

  return <Navigate to={redirectTo} />;
};

// const VerifyUnauthRoute: React.ComponentType<{
//   redirectTo: string;
// }> = ({ redirectTo }) => {
//   const { isAuth, refreshToken, setAccessToken, logout, setUser } =
//     useAuthStore();
//   const { loading } = useQuery<
//     { result: { accessToken: string; user: User } },
//     { refreshToken?: string }
//   >(GET_NEW_ACCESSTOKEN_QUERY, {
//     variables: {
//       refreshToken,
//     },
//     onCompleted({ result: { accessToken, user } }) {
//       setAccessToken(accessToken);
//       setUser(user);
//     },
//     onError(error) {
//       toast.error(error.message);
//       logout();
//     },
//     context: {
//       headers: {
//         operation: "Login",
//       },
//     },
//     skip: !refreshToken,
//   });

//   if (loading) {
//     return <div>Verificando credenciales</div>;
//   }

//   if (!isAuth) {
//     return <Outlet />;
//   }

//   return <Navigate to={'../'} relative="route" />;
// };

// const ProtectedRoute: React.ComponentType<{
//   isAllowed: boolean;
//   redirectTo: string;
// }> = ({ isAllowed, redirectTo }) => {
//   const state = useAuthStore();
//   if (isAllowed) {
//     return (
//       <>
//         <JsonViewer value={state} />
//         <Outlet />
//       </>
//     );
//   }

//   return <Navigate to={redirectTo} />;
// };

function App() {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <SeekerProvider>
          <Routes>
            <Route element={<VerifyAuthRoute redirectTo="/auth" />}>
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
            <Route path="/auth" Component={LoginPage} />
            {/* <Route element={<VerifyUnauthRoute redirectTo="../" />}>
            </Route> */}
          </Routes>
        </SeekerProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export default App;
