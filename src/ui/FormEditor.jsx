import { FIELD_TYPES } from '../constants/fieldTypes.js'
import { fieldTypeHasOptions } from '../lib/forms.js'
import { Button } from './Button.jsx'
import styles from './FormEditor.module.css'

export function FormEditor({
  draftForm,
  title,
  onClose,
  onSave,
  onNameChange,
  onAddField,
  onRemoveField,
  onFieldPatch,
}) {
  if (!draftForm) {
    return null
  }

  return (
    <>
      <div className={styles.modalHeader}>
        <div>
          <p className={styles.kicker}>Dynamic Form</p>
          <h3 className={styles.modalTitle} id="shared-form-editor-title">
            {title}
          </h3>
        </div>

        <Button variant="icon" iconOnly onClick={onClose} aria-label="Close modal">
          ×
        </Button>
      </div>

      <div className={styles.modalBody}>
        <section className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <div>
              <p className={styles.fieldOrder}>Form Details</p>
              <h4 className={styles.editorTitle}>
                {draftForm.name.trim() || 'Untitled form'}
              </h4>
            </div>

            <Button variant="secondary" onClick={onAddField}>
              Add Field
            </Button>
          </div>

          <label className={styles.inputGroup}>
            <span>Form Name</span>
            <input
              type="text"
              value={draftForm.name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. Contact Form"
            />
          </label>

          <div className={styles.fieldStack}>
            {draftForm.fields.map((field, index) => (
              <article key={field.id} className={styles.fieldCard}>
                <div className={styles.fieldCardHeader}>
                  <div>
                    <p className={styles.fieldOrder}>Field {index + 1}</p>
                    <h4 className={styles.fieldTitle}>
                      {field.label || 'Untitled field'}
                    </h4>
                  </div>

                  <Button
                    variant="danger"
                    onClick={() => onRemoveField(field.id)}
                    disabled={draftForm.fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.inputGroup}>
                    <span>Label</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(event) =>
                        onFieldPatch(field.id, { label: event.target.value })
                      }
                      placeholder="e.g. Status"
                    />
                  </label>

                  <label className={styles.inputGroup}>
                    <span>Name</span>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(event) =>
                        onFieldPatch(field.id, { name: event.target.value })
                      }
                      placeholder="e.g. status"
                    />
                  </label>

                  <label className={styles.inputGroup}>
                    <span>Input Type</span>
                    <select
                      value={field.type}
                      onChange={(event) =>
                        onFieldPatch(field.id, { type: event.target.value })
                      }
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(event) =>
                        onFieldPatch(field.id, { required: event.target.checked })
                      }
                    />
                    <span>Required</span>
                  </label>
                </div>

                {fieldTypeHasOptions(field.type) && (
                  <label className={styles.inputGroup}>
                    <span>Options</span>
                    <textarea
                      rows="3"
                      value={field.optionsText}
                      onChange={(event) =>
                        onFieldPatch(field.id, { optionsText: event.target.value })
                      }
                      placeholder="Comma-separated values"
                    />
                  </label>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.modalFooter}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Form
        </Button>
      </div>
    </>
  )
}
