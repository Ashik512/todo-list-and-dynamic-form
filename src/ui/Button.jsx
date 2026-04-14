import styles from './Button.module.css'

function joinClasses(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

export function Button({
  as: Component = 'button',
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  className,
  type,
  children,
  ...props
}) {
  const buttonClassName = joinClasses(
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    className,
  )

  if (Component === 'button') {
    return (
      <button type={type ?? 'button'} className={buttonClassName} {...props}>
        {children}
      </button>
    )
  }

  return (
    <Component className={buttonClassName} {...props}>
      {children}
    </Component>
  )
}
