interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-us-gray border-b border-us-gray-light py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-us-white uppercase">
          {title}
        </h1>
        <div className="mt-2 h-1 w-16 bg-us-red rounded-full" />
        {subtitle && (
          <p className="mt-4 text-us-white/60 text-base max-w-xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
