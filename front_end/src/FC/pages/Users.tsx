import React from "react";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { IUser } from "../../types/interfaces";
import { ENDPOINT_GETUSERS } from "../../util/constants";
import List from "../assest/List";
import LoadingSpinner from "../assest/LoadingSpinner";
import { ErrorModal } from "../assest/UIElements/ErrorModal";
import { UserItem } from "../components/UserItem";

/* ************************************************************************************************** */

function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(ENDPOINT_GETUSERS);
        setUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <List
        renderItem={UserItem}
        data={users}
        keyExtractor={({ _id }) => _id}
      />
    </React.Fragment>
  );
}

export default Users;
