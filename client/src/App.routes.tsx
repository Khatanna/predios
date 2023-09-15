import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { useAuth, useAxios } from "./hooks";
import { useEffect, useRef } from "react";
import { Admin } from "./pages/Admin";
import { FormCreateUser } from "./pages/User/components/FormCreateUser";
import { UserList } from "./pages/User/components/UserList";
import { PermissionsLayout } from "./pages/PermissionsLayout";
import { FormCreatePermission } from "./pages/PermissionsLayout/components/FormCreatePermission";
import { Permission } from "./pages/User/components/Permission";
import { createAxiosStore, AxiosContext } from "./state/AxiosContext";

function App() {
  const axios = useAxios()
  const store = useRef(createAxiosStore(axios)).current

  const { accessToken, refreshToken, getNewAccessToken } = useAuth();

  useEffect(() => {
    if (!accessToken && refreshToken) {
      getNewAccessToken()
    }
  }, [accessToken, refreshToken, getNewAccessToken])

  return (
    <AxiosContext.Provider value={store}>
      <BrowserRouter >
        <Routes >
          <Route path="/" Component={Navbar}>
            <Route index Component={Home} />
            <Route path="/users">
              {/*<Route index Component={User} />*/}
              <Route path="all" Component={UserList} />
              <Route path="create" Component={FormCreateUser} />
              <Route
                path="edit"
                Component={() => {
                  const { state } = useLocation()

                  return <FormCreateUser user={state} />
                }}
              />
              <Route path="permissions" Component={Permission}>
              </Route>
            </Route>
            <Route path="/admin">
              <Route index Component={Admin} />
              {/* <Route path="usertype" Component={Usertype} /> */}
              <Route path="permissions">
                <Route path="all" Component={PermissionsLayout} />
                <Route path="create" Component={FormCreatePermission} />
                <Route path="edit" Component={() => {
                  const { state } = useLocation()

                  return <FormCreatePermission permission={state} />
                }}></Route>
              </Route>
            </Route>
          </Route>
          <Route path="/auth">
            <Route index Component={Login} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AxiosContext.Provider>
  );
}

export default App;
