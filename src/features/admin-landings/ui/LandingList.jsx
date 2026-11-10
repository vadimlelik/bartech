'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AdminThumbImage from '@/features/admin-images/ui/AdminThumbImage';
import ConfirmDialog from './ConfirmDialog';

/**
 * @param {string | undefined} value
 */
function formatUpdated(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * @param {{
 *   refreshKey: number,
 *   reloadToken: number,
 *   onNotify: (message: string, severity: 'success' | 'error' | 'warning') => void,
 *   onCreate: () => void,
 *   onEdit: (landing: import('../model/types').LandingRecord) => void,
 *   onDuplicate: (landing: import('../model/types').LandingRecord) => void,
 * }} props
 */
export default function LandingList({
  refreshKey,
  reloadToken,
  onNotify,
  onCreate,
  onEdit,
  onDuplicate,
}) {
  const notifyRef = useRef(onNotify);
  notifyRef.current = onNotify;
  const [rows, setRows] = useState(/** @type {import('../model/types').LandingRecord[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(/** @type {{ field: 'title' | 'slug' | 'updated_at' | 'is_active', dir: 'asc' | 'desc' }} */ ({
    field: 'updated_at',
    dir: 'desc',
  }));
  const [togglingId, setTogglingId] = useState(/** @type {number | null} */ (null));
  const [deleting, setDeleting] = useState(/** @type {import('../model/types').LandingRecord | null} */ (null));
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/landings', { credentials: 'include' });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || 'Не удалось загрузить лендинги');
        }
        if (!cancelled) {
          setRows(Array.isArray(data.landings) ? data.landings : []);
        }
      } catch (error) {
        if (!cancelled) {
          setRows([]);
          const message = error instanceof Error ? error.message : 'Не удалось загрузить лендинги';
          notifyRef.current(message, 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, reloadToken]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter((landing) => {
      if (!query) return true;
      return [landing.title, landing.slug, landing.main_title].some((part) => (
        String(part || '').toLowerCase().includes(query)
      ));
    });
    const direction = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((left, right) => {
      if (sort.field === 'updated_at') {
        const leftTime = new Date(left.updated_at || 0).getTime();
        const rightTime = new Date(right.updated_at || 0).getTime();
        return (leftTime - rightTime) * direction;
      }
      if (sort.field === 'is_active') {
        return (Number(Boolean(left.is_active)) - Number(Boolean(right.is_active))) * direction;
      }
      const leftText = String(left[sort.field] || '').toLocaleLowerCase('ru');
      const rightText = String(right[sort.field] || '').toLocaleLowerCase('ru');
      return leftText.localeCompare(rightText, 'ru') * direction;
    });
  }, [rows, search, sort]);

  /**
   * @param {'title' | 'slug' | 'updated_at' | 'is_active'} field
   */
  const toggleSort = (field) => {
    setSort((current) => {
      if (current.field === field) {
        return { field, dir: current.dir === 'asc' ? 'desc' : 'asc' };
      }
      const dir = field === 'title' || field === 'slug' ? 'asc' : 'desc';
      return { field, dir };
    });
  };

  /**
   * @param {import('../model/types').LandingRecord} landing
   */
  const copyAddress = async (landing) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${landing.slug}`);
      notifyRef.current('Адрес скопирован', 'success');
    } catch {
      notifyRef.current('Не удалось скопировать адрес', 'error');
    }
  };

  /**
   * @param {import('../model/types').LandingRecord} landing
   */
  const toggleActive = async (landing) => {
    const next = !landing.is_active;
    setTogglingId(landing.id);
    setRows((current) => current.map((item) => (
      item.id === landing.id ? { ...item, is_active: next } : item
    )));
    try {
      const response = await fetch(`/api/admin/landings/${landing.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: next }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось изменить статус');
      }
      notifyRef.current(next ? 'Лендинг опубликован' : 'Лендинг переведён в черновик', 'success');
    } catch (error) {
      setRows((current) => current.map((item) => (
        item.id === landing.id ? { ...item, is_active: landing.is_active } : item
      )));
      const message = error instanceof Error ? error.message : 'Не удалось изменить статус';
      notifyRef.current(message, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const response = await fetch(`/api/admin/landings/${deleting.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось удалить лендинг');
      }
      setRows((current) => current.filter((item) => item.id !== deleting.id));
      notifyRef.current('Лендинг удалён', 'success');
      setDeleting(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось удалить лендинг';
      notifyRef.current(message, 'error');
    } finally {
      setDeleteBusy(false);
    }
  };

  /**
   * @param {'title' | 'slug' | 'updated_at' | 'is_active'} field
   * @param {string} label
   */
  const sortLabel = (field, label) => (
    <TableSortLabel
      active={sort.field === field}
      direction={sort.field === field ? sort.dir : 'asc'}
      onClick={() => toggleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h2">
          Управление лендингами
        </Typography>
        <Button type="button" variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Добавить лендинг
        </Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Поиск по названию или slug"
        aria-label="Поиск лендингов"
        sx={{ mb: 2, maxWidth: 420 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Список лендингов">
            <TableHead>
              <TableRow>
                <TableCell>Превью</TableCell>
                <TableCell>{sortLabel('title', 'Название')}</TableCell>
                <TableCell>{sortLabel('slug', 'Slug')}</TableCell>
                <TableCell>{sortLabel('is_active', 'Статус')}</TableCell>
                <TableCell>{sortLabel('updated_at', 'Изменён')}</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      {rows.length === 0 ? 'Лендингов пока нет' : 'Ничего не найдено'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : visibleRows.map((landing) => (
                <TableRow key={landing.id} hover>
                  <TableCell>
                    {landing.main_image ? (
                      <AdminThumbImage src={landing.main_image} alt="" width={48} height={48} style={{ borderRadius: 6, objectFit: 'cover' }} />
                    ) : (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.disabled',
                        }}
                      >
                        <ImageOutlinedIcon fontSize="small" />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{landing.title}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        /{landing.slug}
                      </Typography>
                      <Tooltip title="Скопировать адрес">
                        <IconButton type="button" size="small" aria-label={`Скопировать адрес /${landing.slug}`} onClick={() => copyAddress(landing)}>
                          <ContentCopyIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      sx={{ mr: 0 }}
                      label={landing.is_active ? 'Опубликован' : 'Черновик'}
                      control={(
                        <Switch
                          size="small"
                          checked={Boolean(landing.is_active)}
                          disabled={togglingId === landing.id}
                          onChange={() => toggleActive(landing)}
                          inputProps={{ 'aria-label': landing.is_active ? 'Снять с публикации' : 'Опубликовать' }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>{formatUpdated(landing.updated_at)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton type="button" aria-label={`Редактировать ${landing.title}`} onClick={() => onEdit(landing)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Дублировать">
                      <IconButton type="button" aria-label={`Дублировать ${landing.title}`} onClick={() => onDuplicate(landing)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Открыть на сайте">
                      <IconButton
                        type="button"
                        component="a"
                        href={`/${landing.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Открыть /${landing.slug} на сайте`}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton type="button" color="error" aria-label={`Удалить ${landing.title}`} onClick={() => setDeleting(landing)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Удалить лендинг?"
        description={deleting ? `«${deleting.title}» будет удалён без возможности восстановления.` : ''}
        confirmLabel="Удалить"
        confirmColor="error"
        busy={deleteBusy}
        onClose={() => {
          if (!deleteBusy) setDeleting(null);
        }}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
