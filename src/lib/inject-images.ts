import type { DocImage } from "@/types";

/**
 * Replace [IMG:img_N] placeholders in HTML with <img> tags using base64 data URIs.
 * If an image is not found in the map, renders a visible fallback message.
 */
export function injectImagesIntoHtml(
  html: string,
  images: DocImage[],
): string {
  if (!images || images.length === 0) return html;

  const imageMap = new Map(images.map((img) => [img.id, img]));

  return html.replace(
    /\[IMG:(img_\d+)\]/g,
    (_match, id: string) => {
      const img = imageMap.get(id);
      if (!img) {
        return '<span style="color:#999;font-style:italic;">[Image not available]</span>';
      }

      const maxW = 600;
      const w = img.width ? Math.min(img.width, maxW) : undefined;
      const styleAttr = w
        ? `style="width:${w}px;max-width:100%;height:auto;display:block;margin:0.5rem 0;"`
        : 'style="max-width:100%;height:auto;display:block;margin:0.5rem 0;"';

      return `<img src="${img.base64}" ${styleAttr} alt="Document image" />`;
    },
  );
}
