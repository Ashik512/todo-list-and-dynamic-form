import { createPortal } from 'react-dom'
import styles from './CommonModal.module.css'

function joinClasses(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

export function CommonModal({
  isOpen,
  onClose,
  labelledBy,
  children,
  overlayClassName,
  modalClassName,
}) {
  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className={joinClasses(styles.overlay, overlayClassName)}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={joinClasses(styles.modal, modalClassName)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
