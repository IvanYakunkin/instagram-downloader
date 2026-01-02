import { ILinks } from "../types/global";

export let videoLinks: ILinks[] = [];

export const setVideoLinks = (links: ILinks[]) => {
    videoLinks = links;
}