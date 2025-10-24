import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a JSON file from data and triggers a browser download.
 * @param data - The data to be stringified and downloaded.
 * @param filename - The name for the downloaded file.
 */
export const downloadJsonAsFile = (data: unknown, filename: string) => {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
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
    console.error('Error downloading JSON file:', error);
  }
};
