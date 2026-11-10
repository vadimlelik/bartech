import Link from 'next/link';
import { PRIORITY_CATEGORY_LINKS } from '@/shared/config/priority-categories';

export default function PriorityCategoryLinks({ listClassName, linkClassName }) {
  return (
    <ul className={listClassName}>
      {PRIORITY_CATEGORY_LINKS.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={linkClassName}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
