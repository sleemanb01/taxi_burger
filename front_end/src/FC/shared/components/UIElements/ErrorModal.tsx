import React from "react";
import { Button } from "../FormElements/Button";
import Modal from "./Modal";

export function ErrorModal({
  onClear,
  error,
}: {
  onClear: Function;
  error: string | null;
}) {
  const TXT_OK = "בסדר";

  return (
    <Modal
      onCancel={onClear}
      header="An Error Occurred!"
      show={!!error}
      style={{ zIndex: "100" }}
      footer={<Button onClick={onClear}>{TXT_OK}</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
}
