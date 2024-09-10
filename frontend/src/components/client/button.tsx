'use client';

import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const defaultClassNames = 'rounded-md my-4 p-3 bg-sky-500 shadow-md';

const Button = ({ className, ...props }: ButtonProps) => (
    <button className={`${className} ${defaultClassNames}`} {...props} />
);

export { defaultClassNames };
export default Button;
