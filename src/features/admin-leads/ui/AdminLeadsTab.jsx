'use client';

import { useCallback, useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';

const EMPTY_FILTERS = {
  search: '',
  from: '',
  to: '',
  source: '',
  utm: '',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU');
}

function truncate(value, max = 90) {
  if (!value) return '—';
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function toIso(value, inclusiveEnd) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  if (inclusiveEnd) date.setSeconds(59, 999);
  return date.toISOString();
}

function optionValues(options, current) {
  const values = options.map((option) => option.value);
  if (current && !values.includes(current)) values.unshift(current);
  return values;
}

function optionLabel(options, value) {
  if (!value) return '';
  const found = options.find((option) => option.value === value);
  if (!found || !found.count) return value;
  return `${found.value} (${found.count})`;
}

function appendFilters(params, filters) {
  if (filters.search) params.set('search', filters.search);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.source) params.set('source', filters.source);
  if (filters.utm) params.set('utm', filters.utm);
}

function deleteTitle(target, total) {
  if (!target) return '';
  if (target.kind === 'matching') return `Удалить найденные заявки (${total})?`;
  if (target.ids.length === 1) return 'Удалить заявку?';
  return `Удалить выбранные заявки (${target.ids.length})?`;
}

export default function AdminLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [options, setOptions] = useState({ sources: [], utms: [] });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 40,
    total: 0,
    totalPages: 1,
  });
  const [selected, setSelected] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLeads = useCallback(async (nextPage = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(nextPage), limit: '40' });
      appendFilters(params, applied);
      const response = await fetch(`/api/admin/leads?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const items = Array.isArray(data.leads) ? data.leads : [];
      const totalPages = data.pagination?.totalPages || 1;
      if (items.length === 0 && nextPage > totalPages) {
        await fetchLeads(totalPages);
        return;
      }

      setLeads(items);
      setPagination(data.pagination || {
        page: nextPage,
        limit: 40,
        total: 0,
        totalPages: 1,
      });
      setOptions({
        sources: Array.isArray(data.options?.sources) ? data.options.sources : [],
        utms: Array.isArray(data.options?.utms) ? data.options.utms : [],
      });
      setSelected([]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
      setSnackbar({
        open: true,
        message: 'Ошибка загрузки заявок',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  const handleApply = () => {
    let fromValue = draft.from;
    let toValue = draft.to;
    if (fromValue && toValue && fromValue > toValue) {
      [fromValue, toValue] = [toValue, fromValue];
    }

    const nextDraft = {
      ...draft,
      search: draft.search.trim(),
      from: fromValue,
      to: toValue,
    };
    setDraft(nextDraft);
    setApplied({
      search: nextDraft.search,
      from: toIso(nextDraft.from, false),
      to: toIso(nextDraft.to, true),
      source: nextDraft.source,
      utm: nextDraft.utm,
    });
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      appendFilters(params, applied);
      const query = params.toString();
      const response = await fetch(`/api/admin/leads/export${query ? `?${query}` : ''}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'leads.xls';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting leads:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось выгрузить Excel',
        severity: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const removedIds = deleteTarget.kind === 'ids' ? deleteTarget.ids : [];
      const response = await fetch('/api/admin/leads', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          deleteTarget.kind === 'matching'
            ? { allMatching: true, ...applied }
            : { ids: removedIds },
        ),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось удалить заявки');
      }

      if (
        deleteTarget.kind === 'matching'
        || (selectedLead && removedIds.includes(selectedLead.id))
      ) {
        setSelectedLead(null);
      }
      setDeleteTarget(null);
      setSnackbar({
        open: true,
        message: `Удалено заявок: ${data.deleted ?? 0}`,
        severity: 'success',
      });
      await fetchLeads(page);
    } catch (error) {
      console.error('Error deleting leads:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Не удалось удалить заявки',
        severity: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(applied.search || applied.from || applied.to || applied.source || applied.utm);
  const draftFilled = Boolean(draft.search || draft.from || draft.to || draft.source || draft.utm);
  const pageIds = leads.map((lead) => lead.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked = pageIds.some((id) => selected.includes(id));
  const sourceOptions = optionValues(options.sources, draft.source);
  const utmOptions = optionValues(options.utms, draft.utm);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="h5" component="h2">
          Заявки
        </Typography>
        <Button variant="contained" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Выгрузка...' : 'Выгрузить Excel'}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'minmax(0, 1.3fr) minmax(0, 1.2fr) minmax(0, 0.9fr) minmax(210px, 230px) minmax(210px, 230px) auto',
          },
          gap: 1.5,
          mb: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          label="Поиск заявок"
          value={draft.search}
          onChange={(event) => setDraft((prev) => ({ ...prev, search: event.target.value }))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleApply();
            }
          }}
          sx={{ width: '100%' }}
        />
        <Autocomplete
          size="small"
          options={sourceOptions}
          value={draft.source || null}
          onChange={(_, value) => setDraft((prev) => ({ ...prev, source: value || '' }))}
          getOptionLabel={(value) => optionLabel(options.sources, value)}
          noOptionsText="Нет источников"
          renderInput={(params) => <TextField {...params} label="Источник" />}
          sx={{ width: '100%' }}
        />
        <Autocomplete
          size="small"
          options={utmOptions}
          value={draft.utm || null}
          onChange={(_, value) => setDraft((prev) => ({ ...prev, utm: value || '' }))}
          getOptionLabel={(value) => optionLabel(options.utms, value)}
          noOptionsText="Нет UTM"
          renderInput={(params) => <TextField {...params} label="UTM" />}
          sx={{ width: '100%' }}
        />
        <TextField
          size="small"
          label="С"
          type="datetime-local"
          value={draft.from}
          onChange={(event) => setDraft((prev) => ({ ...prev, from: event.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: '100%' }}
        />
        <TextField
          size="small"
          label="По"
          type="datetime-local"
          value={draft.to}
          onChange={(event) => setDraft((prev) => ({ ...prev, to: event.target.value }))}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: '100%' }}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="outlined" onClick={handleApply} sx={{ height: 40 }}>
            Найти
          </Button>
          {(hasFilters || draftFilled) && (
            <Button variant="text" onClick={handleReset} sx={{ height: 40 }}>
              Сбросить
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2">
          Найдено: {pagination.total}
        </Typography>
        {selected.length > 0 && (
          <Button
            size="small"
            color="error"
            variant="contained"
            disabled={loading || deleting}
            onClick={() => setDeleteTarget({ kind: 'ids', ids: selected })}
          >
            Удалить выбранные ({selected.length})
          </Button>
        )}
        {hasFilters && (
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={loading || deleting || pagination.total === 0}
            onClick={() => setDeleteTarget({ kind: 'matching' })}
          >
            Удалить найденные
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allChecked}
                      indeterminate={!allChecked && someChecked}
                      onChange={() => setSelected(allChecked ? [] : pageIds)}
                      inputProps={{ 'aria-label': 'Выбрать заявки на странице' }}
                    />
                  </TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Источник</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Данные заявки</TableCell>
                  <TableCell>UTM</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      hover
                      selected={selected.includes(lead.id)}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          checked={selected.includes(lead.id)}
                          onChange={() => setSelected((prev) => (
                            prev.includes(lead.id)
                              ? prev.filter((id) => id !== lead.id)
                              : [...prev, lead.id]
                          ))}
                          inputProps={{ 'aria-label': 'Выбрать заявку' }}
                        />
                      </TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>{lead.source || '—'}</TableCell>
                      <TableCell>{lead.phone || '—'}</TableCell>
                      <TableCell>{truncate(lead.title, 50)}</TableCell>
                      <TableCell>{truncate(lead.comments)}</TableCell>
                      <TableCell>{lead.utmSource || lead.utmCampaign || '—'}</TableCell>
                      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Удалить заявку"
                            onClick={() => setDeleteTarget({ kind: 'ids', ids: [lead.id] })}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                disabled={page <= 1}
                onClick={() => fetchLeads(page - 1)}
              >
                Назад
              </Button>
              <Typography sx={{ alignSelf: 'center' }}>
                {page} / {pagination.totalPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={page >= pagination.totalPages}
                onClick={() => fetchLeads(page + 1)}
              >
                Вперёд
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Заявка</DialogTitle>
        <DialogContent dividers>
          {selectedLead && (
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Typography><strong>Дата:</strong> {formatDate(selectedLead.createdAt)}</Typography>
              <Typography><strong>Источник:</strong> {selectedLead.source || '—'}</Typography>
              <Typography><strong>Страница:</strong> {selectedLead.pagePath || '—'}</Typography>
              <Typography><strong>Телефон:</strong> {selectedLead.phone || '—'}</Typography>
              <Typography><strong>Имя:</strong> {selectedLead.name || '—'}</Typography>
              <Typography><strong>Заголовок:</strong> {selectedLead.title || '—'}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                <strong>Данные заявки:</strong>
                {'\n'}
                {selectedLead.comments || '—'}
              </Typography>
              <Typography>
                <strong>UTM:</strong>
                {' '}
                {[
                  selectedLead.utmSource,
                  selectedLead.utmMedium,
                  selectedLead.utmCampaign,
                  selectedLead.utmContent,
                  selectedLead.utmTerm,
                ].filter(Boolean).join(' / ') || '—'}
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1.5,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: 12,
                }}
              >
                {JSON.stringify(selectedLead.payload ?? {}, null, 2)}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => selectedLead && setDeleteTarget({ kind: 'ids', ids: [selectedLead.id] })}
          >
            Удалить
          </Button>
          <Button onClick={() => setSelectedLead(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      >
        <DialogTitle>{deleteTitle(deleteTarget, pagination.total)}</DialogTitle>
        <DialogContent>
          Заявки будут удалены без возможности восстановления.
          {deleteTarget?.kind === 'matching'
            ? ' Удаляется вся текущая выборка, включая заявки на других страницах.'
            : ''}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>Отмена</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Удаляю…' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
