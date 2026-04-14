import { useCallback } from 'react'
import { createEmptyField, fieldTypeHasOptions, toFieldName } from '../lib/forms.js'

export function useFormDraftEditor(setDraftForm) {
  const setDraftField = useCallback(
    (fieldId, patch) => {
      setDraftForm((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          fields: current.fields.map((field) => {
            if (field.id !== fieldId) {
              return field
            }

            const nextField = { ...field, ...patch }

            if (patch.label !== undefined && !field.name) {
              nextField.name = toFieldName(patch.label)
            }

            if (patch.optionsText !== undefined) {
              nextField.optionsText = patch.optionsText
            }

            if (!fieldTypeHasOptions(nextField.type)) {
              nextField.options = []
              nextField.optionsText = ''
            }

            return nextField
          }),
        }
      })
    },
    [setDraftForm],
  )

  const addField = useCallback(() => {
    setDraftForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        fields: [...current.fields, createEmptyField()],
      }
    })
  }, [setDraftForm])

  const removeField = useCallback(
    (fieldId) => {
      setDraftForm((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          fields: current.fields.filter((field) => field.id !== fieldId),
        }
      })
    },
    [setDraftForm],
  )

  return { setDraftField, addField, removeField }
}
