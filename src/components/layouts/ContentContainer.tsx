import type { HTMLAttributes } from "react";

type ContentContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * ContentContainer
 *
 * Thin wrapper that applies the standard max-width and horizontal padding
 * used across all dashboard pages.
 */
export function ContentContainer({
	children,
	className,
	...props
}: ContentContainerProps) {
	return (
		<div
			className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className ?? ""}`}
			{...props}
		>
			{children}
		</div>
	);
}
