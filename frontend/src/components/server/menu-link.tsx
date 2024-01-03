import type { ReactNode } from 'react';
import Link, { type LinkProps } from 'next/link';

type MenuLinkProps = LinkProps & {
    className?: string;
    children: ReactNode;
};

const MenuLink = ({ className, children, ...props }: MenuLinkProps) => (
    <Link className={`text-center p-2 m-2 bg-sky-300 shadow-sm rounded-md ${className ?? ''}`} {...props}>
        {children}
    </Link>
);

export default MenuLink;
