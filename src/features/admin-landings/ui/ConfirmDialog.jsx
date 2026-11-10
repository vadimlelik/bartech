'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

/**
 * @param {{
 *   open: boolean,
 *   title: string,
 *   description: string,
 *   confirmLabel?: string,
 *   confirmColor?: 'primary' | 'error' | 'warning' | 'success',
 *   cancelLabel?: string,
 *   busy?: boolean,
 *   onConfirm: () => void,
 *   onClose: () => void,
 * }} props
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  confirmColor = 'primary',
  cancelLabel = 'Отмена',
  busy = false,
  onConfirm,
  onClose,
}) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth aria-labelledby="confirm-dialog-title">
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button type="button" onClick={onConfirm} color={confirmColor} variant="contained" disabled={busy}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
