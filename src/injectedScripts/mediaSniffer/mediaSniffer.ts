import { overrideFetch } from "./fetchInterceptor";
import { overrideMediaSource } from "./mediaSourceInterceptor";
import { overrideCreateObjectUrl } from "./urlInterceptor";

export function startMediaSniffer() {
  overrideFetch();
  overrideMediaSource();
  overrideCreateObjectUrl();
}