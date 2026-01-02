import { pageSelectors } from "../selectors/pageSelectors";
import { setDownloadButton } from "../utils/setDownloadButton";

export const usePostPageObserver = (parentTag?: HTMLElement | null) => {
    const localCss = {"padding-left": "10px", "padding-right": "5px"};
    if(parentTag){
        setDownloadButton(parentTag, pageSelectors.post.tools, pageSelectors.post.toolsCss, localCss);
    }
}