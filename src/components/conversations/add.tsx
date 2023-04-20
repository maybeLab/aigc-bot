import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Autorenew } from "@mui/icons-material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import genName from "sillyname";

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
    return API_CREATE_CONVERSATION(data)
      .then((res) => {
        enqueueSnackbar("Created Success", {
          variant: "success",
          autoHideDuration: 2e3,
        });
        onClose(res);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      });
  };

  const generateName = React.useCallback(() => {
    setValue("name", genName());
  }, [setValue]);

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
                label="Bot Name"
                fullWidth
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="delete" onClick={generateName}>
                        <Autorenew />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="preset"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                error={!!error}
                placeholder="You are my {} assistant, please help me {do something}"
                margin="dense"
                label="Preset"
                fullWidth
                variant="standard"
                multiline
                maxRows={3}
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
