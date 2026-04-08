export function KnifeIcon({
  className,
  title = "Mes",
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M571.4 64c-6.6 0-12 2.8-16 7.6C518 117.4 448 232.2 448 500.2c0 78.4 66 78.4 64 138.8 0 0.2 0 0.6 0 0.8-4 94.2-29.8 222.2-32 260.6-0.8 30.4 19.4 59.6 48.2 59.6 0.2 0 0.2 0 0.4 0 0 0 0.2 0 0.4 0 28.8 0 47-28.8 47-59.2L576 76.6C576 66.6 575 64 571.4 64z"
        fill="currentColor"
      />
    </svg>
  )
}

