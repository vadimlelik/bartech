'use client';

import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Drawer,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import BasicsSection from './BasicsSection';
import ImagesSection from './ImagesSection';
import ListsSection from './ListsSection';
import ReviewsSection from './ReviewsSection';
import AppearanceSection from './AppearanceSection';
import LandingPreview from './LandingPreview';
import ConfirmDialog from './ConfirmDialog';
import { duplicateLandingForm, emptyLandingForm, landingToForm } from '../model/defaults';
import { landingResolver } from '../model/validation';
import { toApiPayload } from '../model/payload';
import { clearDraft, draftStorageKey, readDraft, stableStringify, writeDraft } from '../model/draft';
import { isValidSlug, slugify } from '../model/slug';

const TABS = [
  { id: 'basic', label: 'Основное' },
  { id: 'images', label: 'Изображения' },
  { id: 'lists', label: 'Преимущества' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'appearance', label: 'Оформление' },
];

/**
 * @param {string} id
 */
function focusField(id) {
  window.setTimeout(() => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element?.focus();
  }, 40);
}

/**
 * Полноэкранный редактор: длинной форме тесно в модалке, а превью справа
 * требует ширины, которой нет у drawer.
 * @param {{
 *   open: boolean,
 *   mode: import('../model/types').LandingEditorMode,
 *   landing: import('../model/types').LandingRecord | null,
 *   onClose: () => void,
 *   onSaved: (message: string) => void,
 * }} props
 */
export default function LandingEditor({ open, mode, landing, onClose, onSaved }) {
  const form = useForm({
    defaultValues: emptyLandingForm(),
    resolver: landingResolver,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = form;
  const values = useWatch({ control }) || emptyLandingForm();
  const landingRef = useRef(landing);
  landingRef.current = landing;
  const slugTouchedRef = useRef(false);
  const baselineRef = useRef(emptyLandingForm());
  const submittingRef = useRef(false);
  const [tab, setTab] = useState(0);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(
    /** @type {{ values: import('../model/types').LandingFormValues } | null} */ (null),
  );

  const title = values.title || '';

  useEffect(() => {
    if (!open) {
      setReady(false);
      setPendingDraft(null);
      setLeaveOpen(false);
      setFormError('');
      return;
    }

    const source = landingRef.current;
    const base = mode === 'duplicate' && source
      ? duplicateLandingForm(source)
      : mode === 'edit' && source
        ? landingToForm(source)
        : emptyLandingForm();

    slugTouchedRef.current = mode !== 'create' || slugify(base.title) !== slugify(base.slug);
    reset(base);
    baselineRef.current = base;
    setTab(0);
    setPreviewOpen(false);
    setFormError('');

    const draft = readDraft(draftStorageKey(mode, source));
    if (draft && stableStringify(draft.values) !== stableStringify(base)) {
      setPendingDraft(draft);
      setReady(false);
    } else {
      setPendingDraft(null);
      setReady(true);
    }
  }, [open, mode, landing?.id, reset]);

  useEffect(() => {
    if (!open || slugTouchedRef.current) return;
    const next = slugify(title);
    if (next === slugify(getValues('slug') || '')) return;
    setValue('slug', next, { shouldDirty: true, shouldValidate: false });
  }, [title, open, getValues, setValue]);

  useEffect(() => {
    if (!open || !ready) return undefined;
    const key = draftStorageKey(mode, landingRef.current);
    const timer = window.setTimeout(() => {
      const current = /** @type {import('../model/types').LandingFormValues} */ (getValues());
      if (stableStringify(current) === stableStringify(baselineRef.current)) {
        clearDraft(key);
        return;
      }
      writeDraft(key, current);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [open, ready, values, mode, getValues]);

  useEffect(() => {
    if (!open || !ready) return undefined;
    const current = /** @type {import('../model/types').LandingFormValues} */ (getValues());
    const dirtyNow = stableStringify(current) !== stableStringify(baselineRef.current);
    if (!dirtyNow) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [open, ready, values, getValues]);

  const dirty = ready && stableStringify(values) !== stableStringify(baselineRef.current);
  const basicInvalid = Boolean(errors.slug || errors.title);

  const requestClose = () => {
    if (submittingRef.current) return;
    if (dirty) {
      setLeaveOpen(true);
      return;
    }
    onClose();
  };

  const applyDraft = (draftValues, lockSlug) => {
    slugTouchedRef.current = lockSlug;
    reset(draftValues);
    setPendingDraft(null);
    setReady(true);
  };

  /**
   * @param {import('../model/types').LandingFormValues} formValues
   */
  const onValid = async (formValues) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setFormError('');

    try {
      const slug = formValues.slug.trim();
      if (isValidSlug(slug)) {
        const params = new URLSearchParams({ slug });
        if (mode === 'edit' && landing?.id) params.set('excludeId', String(landing.id));
        const check = await fetch(`/api/admin/landings/slug-check?${params.toString()}`, {
          credentials: 'include',
        });
        const checkData = await check.json().catch(() => ({}));
        if (!check.ok) {
          setFormError('Не удалось проверить, свободен ли slug. Попробуйте ещё раз.');
          return;
        }
        if (!checkData.available) {
          setError('slug', { type: 'validate', message: 'Этот slug уже занят' });
          setTab(0);
          setFormError('Этот slug уже занят. Измените адрес страницы.');
          focusField('landing-slug');
          return;
        }
      }

      const payload = toApiPayload(formValues);
      const isEdit = mode === 'edit' && landing?.id;
      const response = await fetch(isEdit ? `/api/admin/landings/${landing.id}` : '/api/admin/landings', {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(data.error || 'Не удалось сохранить лендинг');
        return;
      }

      clearDraft(draftStorageKey(mode, landing));
      baselineRef.current = formValues;
      onSaved(isEdit ? 'Лендинг обновлён' : 'Лендинг создан');
      onClose();
    } catch (error) {
      console.error('Error saving landing:', error);
      setFormError('Не удалось сохранить лендинг');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const onInvalid = (fieldErrors) => {
    setTab(0);
    setFormError('Заполните обязательные поля на вкладке «Основное».');
    focusField(fieldErrors.slug ? 'landing-slug' : 'landing-title');
  };

  const heading = mode === 'edit'
    ? 'Редактировать лендинг'
    : mode === 'duplicate'
      ? 'Дублировать лендинг'
      : 'Новый лендинг';

  return (
    <FormProvider {...form}>
      <Dialog
        fullScreen
        open={open}
        onClose={requestClose}
        aria-labelledby="landing-editor-title"
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onValid, onInvalid)}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography id="landing-editor-title" variant="h6">
                {heading}
              </Typography>
              {dirty ? (
                <Typography variant="caption" color="warning.main">
                  Есть несохранённые изменения
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Button
              type="button"
              variant="outlined"
              onClick={() => setPreviewOpen(true)}
              sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
            >
              Предпросмотр
            </Button>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, next) => setTab(next)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Разделы лендинга"
            sx={{ px: { xs: 1, md: 2 }, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
          >
            {TABS.map((item, index) => (
              <Tab
                key={item.id}
                id={`landing-tab-${index}`}
                aria-controls={`landing-tabpanel-${index}`}
                label={(
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.label}
                    {index === 0 && basicInvalid ? (
                      <Box
                        component="span"
                        aria-label="Есть незаполненные обязательные поля"
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }}
                      />
                    ) : null}
                  </Box>
                )}
              />
            ))}
          </Tabs>

          {formError ? (
            <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mt: 2 }} onClose={() => setFormError('')}>
              {formError}
            </Alert>
          ) : null}

          <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, md: 3 }, py: 2 }}>
              <Box role="tabpanel" id="landing-tabpanel-0" aria-labelledby="landing-tab-0" hidden={tab !== 0}>
                <BasicsSection
                  excludeId={mode === 'edit' ? landing?.id ?? null : null}
                  editWarning={mode === 'edit' ? 'Если изменить slug, адрес страницы изменится и старые ссылки перестанут открываться.' : ''}
                  onSlugManualEdit={() => {
                    slugTouchedRef.current = true;
                  }}
                />
              </Box>
              <Box role="tabpanel" id="landing-tabpanel-1" aria-labelledby="landing-tab-1" hidden={tab !== 1}>
                <ImagesSection />
              </Box>
              <Box role="tabpanel" id="landing-tabpanel-2" aria-labelledby="landing-tab-2" hidden={tab !== 2}>
                <ListsSection />
              </Box>
              <Box role="tabpanel" id="landing-tabpanel-3" aria-labelledby="landing-tab-3" hidden={tab !== 3}>
                <ReviewsSection />
              </Box>
              <Box role="tabpanel" id="landing-tabpanel-4" aria-labelledby="landing-tab-4" hidden={tab !== 4}>
                <AppearanceSection />
              </Box>
            </Box>
            <Box
              sx={{
                width: 380,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' },
                overflow: 'auto',
                p: 2,
                borderLeft: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <LandingPreview values={/** @type {import('../model/types').LandingFormValues} */ (values)} />
            </Box>
          </Box>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              flexWrap: 'wrap',
              px: { xs: 2, md: 3 },
              py: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Button type="button" onClick={requestClose} disabled={submitting}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              aria-busy={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {submitting ? 'Сохранение…' : mode === 'edit' ? 'Сохранить' : 'Создать'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Drawer
        anchor="bottom"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        PaperProps={{ sx: { height: '88vh', p: 2, overflow: 'auto' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Предпросмотр</Typography>
          <Button type="button" onClick={() => setPreviewOpen(false)}>
            Закрыть
          </Button>
        </Box>
        <LandingPreview values={/** @type {import('../model/types').LandingFormValues} */ (values)} />
      </Drawer>

      <ConfirmDialog
        open={leaveOpen}
        title="Закрыть форму?"
        description="Есть несохранённые изменения. Черновик останется в этом браузере, но на сайт ничего не попадёт."
        confirmLabel="Закрыть"
        confirmColor="warning"
        onClose={() => setLeaveOpen(false)}
        onConfirm={() => {
          setLeaveOpen(false);
          onClose();
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDraft)}
        title="Восстановить черновик?"
        description="В этом браузере есть несохранённая версия формы. Можно вернуть её или начать с последних сохранённых данных."
        confirmLabel="Восстановить"
        cancelLabel="Начать заново"
        onClose={() => {
          clearDraft(draftStorageKey(mode, landingRef.current));
          setPendingDraft(null);
          setReady(true);
        }}
        onConfirm={() => {
          if (!pendingDraft) return;
          const draftValues = pendingDraft.values;
          const lockSlug = mode !== 'create' || slugify(draftValues.title || '') !== slugify(draftValues.slug || '');
          applyDraft(draftValues, lockSlug);
        }}
      />
    </FormProvider>
  );
}
