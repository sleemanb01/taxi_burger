import { IUser } from "../../../typing/interfaces";
import { BACKEND_URL } from "../../../util/Constants";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./Item.css";

export function UserItem({ user }: { user: IUser }) {
  const image = user.image?.replaceAll("\\", "/");
  return (
    <li className="item">
      <Card className="item-card item__content">
        {/* <Link to={`/${user._id}/places`}> */}
        <div className="item__image">
          {user.image && (
            <Avatar
              image={BACKEND_URL ? BACKEND_URL + image : ""}
              alt={user.name + "image"}
            />
          )}
        </div>
        <div className="item__info">
          <h2>{user.name}</h2>
        </div>
        {/* </Link> */}
      </Card>
    </li>
  );
}
