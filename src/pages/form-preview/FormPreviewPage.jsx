import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFormDraftEditor } from '../../hooks/useFormDraftEditor.js'
import { normalizeForm, readForms, writeForms } from '../../lib/forms.js'
import { Button } from '../../ui/Button.jsx'
import { CommonModal } from '../../ui/CommonModal.jsx'
import { FormEditor } from '../../ui/FormEditor.jsx'
import styles from './FormPreviewPage.module.css'

function createInitialValues(fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = ''
    return accumulator
  }, {})
}

export function FormPreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [forms, setForms] = useState(() => readForms())
  const [draftForm, setDraftForm] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const selectedFormId = searchParams.get('formId')
  const selectedForm =
    forms.find((form) => form.id === selectedFormId) || forms[0] || null
  const [valuesByFormId, setValuesByFormId] = useState({})
  const { setDraftField, addField, removeField } = useFormDraftEditor(setDraftForm)
  const selectedValues =
    selectedForm && valuesByFormId[selectedForm.id]
      ? valuesByFormId[selectedForm.id]
      : createInitialValues(selectedForm?.fields || [])

  function updateValue(name, value) {
    if (!selectedForm) {
      return
    }

    setValuesByFormId((current) => ({
      ...current,
      [selectedForm.id]: {
        ...(current[selectedForm.id] || createInitialValues(selectedForm.fields)),
        [name]: value,
      },
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log('Submitted form values:', selectedValues)
  }

  function openEditModal() {
    if (!selectedForm) {
      return
    }

    setDraftForm(normalizeForm(selectedForm, 0))
    setIsEditModalOpen(true)
  }

  function closeEditModal() {
    setIsEditModalOpen(false)
    setDraftForm(null)
  }

  function saveForm() {
    if (!draftForm) {
      return
    }

    const normalizedForm = normalizeForm(draftForm, 0)
    const nextForms = forms.map((form, index) =>
      form.id === normalizedForm.id ? normalizedForm : normalizeForm(form, index),
    )

    setForms(nextForms)
    writeForms(nextForms)
    setValuesByFormId((current) => ({
      ...current,
      [normalizedForm.id]: createInitialValues(normalizedForm.fields),
    }))
    closeEditModal()
  }

  if (!selectedForm) {
    return (
      <section className={styles.emptyState}>
        <h2>No saved form found</h2>
        <p>Create and save a form in the builder before previewing it here.</p>
        <Button as={Link} to="/form-builder" variant="brand">
          Go to Form Builder
        </Button>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerCard}>
        <div>
          <h2 className={styles.heading}>{selectedForm.name}</h2>
          <p className={styles.subheading}>
            Submit prints the entered values to the browser console.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="brand" onClick={openEditModal}>
            Edit Form
          </Button>
          {forms.length > 1 && (
            <select
              className={styles.formSwitcher}
              value={selectedForm.id}
              onChange={(event) => {
                setSearchParams({ formId: event.target.value })
              }}
            >
              {forms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <form
        key={selectedForm.id}
        className={styles.formCard}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGrid}>
          {selectedForm.fields.map((field) => (
            <div key={field.id} className={styles.inputGroup}>
              <span>
                {field.label || field.name}
                {field.required ? (
                  <>
                    {' '}
                    <span className={styles.requiredMark}>*</span>
                  </>
                ) : (
                  ''
                )}
              </span>

              {field.type === 'textarea' ? (
                <textarea
                  rows="4"
                  required={field.required}
                  value={selectedValues[field.name] ?? ''}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={selectedValues[field.name] ?? ''}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'radio' ? (
                <div className={styles.radioGroup}>
                  {field.options.map((option) => (
                    <label key={option} className={styles.radioOption}>
                      <input
                        type="radio"
                        name={field.name}
                        required={field.required}
                        value={option}
                        checked={selectedValues[field.name] === option}
                        onChange={(event) =>
                          updateValue(field.name, event.target.value)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className={styles.checkboxOptionGroup}>
                  {field.options.map((option) => {
                    const currentValues = (selectedValues[field.name] || '')
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean)
                    const isChecked = currentValues.includes(option)

                    return (
                      <label key={option} className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option}
                          checked={isChecked}
                          onChange={() => {
                            const next = isChecked
                              ? currentValues.filter((v) => v !== option)
                              : [...currentValues, option]
                            updateValue(field.name, next.join(', '))
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  value={selectedValues[field.name] ?? ''}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <Button type="submit" variant="brand">
          Submit Form
        </Button>
      </form>

      <CommonModal
        isOpen={isEditModalOpen && Boolean(draftForm)}
        onClose={closeEditModal}
        labelledBy="shared-form-editor-title"
        modalClassName={styles.modal}
      >
        <FormEditor
          draftForm={draftForm}
          title="Edit Form"
          onClose={closeEditModal}
          onSave={saveForm}
          onAddField={addField}
          onRemoveField={removeField}
          onFieldPatch={setDraftField}
          onNameChange={(value) =>
            setDraftForm((current) => ({
              ...current,
              name: value,
            }))
          }
        />
      </CommonModal>
    </section>
  )
}
