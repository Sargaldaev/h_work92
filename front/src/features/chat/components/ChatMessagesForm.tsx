import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MessageForm } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../app/hook.ts";
import { setCurrentMessageForUser } from "../../../store/chat/chatSlice.ts";

interface Props {
  onSubmit: (message: MessageForm) => void;
}

const initialState: MessageForm = {
  text: "",
};

const ChatMessagesForm: React.FC<Props> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<MessageForm>(initialState);
  const { currentMessageForUser } = useAppSelector((state) => state.chat);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const sendData = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(state);
    setState(initialState);
  };

  return (
    <Box
      component="form"
      onSubmit={sendData}
      display="flex"
      position={"relative"}
      gap={1}
      paddingRight={2}
    >
      {currentMessageForUser && (
        <Box
          display={"flex"}
          gap={2}
          position={"absolute"}
          top={"-70%"}
          sx={{
            background: "#121212",
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
            borderRadius: "4px",
            alignItems: "center",
            justifyContent: "space-between",
            paddingX: "10px",
          }}
        >
          <Typography
            sx={{
              color: "white",
            }}
          >
            {currentMessageForUser.displayName}
          </Typography>
          <Button onClick={() => dispatch(setCurrentMessageForUser(null))}>
            X
          </Button>
        </Box>
      )}
      <TextField
        required
        placeholder="ChatMessage"
        inputProps={{ style: { color: "white" } }}
        sx={{ "& fieldset": { borderRadius: 2 }, width: "100%" }}
        name="text"
        value={state.text}
        onChange={changeValue}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          ":disabled": {
            pointerEvents: "auto",
            cursor: "not-allowed",
          },
          height: 55,
        }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

export default ChatMessagesForm;
