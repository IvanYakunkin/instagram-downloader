import { startMediaSniffer } from "./mediaSniffer/mediaSniffer";
import { overridePushState } from "./navigation/pushStateInterceptor";

startMediaSniffer();
overridePushState();