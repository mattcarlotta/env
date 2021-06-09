import { join } from "path";

/**
 * A utility function to join a directory with a filename to a single string.
 *
 * @param file - filename
 * @param dir - directory of the file
 * @returns a single file path string
 */
export default function getFilePath(file: string, dir?: string): string {
  return join(dir || process.cwd(), file);
}
