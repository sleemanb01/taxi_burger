import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import { IUser } from "../../types/interfaces";
import { BACKEND_URL } from "../../util/constants";

export function UserItem({ item }: { item: IUser }) {
  const image = item.image?.replaceAll("\\", "/");
  return (
    <li className="item">
      <Card className="item-card item__content">
        <div className="item__image">
          {item.image && (
            <Avatar src={BACKEND_URL ? BACKEND_URL + image : ""} />
          )}
        </div>
        <div className="item__info">
          <h2>{item.name}</h2>
        </div>
      </Card>
    </li>
  );
}
