import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gray-900 text-white hover:bg-gray-700",
  secondary: "bg-white text-gray-900 hover:bg-gray-100",
  outline:
    "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-5",
  md: "h-11 px-6",
  lg: "h-12 px-6",
};

const base =
  "inline-flex items-center justify-center font-bold text-sm uppercase tracking-wide transition-colors";

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = SharedProps & {
  href: string;
} & Omit<React.ComponentProps<typeof Link>, keyof SharedProps | "href">;

type ButtonAsButton = SharedProps & {
  href?: undefined;
} & Omit<React.ComponentProps<"button">, keyof SharedProps>;

type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    const {href, ...rest} = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${classes} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...(props as React.ComponentProps<"button">)}
    >
      {children}
    </button>
  );
}
