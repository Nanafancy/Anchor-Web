"use client";

import { Check, Copy, Eye, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface APIKeyModalProps {
	isOpen: boolean;
	onClose: () => void;
	/** Called with the generated key so the parent can add it to the keys list */
	onKeyCreated?: (key: { name: string; value: string }) => void;
}

type Step = "form" | "reveal";

function generateApiKey(): string {
	const rand = () => Math.random().toString(36).substring(2, 15);
	return `mux_live_${rand()}${rand()}`;
}

export default function APIKeyModal({
	isOpen,
	onClose,
	onKeyCreated,
}: APIKeyModalProps) {
	const [step, setStep] = useState<Step>("form");
	const [keyName, setKeyName] = useState("");
	const [nameError, setNameError] = useState("");
	const [generatedKey, setGeneratedKey] = useState<string | null>(null);
	const [acknowledged, setAcknowledged] = useState(false);
	const { copy, copied } = useCopyToClipboard();

	const reset = () => {
		setStep("form");
		setKeyName("");
		setNameError("");
		setGeneratedKey(null);
		setAcknowledged(false);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleGenerate = () => {
		if (!keyName.trim()) {
			setNameError("Key name is required.");
			return;
		}
		const newKey = generateApiKey();
		setGeneratedKey(newKey);
		setStep("reveal");
		onKeyCreated?.({ name: keyName.trim(), value: newKey });
	};

	const handleDone = () => {
		reset();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="api-key-modal-title"
		>
			<div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 mx-4">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
					<h2
						id="api-key-modal-title"
						className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
					>
						{step === "form" ? "Create API Key" : "Save your API key"}
					</h2>
					<button
						type="button"
						onClick={handleClose}
						aria-label="Close dialog"
						className="rounded-md p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
					>
						<X className="size-5" />
					</button>
				</div>

				{/* Body */}
				<div className="px-6 py-5 space-y-5">
					{step === "form" && (
						<>
							<p className="text-sm text-zinc-500 dark:text-zinc-400">
								Give your key a descriptive name so you can identify it later.
							</p>
							<div className="space-y-1.5">
								<label
									htmlFor="key-name"
									className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									Key name
								</label>
								<input
									id="key-name"
									type="text"
									value={keyName}
									onChange={(e) => {
										setKeyName(e.target.value);
										if (nameError) setNameError("");
									}}
									placeholder="e.g. Production backend"
									aria-describedby={nameError ? "key-name-error" : undefined}
									aria-invalid={!!nameError}
									className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
								/>
								{nameError && (
									<p
										id="key-name-error"
										role="alert"
										className="text-xs text-red-600 dark:text-red-400"
									>
										{nameError}
									</p>
								)}
							</div>
						</>
					)}

					{step === "reveal" && generatedKey && (
						<>
							{/* One-time warning banner */}
							<div
								role="alert"
								className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
							>
								<Eye className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
								<div>
									<p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
										This key will only be shown once
									</p>
									<p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
										Copy it now and store it somewhere safe. You won't be able
										to view it again after closing this dialog.
									</p>
								</div>
							</div>

							{/* Key display */}
							<div className="space-y-1.5">
								<label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
									Your new API key
								</label>
								<div className="flex items-center gap-2">
									<code
										data-testid="generated-key"
										className="flex-1 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-900 dark:text-zinc-50 select-all"
									>
										{generatedKey}
									</code>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => copy(generatedKey)}
										aria-label={copied ? "Copied!" : "Copy API key"}
										data-testid="copy-generated-key"
									>
										{copied ? (
											<Check className="size-4 text-green-500" />
										) : (
											<Copy className="size-4" />
										)}
									</Button>
								</div>
								{copied && (
									<span role="status" aria-live="polite" className="sr-only">
										API key copied to clipboard
									</span>
								)}
							</div>

							{/* Acknowledgement checkbox */}
							<label className="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={acknowledged}
									onChange={(e) => setAcknowledged(e.target.checked)}
									data-testid="acknowledge-checkbox"
									className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600"
								/>
								<span className="text-sm text-zinc-600 dark:text-zinc-400">
									I have copied and stored my API key in a safe place.
								</span>
							</label>
						</>
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
					{step === "form" && (
						<>
							<Button variant="outline" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								onClick={handleGenerate}
								data-testid="generate-key-btn"
							>
								Generate key
							</Button>
						</>
					)}
					{step === "reveal" && (
						<Button
							onClick={handleDone}
							disabled={!acknowledged}
							data-testid="done-btn"
						>
							Done — I've saved my key
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
