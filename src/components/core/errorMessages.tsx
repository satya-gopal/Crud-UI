import { Typography } from "@mui/material";

export const changeFirstCharToUpper = (string?: string): string => {
    if (!string) return string || "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
interface errorMessagesTypes {
  message: string;
  key: string;
}
const ErrorMessages = ({
  errorMessages,
  keyname,
}: {
  errorMessages: errorMessagesTypes[];
  keyname: string;
}) => {
  return (
    <Typography
      variant="subtitle2"
      className="text-[#d94841] text-[clamp(11px,0.69vw,13px)] font-poppins"
      sx={{
        display: errorMessages?.length ? "" : "none",
      }}
    >
      {changeFirstCharToUpper(
        errorMessages?.length
          ? errorMessages?.find((error: any) => error.key === keyname)?.message
          : ""
      )}
    </Typography>
  );
};
export default ErrorMessages;
