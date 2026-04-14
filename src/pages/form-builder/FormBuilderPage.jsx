import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createDefaultForm,
  normalizeForm,
  readForms,
  writeForms,
} from '../../lib/forms.js'
import { useFormDraftEditor } from '../../hooks/useFormDraftEditor.js'
import { Button } from '../../ui/Button.jsx'
import { CommonModal } from '../../ui/CommonModal.jsx'
import { FormEditor } from '../../ui/FormEditor.jsx'
import styles from './FormBuilderPage.module.css'

export function FormBuilderPage() {
  const [savedForms, setSavedForms] = useState(() => readForms())
  const [draftForm, setDraftForm] = useState(() => createDefaultForm())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDraftSaved = savedForms.some((form) => form.id === draftForm.id)
  const { setDraftField, addField, removeField } = useFormDraftEditor(setDraftForm)

  function openNewFormModal() {
    setDraftForm(createDefaultForm())
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function saveForm() {
    const normalizedForm = normalizeForm(draftForm, savedForms.length)
    const nextForms = savedForms.some((form) => form.id === normalizedForm.id)
      ? savedForms.map((form) =>
          form.id === normalizedForm.id ? normalizedForm : form,
        )
      : [...savedForms, normalizedForm]

    setSavedForms(nextForms)
    writeForms(nextForms)
    setDraftForm(normalizedForm)
    setIsModalOpen(false)
  }

  function editForm(formId) {
    const formToEdit = savedForms.find((form) => form.id === formId)

    if (!formToEdit) {
      return
    }

    setDraftForm(normalizeForm(formToEdit, 0))
    setIsModalOpen(true)
  }

  function deleteForm(formId) {
    const nextForms = savedForms.filter((form) => form.id !== formId)

    setSavedForms(nextForms)
    writeForms(nextForms)

    if (draftForm.id === formId) {
      setDraftForm(createDefaultForm())
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.profileCard}>
        <div className={styles.profileHero}>
          <div className={styles.profileIdentity}>
            <div>
              <p className={styles.kicker}>Form Workspace</p>
              <h2 className={styles.profileName}>Dynamic Form Builder</h2>
              <p className={styles.profileNote}>
                Build, edit, and preview reusable forms from one dashboard.
              </p>
            </div>
          </div>

          <Button variant="primary" onClick={openNewFormModal}>
            Create New Form
          </Button>
        </div>
      </div>

      <section className={styles.savedFormsCard}>
        <div className={styles.savedFormsHeader}>
          <div>
            <h3 className={styles.savedFormsHeading}>Saved Forms</h3>
            <p className={styles.subheading}>
              Each saved form keeps its own title and field configuration.
            </p>
          </div>
          <span className={styles.formCount}>
            {savedForms.length} form{savedForms.length === 1 ? '' : 's'}
          </span>
        </div>

        {savedForms.length === 0 ? (
          <div className={styles.emptyState}>
            <h4>No forms created yet</h4>
            <p>Start with the create button and your first form will appear here.</p>
          </div>
        ) : (
          <div className={styles.savedFormsList}>
            {savedForms.map((form) => (
              <article key={form.id} className={styles.savedFormItem}>
                <div className={styles.savedFormBody}>
                  <h4 className={styles.savedFormTitle}>{form.name}</h4>
                  <p className={styles.savedFormMeta}>
                    {form.fields.length} field{form.fields.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className={styles.savedFormActions}>
                  <Button variant="secondary" onClick={() => editForm(form.id)}>
                    Edit
                  </Button>
                  <Button
                    as={Link}
                    to={`/form-preview?formId=${form.id}`}
                    variant="primary"
                  >
                    Preview
                  </Button>
                  <Button variant="danger" onClick={() => deleteForm(form.id)}>
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <CommonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        labelledBy="shared-form-editor-title"
        modalClassName={styles.modal}
      >
        <FormEditor
          draftForm={draftForm}
          title={isDraftSaved ? 'Edit Form' : 'Create Form'}
          onClose={closeModal}
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
