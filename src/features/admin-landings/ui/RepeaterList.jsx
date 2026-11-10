'use client';

import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ConfirmDialog from './ConfirmDialog';

/**
 * @param {{
 *   name: string,
 *   addLabel: string,
 *   emptyTitle: string,
 *   emptyDescription: string,
 *   listLabel: string,
 *   collapsible?: boolean,
 *   createItem: () => Record<string, unknown>,
 *   isItemEmpty: (item: Record<string, unknown> | undefined) => boolean,
 *   itemTitle: (item: Record<string, unknown> | undefined, index: number) => string,
 *   itemIcon?: import('react').ReactNode,
 *   presets?: { label: string, value: Record<string, unknown> }[],
 *   renderFields: (index: number) => import('react').ReactNode,
 * }} props
 */
export default function RepeaterList({
  name,
  addLabel,
  emptyTitle,
  emptyDescription,
  listLabel,
  collapsible = true,
  createItem,
  isItemEmpty,
  itemTitle,
  itemIcon = null,
  presets = [],
  renderFields,
}) {
  const { control, getValues } = useFormContext();
  const { fields, append, remove, move, insert } = useFieldArray({ control, name, keyName: 'fieldId' });
  const watched = useWatch({ control, name }) || [];
  const dragFrom = useRef(/** @type {number | null} */ (null));
  const [overIndex, setOverIndex] = useState(/** @type {number | null} */ (null));
  const [openIds, setOpenIds] = useState(/** @type {Record<string, boolean>} */ ({}));
  const [pendingDelete, setPendingDelete] = useState(/** @type {number | null} */ (null));
  const [forceOpenIndex, setForceOpenIndex] = useState(/** @type {number | null} */ (null));

  useEffect(() => {
    if (forceOpenIndex === null) return;
    const field = fields[forceOpenIndex];
    if (!field) return;
    setOpenIds((prev) => ({ ...prev, [field.fieldId]: true }));
    setForceOpenIndex(null);
  }, [fields, forceOpenIndex]);

  const isOpen = (fieldId, index) => {
    if (!collapsible) return true;
    if (Object.prototype.hasOwnProperty.call(openIds, fieldId)) return openIds[fieldId];
    return fields.length <= 3 || index === fields.length - 1;
  };

  /**
   * @param {string} fieldId
   */
  const toggle = (fieldId) => {
    const index = fields.findIndex((field) => field.fieldId === fieldId);
    setOpenIds((prev) => ({ ...prev, [fieldId]: !isOpen(fieldId, index) }));
  };

  const addItem = (value) => {
    setForceOpenIndex(fields.length);
    append(value);
  };

  return (
    <Box>
      {presets.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }} role="group" aria-label="Шаблоны">
          {presets.map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              variant="outlined"
              clickable
              onClick={() => addItem(structuredClone(preset.value))}
            />
          ))}
        </Box>
      )}

      {fields.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 3,
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {emptyTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {emptyDescription}
          </Typography>
          <Button type="button" variant="outlined" startIcon={<AddIcon />} onClick={() => addItem(createItem())}>
            {addLabel}
          </Button>
        </Box>
      ) : (
        <Box component="ul" aria-label={listLabel} sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {fields.map((field, index) => {
            const item = watched[index];
            const opened = isOpen(field.fieldId, index);
            return (
              <Box
                component="li"
                key={field.fieldId}
                onDragOver={(event) => {
                  event.preventDefault();
                  setOverIndex(index);
                }}
                onDragLeave={() => setOverIndex((current) => (current === index ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  const from = dragFrom.current;
                  dragFrom.current = null;
                  setOverIndex(null);
                  if (from === null || from === index) return;
                  move(from, index);
                }}
                sx={{
                  mb: 1,
                  border: 1,
                  borderColor: overIndex === index ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5 }}>
                  <Box
                    component="span"
                    draggable
                    title="Перетащить"
                    aria-label="Перетащить для изменения порядка"
                    onDragStart={(event) => {
                      dragFrom.current = index;
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                    }}
                    onDragEnd={() => {
                      dragFrom.current = null;
                      setOverIndex(null);
                    }}
                    sx={{
                      display: 'inline-flex',
                      cursor: 'grab',
                      color: 'text.secondary',
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    <DragIndicatorIcon fontSize="small" />
                  </Box>
                  {collapsible && (
                    <IconButton
                      type="button"
                      size="small"
                      aria-expanded={opened}
                      aria-label={opened ? 'Свернуть' : 'Развернуть'}
                      onClick={() => toggle(field.fieldId)}
                    >
                      {opened ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  )}
                  {itemIcon}
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }} noWrap>
                    {itemTitle(item, index)}
                  </Typography>
                  <IconButton
                    type="button"
                    size="small"
                    aria-label="Переместить вверх"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    type="button"
                    size="small"
                    aria-label="Переместить вниз"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    type="button"
                    size="small"
                    aria-label="Дублировать"
                    onClick={() => {
                      const current = getValues(`${name}.${index}`);
                      insert(index + 1, structuredClone(current));
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    type="button"
                    size="small"
                    color="error"
                    aria-label="Удалить"
                    onClick={() => {
                      if (isItemEmpty(item)) {
                        remove(index);
                        return;
                      }
                      setPendingDelete(index);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                {opened && <Box sx={{ px: 2, pb: 2 }}>{renderFields(index)}</Box>}
              </Box>
            );
          })}
        </Box>
      )}

      {fields.length > 0 && (
        <Button type="button" variant="outlined" startIcon={<AddIcon />} onClick={() => addItem(createItem())} sx={{ mt: 1 }}>
          {addLabel}
        </Button>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Порядок можно менять перетаскиванием или кнопками «вверх» и «вниз».
      </Typography>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Удалить элемент?"
        description="В карточке есть данные. Удаление нельзя отменить, пока вы не закроете форму без сохранения."
        confirmLabel="Удалить"
        confirmColor="error"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) remove(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
