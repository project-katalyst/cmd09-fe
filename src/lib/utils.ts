import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a file from a string and triggers a browser download.
 * @param content - The string content for the file.
 * @param filename - The name for the downloaded file.
 * @param mimeType - The MIME type for the file (e.g., 'application/json', 'text/csv').
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string,
) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const href = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
