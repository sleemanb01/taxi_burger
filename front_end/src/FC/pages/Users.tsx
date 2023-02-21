import React from "react";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { IUser } from "../../types/interfaces";
import { ENDPOINT_GETUSERS } from "../../util/constants";
import { UserItem } from "../components/UserItem";
import { ErrorModal } from "../components/util/UIElements/ErrorModal";
import List from "../components/util/UIElements/List";
import LoadingSpinner from "../components/util/UIElements/LoadingSpinner";

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
