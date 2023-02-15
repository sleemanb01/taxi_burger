import { IUser } from "../../types/interfaces";
import { UserItem } from "./UserItem";

import "../../styles/css/UsersList.css";

export function UsersList({ users }: { users: IUser[] }) {
  return (
    <ul className="users-list">
      {users.map((curr) => (
        <UserItem key={curr._id} user={curr} />
      ))}
    </ul>
  );
}
