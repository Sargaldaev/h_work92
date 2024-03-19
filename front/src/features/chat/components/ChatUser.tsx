import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { UserForUsing } from "../../../types";
import { apiUrl } from "../../../constants.ts";

interface Props {
  user: UserForUsing;
}

const ChatUser: React.FC<Props> = ({ user }) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {user.avatar ? <Avatar src={apiUrl + user.avatar} /> : <Avatar />}
      <Typography variant="h5">
        {user.displayName === "" ? "Anonymous" : user.displayName}
      </Typography>
    </Box>
  );
};

export default ChatUser;
