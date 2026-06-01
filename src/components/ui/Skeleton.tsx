import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Base skeleton pulse block used for loading states.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className ?? ""}`}
			{...props}
		/>
	);
}
