import ResizerImport from 'react-image-file-resizer';

type ResizerApi = typeof ResizerImport;

const isResizer = (value: unknown): value is ResizerApi =>
    typeof (value as { imageFileResizer?: unknown } | null | undefined)?.imageFileResizer === 'function';

/**
 * The resizer object, whichever shape the bundler gave the default import.
 *
 * react-image-file-resizer is a CommonJS package that exports `{ default: { imageFileResizer } }`. Some bundlers hand
 * the default import over as the inner object, and Vite 8's production build hands over the whole export, so
 * `Resizer.imageFileResizer` was undefined and cropping a photo failed with "imageFileResizer is not a function".
 * Both shapes are accepted here.
 */
export function pickResizer(imported: unknown): ResizerApi {
    if (isResizer(imported)) return imported;
    const inner = (imported as { default?: unknown } | null | undefined)?.default;
    if (isResizer(inner)) return inner;
    throw new Error('The image resizer could not be loaded');
}

/** Looked up when a photo is resized (not when the app starts), so a problem here fails one action and not the whole page. */
export const resizer = (): ResizerApi => pickResizer(ResizerImport);
