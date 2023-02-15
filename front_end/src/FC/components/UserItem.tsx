import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import { IUser } from "../../types/interfaces";
import { BACKEND_URL } from "../../util/constants";

import "../../styles/css/Item.css";

export function UserItem({ user }: { user: IUser }) {
  const image = user.image?.replaceAll("\\", "/");
  return (
    <li className="item">
      <Card className="item-card item__content">
        <div className="item__image">
          {user.image && (
            <Avatar src={BACKEND_URL ? BACKEND_URL + image : ""} />
          )}
        </div>
        <div className="item__info">
          <h2>{user.name}</h2>
        </div>
      </Card>
    </li>
  );
}
