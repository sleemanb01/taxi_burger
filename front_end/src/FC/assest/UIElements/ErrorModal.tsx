import { BasicModal } from "./Modal";

export function ErrorModal({
  onClear,
  error,
}: {
  onClear: Function;
  error: string | null;
}) {
  const TXT_ERROR = "אירעה שגיאה";

  return (
    <BasicModal
      show={!!error}
      header={TXT_ERROR}
      content={error!}
      onCancel={onClear}
    />
  );
}
