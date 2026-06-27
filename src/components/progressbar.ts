export function setProgress(
  fillEl: HTMLElement,
  value: number,
  state: "default" | "success" | "error" | "indeterminate" = "default"
): void {
  fillEl.classList.remove(
    "progress-bar__fill--success",
    "progress-bar__fill--error",
    "progress-bar__fill--indeterminate"
  );

  if (state === "indeterminate") {
    fillEl.classList.add("progress-bar__fill--indeterminate");
    return;
  }

  fillEl.style.width = `${Math.min(100, Math.max(0, value * 100))}%`;

  if (state === "success") fillEl.classList.add("progress-bar__fill--success");
  if (state === "error") fillEl.classList.add("progress-bar__fill--error");
}
