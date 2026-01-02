import { BufferInfo } from "../../types/global";

// Fetch <resource> parameter can be a string or a Url or a Request
export const extractUrl = (input: RequestInfo | URL): string | null => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return null;
}

// Remove the last two parameters from the URL - bytestart and byteend 
// to get a link to the full video|audio
export const removeBytes = (url: string): string => {
  const u = new URL(url, location.origin);
  u.searchParams.delete('bytestart');
  u.searchParams.delete('byteend');

  return u.origin + u.pathname + (u.search ? u.search : '');
}

export const findUrlByBuffer = (buffers: BufferInfo[], targetBuffer: Uint8Array): string | undefined => {
  return buffers.find(item => {
    if (item.buffer.byteLength !== targetBuffer.byteLength) {
      return false;
    }
    const itemView = new Uint8Array(item.buffer);
    for (let i = 0; i < itemView.length; i++) {
      if (itemView[i] !== targetBuffer[i]) {
        return false;
      }
    }
    return true;
  })?.realUrl;
}