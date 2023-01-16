import { Link } from "react-router-dom";
import { IUser } from "../../../typing/interfaces";
import { BACKEND_URL } from "../../../util/Constants";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./UserItem.css";

export function UserItem({ user }: { user: IUser }) {
  const image = user.image?.replaceAll("\\", "/");
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${user._id}/places`}>
          <div className="user-item__image">
            {user.image && (
              <Avatar
                image={BACKEND_URL ? BACKEND_URL + image : ""}
                alt={user.name + "image"}
              />
            )}
          </div>
          <div className="user-item__info">
            <h2>{user.name}</h2>
          </div>
        </Link>
      </Card>
    </li>
  );
}
