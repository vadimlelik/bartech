'use client';

import {
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CityPickDialog({ open, cities, currentSlug, onClose, onSelect, hint = '' }) {
  return (
    <Dialog id="city-dialog" open={open} onClose={onClose} aria-labelledby="city-dialog-title" fullWidth maxWidth="xs">
      <DialogTitle id="city-dialog-title" sx={{ pr: 6 }}>
        Выберите город
        <IconButton aria-label="Закрыть" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        {hint ? (
          <Typography component="p" sx={{ mt: 1, fontSize: 14, fontWeight: 400, color: 'text.secondary' }}>
            {hint}
          </Typography>
        ) : null}
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {cities.map((city) => (
          <ListItemButton
            key={city.slug}
            selected={city.slug === currentSlug}
            onClick={() => onSelect(city.slug)}
          >
            <ListItemText
              primary={city.name}
              primaryTypographyProps={city.slug === currentSlug ? { fontWeight: 700 } : undefined}
            />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
