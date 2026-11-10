'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatLocalityLabel } from '../lib/selection';

export default function LocalityDialog({ open, selectedId, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setError('');
    setItems([]);
    setActive(0);
    setLoading(true);
    inputRef.current?.focus();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/localities?q=${encodeURIComponent(query)}&limit=15`,
          { signal: controller.signal },
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'search');
        setItems(Array.isArray(data.localities) ? data.localities : []);
        setActive(0);
        setError('');
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;
        setItems([]);
        setError('Не удалось загрузить города');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query.trim() ? 300 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [active, items]);

  const choose = async (item) => {
    if (!item) return;
    const saved = await onSelect(item);
    if (saved === false) setError('Не удалось сохранить город');
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(items.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(items[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  const status = loading ? 'Загрузка…' : error;

  return (
    <Dialog
      id="city-dialog"
      open={open}
      onClose={onClose}
      aria-labelledby="city-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="city-dialog-title" sx={{ pr: 6 }}>
        Выберите город
        <IconButton
          aria-label="Закрыть"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          autoFocus
          fullWidth
          size="small"
          placeholder="Начните вводить название города"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          inputProps={{
            'aria-label': 'Начните вводить название города',
            'aria-controls': 'city-dialog-list',
            'aria-activedescendant': items[active] ? `city-option-${items[active].id}` : undefined,
            role: 'combobox',
            'aria-expanded': true,
            'aria-autocomplete': 'list',
          }}
        />
        <Box sx={{ mt: 1, minHeight: 48 }}>
          {status ? (
            <Typography sx={{ px: 1, py: 1, color: error ? '#B42318' : '#6B7683', fontSize: 14 }}>{status}</Typography>
          ) : null}
          {!loading && items.length === 0 ? (
            <Typography sx={{ px: 1, py: 1, color: '#6B7683', fontSize: 14 }}>Ничего не найдено</Typography>
          ) : null}
          {items.length > 0 ? (
            <List
              id="city-dialog-list"
              ref={listRef}
              role="listbox"
              aria-label="Города"
              sx={{ maxHeight: 320, overflow: 'auto', py: 0 }}
            >
              {items.map((item, index) => (
                <ListItemButton
                  key={item.id}
                  id={`city-option-${item.id}`}
                  role="option"
                  data-active={index === active ? 'true' : 'false'}
                  selected={index === active}
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item)}
                >
                  <ListItemText
                    primary={formatLocalityLabel(item)}
                    primaryTypographyProps={item.id === selectedId ? { fontWeight: 700 } : undefined}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
