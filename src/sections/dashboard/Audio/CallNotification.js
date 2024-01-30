import { faker } from "@faker-js/faker";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import { socket } from "../../../socket";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../../config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open, handleClose, call_details, updateAudioCallDialog }) => {



  const handleAccept = () => {
    socket.emit("audio_call_accepted", { ...call_details });
    updateAudioCallDialog(true);
  };

  const handleDeny = () => {
    //
    socket.emit("audio_call_denied", { ...call_details });
    handleClose();
  };

  useEffect(()=>{
    socket.on("video_call_missed", () => {
      // TODO => You can play an audio indicating call is missed at receiver's end
      // Abort call
      handleClose();
    });
    socket.on("end_audio_call", () => {
      // TODO => You can play an audio indicating call is missed at receiver's end
      // Abort call
      handleClose();
    });
    return () => {
      socket?.off("video_call_missed");
      socket?.off("end_audio_call");
    };
  },[])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeny}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Stack direction="row" spacing={24} p={2}>
            <Stack>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0OobsBilOGySRuaSpCmAMSiuupz02KRRgyDyM1308w&s"
              />
            </Stack>
            <Stack>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-NEvTnO-rQ9yJ00O4kmFxzxm7TuM6TCw_j-bCRCidcw&s"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept} variant="contained" color="success">
            Accept
          </Button>
          <Button onClick={handleDeny} variant="contained" color="error">
            Deny
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallNotification;
