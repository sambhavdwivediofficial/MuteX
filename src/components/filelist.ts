import type { VideoFile } from "../scripts/types";
import { renderFileItem, updateFileItem, removeFileItem } from "../scripts/ui";

export class FileListComponent {
  private files: Map<string, VideoFile>;

  constructor(files: Map<string, VideoFile>) {
    this.files = files;
  }

  add(file: VideoFile): void {
    this.files.set(file.id, file);
    renderFileItem(file);
  }

  update(file: VideoFile): void {
    this.files.set(file.id, file);
    updateFileItem(file);
  }

  remove(id: string): void {
    this.files.delete(id);
    removeFileItem(id);
  }

  clear(): void {
    this.files.clear();
    const list = document.getElementById("file-list");
    if (list) list.innerHTML = "";
  }

  get size(): number {
    return this.files.size;
  }
}
