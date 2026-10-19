'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU');
}

function truncate(value, max = 90) {
  if (!value) return '—';
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function AdminLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 40,
    total: 0,
    totalPages: 1,
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLeads = useCallback(async (nextPage = 1, search = searchTerm) => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(
        `/api/admin/leads?page=${nextPage}&limit=40${searchParam}`,
        { credentials: 'include' },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setPagination(data.pagination || {
        page: nextPage,
        limit: 40,
        total: 0,
        totalPages: 1,
      });
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
  }, [searchTerm]);

  useEffect(() => {
    fetchLeads(1, searchTerm);
  }, [fetchLeads, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleSearchReset = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(`/api/admin/leads/export${searchParam}`, {
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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="h5" component="h2">
          Заявки
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
          }}
        >
          <TextField
            size="small"
            label="Поиск заявок"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
              }
            }}
            sx={{ minWidth: { xs: '100%', sm: 260 } }}
          />
          <Button variant="outlined" onClick={handleSearch}>
            Найти
          </Button>
          {searchTerm && (
            <Button variant="text" onClick={handleSearchReset}>
              Сбросить
            </Button>
          )}
          <Button variant="contained" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Выгрузка...' : 'Выгрузить Excel'}
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Найдено: {pagination.total}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Источник</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Данные заявки</TableCell>
                  <TableCell>UTM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>{lead.source || '—'}</TableCell>
                      <TableCell>{lead.phone || '—'}</TableCell>
                      <TableCell>{truncate(lead.title, 50)}</TableCell>
                      <TableCell>{truncate(lead.comments)}</TableCell>
                      <TableCell>{lead.utmSource || lead.utmCampaign || '—'}</TableCell>
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
          <Button onClick={() => setSelectedLead(null)}>Закрыть</Button>
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
