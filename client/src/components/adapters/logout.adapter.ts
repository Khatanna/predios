type LogoutArgsAdapter = {
  logout: boolean;
};

type LogoutReturnAdapter = {
  isLogout: boolean;
};

export const logoutAdapter = (data: LogoutArgsAdapter): LogoutReturnAdapter => {
  return {
    isLogout: data.logout,
  };
};
