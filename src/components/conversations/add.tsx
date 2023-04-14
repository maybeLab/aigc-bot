import { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { API_CREATE_CONVERSATION } from "@/fetch/api";
import { IConversation } from "@/types";
import { useSnackbar } from "notistack";

export interface IForm {
  name: string;
  preset: string;
}

interface Props {
  visible: boolean;
  onClose: (e?: IConversation) => void;
}

export default function FunctionDialog({ visible, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const formRef = useRef<HTMLFormElement>(null);
  const { control, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: { name: "", preset: "" },
  });

  useEffect(() => {
    if (!visible) {
      setValue("name", "");
      setValue("preset", "");
    }
  }, [setValue, visible]);

  const onSubmit: SubmitHandler<IForm> = (data) => {
    return API_CREATE_CONVERSATION(data).then((res) => {
      enqueueSnackbar("Created Success", {
        variant: "success",
        autoHideDuration: 2e3,
      });
      onClose(res);
    });
  };

  return (
    <Dialog open={visible} onClose={() => onClose()}>
      <DialogTitle>Create Bot</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                error={!!error}
                helperText={error ? "Name is required!" : ""}
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                variant="standard"
                {...field}
              />
            )}
          />
          <Controller
            name="preset"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                error={!!error}
                helperText={error ? "Preset is required!" : ""}
                margin="dense"
                label="Preset"
                fullWidth
                variant="standard"
                {...field}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
