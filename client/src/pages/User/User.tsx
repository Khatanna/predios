import React from 'react';
import { UserList } from './components/UserList';

export type UserProps = {
}

const User: React.FC<UserProps> = ({ }) => {
	return <div>User
		{/* <Spinner></Spinner> */}
		<UserList></UserList>
	</div>;
};

export default User;
