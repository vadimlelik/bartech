'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AdminGuard from '@/features/admin-guard/ui/AdminGuard';
import { LOCALITY_TYPES } from '@/entities/locality/lib/admin-query';

const EMPTY_FORM = {
  name: '',
  type: 'д.',
  districtId: '',
  latitude: '',
  longitude: '',
  isPopular: false,
  isActive: true,
  serviceCitySlug: '',
};

function jobText(job) {
  if (!job) return 'Справочник ещё не обновлялся из OSM.';
  if (job.status === 'running') return 'Импорт из OSM выполняется. Статус обновится на этой странице.';
  if (job.status === 'failed') return `Импорт не удался: ${job.error || 'ошибка'}`;
  return `Импорт завершён. Добавлено: ${job.added}. Обновлено: ${job.updated}. Без изменений: ${job.unchanged}. Пропущено: ${job.skipped}.`;
}

function LocalitiesAdmin() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({ q: '', regionId: '', districtId: '', popular: '', active: '' });
  const [applied, setApplied] = useState(filters);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadMeta = useCallback(async () => {
    const response = await fetch('/api/admin/localities/meta');
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Не удалось загрузить фильтры');
    setRegions(data.regions || []);
    setDistricts(data.districts || []);
    setCities(data.cities || []);
  }, []);

  const loadJob = useCallback(async () => {
    const response = await fetch('/api/admin/localities/import');
    const data = await response.json().catch(() => ({}));
    if (response.ok) setJob(data.job || null);
  }, []);

  const loadRows = useCallback(async (nextPage, nextApplied) => {
    const params = new URLSearchParams({ page: String(nextPage) });
    if (nextApplied.q) params.set('q', nextApplied.q);
    if (nextApplied.regionId) params.set('regionId', nextApplied.regionId);
    if (nextApplied.districtId) params.set('districtId', nextApplied.districtId);
    if (nextApplied.popular) params.set('popular', nextApplied.popular);
    if (nextApplied.active) params.set('active', nextApplied.active);
    const response = await fetch(`/api/admin/localities?${params}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Не удалось загрузить список');
    setRows(data.localities || []);
    setTotal(data.total || 0);
    setPage(data.page || 1);
    setPageSize(data.pageSize || 25);
    setSelected([]);
  }, []);

  useEffect(() => {
    loadMeta().catch((reason) => setError(reason.message));
    loadJob().catch(() => {});
    loadRows(1, applied).catch((reason) => setError(reason.message));
  }, [applied, loadJob, loadMeta, loadRows]);

  useEffect(() => {
    if (job?.status !== 'running') return undefined;
    const timer = setInterval(() => {
      loadJob().then(() => loadRows(page, applied)).catch(() => {});
    }, 4000);
    return () => clearInterval(timer);
  }, [applied, job?.status, loadJob, loadRows, page]);

  const districtOptions = useMemo(
    () => districts.filter((district) => !filters.regionId || String(district.regionId) === String(filters.regionId)),
    [districts, filters.regionId],
  );

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const allChecked = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  const toggle = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const applyFilters = () => {
    setPage(1);
    setApplied({ ...filters });
  };

  const startImport = async () => {
    setError('');
    const response = await fetch('/api/admin/localities/import', { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok && response.status !== 202) {
      setError(data.error || 'Не удалось запустить импорт');
      if (data.job) setJob(data.job);
      return;
    }
    setJob(data.job);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      districtId: Number(form.districtId),
      latitude: form.latitude === '' ? null : Number(form.latitude),
      longitude: form.longitude === '' ? null : Number(form.longitude),
    };
    const response = await fetch(editingId ? `/api/admin/localities/${editingId}` : '/api/admin/localities', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setError(data.error || 'Не удалось сохранить');
      return;
    }
    setForm(null);
    setEditingId(null);
    loadRows(page, applied).catch((reason) => setError(reason.message));
  };

  const remove = async () => {
    const response = await fetch(`/api/admin/localities/${deleteId}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || 'Не удалось удалить');
      return;
    }
    setDeleteId(null);
    loadRows(page, applied).catch((reason) => setError(reason.message));
  };

  const bulk = async (patch) => {
    const response = await fetch('/api/admin/localities/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected, ...patch }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || 'Не удалось обновить выбранные');
      return;
    }
    loadRows(page, applied).catch((reason) => setError(reason.message));
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      type: row.type,
      districtId: String(row.districtId),
      latitude: row.latitude ?? '',
      longitude: row.longitude ?? '',
      isPopular: row.isPopular,
      isActive: row.isActive,
      serviceCitySlug: row.serviceCitySlug || '',
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Населённые пункты
        </Typography>
        <Button component={Link} href="/admin" variant="text">К админке</Button>
      </Stack>
      <Alert severity={job?.status === 'failed' ? 'error' : 'info'} sx={{ mb: 2 }}>{jobText(job)}</Alert>
      {error ? <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert> : null}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={startImport} disabled={job?.status === 'running'}>
          Обновить справочник из OSM
        </Button>
        <Button variant="outlined" onClick={() => { setEditingId(null); setForm({ ...EMPTY_FORM }); }}>Добавить вручную</Button>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }}>
        <TextField size="small" label="Название" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <TextField select size="small" label="Область" value={filters.regionId} onChange={(event) => setFilters({ ...filters, regionId: event.target.value, districtId: '' })} sx={{ minWidth: 180 }}>
          <MenuItem value="">Все</MenuItem>
          {regions.map((region) => <MenuItem key={region.id} value={String(region.id)}>{region.name}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Район" value={filters.districtId} onChange={(event) => setFilters({ ...filters, districtId: event.target.value })} sx={{ minWidth: 220 }}>
          <MenuItem value="">Все</MenuItem>
          {districtOptions.map((district) => <MenuItem key={district.id} value={String(district.id)}>{district.name}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Популярный" value={filters.popular} onChange={(event) => setFilters({ ...filters, popular: event.target.value })} sx={{ minWidth: 140 }}>
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="1">Да</MenuItem>
          <MenuItem value="0">Нет</MenuItem>
        </TextField>
        <TextField select size="small" label="Активный" value={filters.active} onChange={(event) => setFilters({ ...filters, active: event.target.value })} sx={{ minWidth: 140 }}>
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="1">Да</MenuItem>
          <MenuItem value="0">Нет</MenuItem>
        </TextField>
        <Button variant="contained" onClick={applyFilters}>Найти</Button>
      </Stack>
      {selected.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Button size="small" onClick={() => bulk({ isActive: true })}>Включить</Button>
          <Button size="small" onClick={() => bulk({ isActive: false })}>Выключить</Button>
          <Button size="small" onClick={() => bulk({ isPopular: true })}>Сделать популярными</Button>
          <Button size="small" onClick={() => bulk({ isPopular: false })}>Убрать из популярных</Button>
        </Stack>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={allChecked} onChange={() => setSelected(allChecked ? [] : rows.map((row) => row.id))} />
              </TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Область</TableCell>
              <TableCell>Район</TableCell>
              <TableCell>Популярный</TableCell>
              <TableCell>Активный</TableCell>
              <TableCell>Обслуживает</TableCell>
              <TableCell>Координаты</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => toggle(row.id)} />
                </TableCell>
                <TableCell>{row.type} {row.name}</TableCell>
                <TableCell>{row.region}</TableCell>
                <TableCell>{row.district}</TableCell>
                <TableCell>{row.isPopular ? 'да' : 'нет'}</TableCell>
                <TableCell>{row.isActive ? 'да' : 'нет'}</TableCell>
                <TableCell>{cities.find((city) => city.slug === row.serviceCitySlug)?.name || '—'}</TableCell>
                <TableCell>{row.latitude == null ? '—' : `${row.latitude}, ${row.longitude}`}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(row)}>Изменить</Button>
                  <Button size="small" color="error" onClick={() => setDeleteId(row.id)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9}>Ничего не найдено. Справочник появится после импорта из OSM.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">Всего: {total}</Typography>
        <Pagination count={pages} page={page} onChange={(_event, value) => loadRows(value, applied)} />
      </Box>

      <Dialog open={Boolean(form)} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Редактирование' : 'Новый населённый пункт'}</DialogTitle>
        <DialogContent>
          {form && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Название" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <FormControl>
                <InputLabel id="locality-type">Тип</InputLabel>
                <Select labelId="locality-type" label="Тип" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                  {LOCALITY_TYPES.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField select label="Район" value={form.districtId} onChange={(event) => setForm({ ...form, districtId: event.target.value })}>
                {districts.map((district) => {
                  const region = regions.find((item) => item.id === district.regionId);
                  return <MenuItem key={district.id} value={String(district.id)}>{region?.name ? `${region.name}, ${district.name}` : district.name}</MenuItem>;
                })}
              </TextField>
              <TextField select label="Город обслуживания" value={form.serviceCitySlug} onChange={(event) => setForm({ ...form, serviceCitySlug: event.target.value })}>
                <MenuItem value="">Не задан</MenuItem>
                {cities.map((city) => <MenuItem key={city.slug} value={city.slug}>{city.name}</MenuItem>)}
              </TextField>
              <TextField label="Широта" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} />
              <TextField label="Долгота" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} />
              <FormControlLabel control={<Switch checked={form.isPopular} onChange={(event) => setForm({ ...form, isPopular: event.target.checked })} />} label="Популярный" />
              <FormControlLabel control={<Switch checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />} label="Активный" />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Отмена</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Сохраняю…' : 'Сохранить'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Удалить населённый пункт?</DialogTitle>
        <DialogContent>Это редкая операция. Запись пропадёт из выбора города.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Отмена</Button>
          <Button color="error" onClick={remove}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function AdminLocalitiesPage() {
  return (
    <AdminGuard>
      <LocalitiesAdmin />
    </AdminGuard>
  );
}
