export function createDropzone(onFiles: (paths: string[]) => void): HTMLElement {
  const el = document.getElementById("dropzone")!;

  el.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    el.classList.add("dropzone--active");
  });

  el.addEventListener("dragleave", (e: DragEvent) => {
    if (!el.contains(e.relatedTarget as Node)) {
      el.classList.remove("dropzone--active");
    }
  });

  el.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    el.classList.remove("dropzone--active");
    const paths = Array.from(e.dataTransfer?.files ?? []).map((f) => f.path);
    if (paths.length > 0) onFiles(paths);
  });

  return el;
}
