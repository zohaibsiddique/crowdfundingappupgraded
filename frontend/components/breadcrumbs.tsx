'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const routeMap: Record<string, string> = {
  '/': 'Home',
  '/campaigns': 'Campaigns',
  '/campaigns/create-campaign': 'Create Campaign',
  '/profile': 'Profile',
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const paths = segments.map((_, idx) => '/' + segments.slice(0, idx + 1).join('/'));

  return (
    <nav className="mb-4">
      <ol className="flex items-center text-sm text-muted-foreground">
        {/* Start with Home */}
        <li className="flex items-center">
          <Link href="/" className="hover:text-foreground font-medium transition-colors">Home</Link>
          {paths.length > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
        </li>

        {/* Loop through segments */}
        {paths.map((path, i) => {
          const isLast = i === paths.length - 1;
          const label = routeMap[path] || decodeURIComponent(segments[i]);

          return (
            <li key={path} className="flex items-center">
              <Link
                href={path}
                className={`hover:text-foreground font-medium transition-colors ${isLast ? 'text-foreground font-semibold' : ''}`}
              >
                {label}
              </Link>
              {!isLast && <ChevronRight className="mx-2 h-4 w-4" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;