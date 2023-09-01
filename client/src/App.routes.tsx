import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { useAuth } from "./hooks";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Admin } from "./pages/Admin";
import { getNewAccessToken } from "./pages/Login/services";
import { FormCreateUser } from "./pages/User/components/FormCreateUser";
import { UserList } from "./pages/User/components/UserList";
import { Spinner } from "react-bootstrap";
import { PermissionsLayout } from "./pages/PermissionsLayout";
import { FormCreatePermission } from "./pages/PermissionsLayout/FormCreatePermission";
import { Permission } from "./pages/User/components/Permission";

function App() {
  const { accessToken, refreshToken, setAccessToken } = useAuth();
  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      if (!accessToken && refreshToken) {
        return getNewAccessToken(refreshToken);
      }
      throw new Error("Algo salio mal, recarge la pagina")
    },
    onSuccess(data) {
      setAccessToken(data.data.data.accessToken);
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  if (isLoading) {
    return <div className="position-absolute top-50 start-50 translate-middle"><Spinner variant='success'></Spinner></div>
  }

  return (
    <BrowserRouter>
      <Routes>
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
  );
}

export default App;
