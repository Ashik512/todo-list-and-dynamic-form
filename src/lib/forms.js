import { readLocalStorage, writeLocalStorage } from './localStorage.js'

export const FORMS_STORAGE_KEY = 'dynamic-form-forms'

const FIELD_TYPES_WITH_OPTIONS = new Set(['select', 'radio', 'checkbox'])

function parseOptions(value) {
  return value
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean)
}

export function createEmptyField() {
  return {
    id: crypto.randomUUID(),
    label: '',
    name: '',
    type: 'text',
    required: false,
    options: [],
    optionsText: '',
  }
}

export function createDefaultForm() {
  return {
    id: crypto.randomUUID(),
    name: '',
    fields: [
      {
        ...createEmptyField(),
        label: 'Full Name',
        name: 'full_name',
        required: true,
      },
    ],
  }
}

export function toFieldName(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
}

export function normalizeField(field, index) {
  const type = field.type || 'text'
  const optionsText =
    typeof field.optionsText === 'string'
      ? field.optionsText
      : Array.isArray(field.options)
        ? field.options.join(', ')
        : ''
  const options = FIELD_TYPES_WITH_OPTIONS.has(type) ? parseOptions(optionsText) : []

  return {
    id: field.id || crypto.randomUUID(),
    label: field.label || '',
    name: field.name?.trim() || `field_${index + 1}`,
    type,
    required: Boolean(field.required),
    options,
    optionsText: FIELD_TYPES_WITH_OPTIONS.has(type) ? optionsText : '',
  }
}

export function normalizeForm(form, index) {
  const fields = Array.isArray(form?.fields) ? form.fields : []

  return {
    id: form?.id || crypto.randomUUID(),
    name: form?.name?.trim() || `Untitled Form ${index + 1}`,
    fields: fields.map((field, fieldIndex) => normalizeField(field, fieldIndex)),
  }
}

export function readForms() {
  const savedForms = readLocalStorage(FORMS_STORAGE_KEY, [])

  return Array.isArray(savedForms)
    ? savedForms.map((form, index) => normalizeForm(form, index))
    : []
}

export function writeForms(forms) {
  writeLocalStorage(FORMS_STORAGE_KEY, forms.map((form, index) => normalizeForm(form, index)))
}

export function fieldTypeHasOptions(type) {
  return FIELD_TYPES_WITH_OPTIONS.has(type)
}
