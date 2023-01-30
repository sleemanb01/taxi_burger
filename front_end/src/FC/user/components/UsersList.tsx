import Card from "../../shared/components/UIElements/Card";
import { IUser } from "../../../typing/interfaces";
import { UserItem } from "./UserItem";

import "./UsersList.css";

export function UsersList({ users }: { users: IUser[] }) {
  const TXT_NO_USERS = ".לא נמצאו משתמשים";

  if (users.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>{TXT_NO_USERS}</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {users.map((curr) => (
        <UserItem key={curr._id} user={curr} />
      ))}
    </ul>
  );
}
