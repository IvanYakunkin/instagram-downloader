import { pageSelectors } from "../selectors/pageSelectors";
import { setDownloadButton } from "../utils/setDownloadButton";

export const useMainPageObserver = (parentTag?: HTMLElement | null) => {
    const buttonCss = {"padding-left": "10px"};
    // Load initial posts
    const mainTag = parentTag?.lastElementChild;
    const articles = mainTag?.querySelectorAll("article");
    if(articles){
        for(const article of Array.from(articles)){
            setDownloadButton(article, pageSelectors.main.tools, pageSelectors.main.toolsCss, buttonCss);
        }
    }

    return new MutationObserver((mutation) => {     
        for(let i = 0; i < mutation.length; i++){
            const addedElements = mutation[i].addedNodes;
            if(addedElements.length){
                if(addedElements[0].nodeName === "ARTICLE"){
                    const article = addedElements[0] as HTMLElement;
                    setDownloadButton(article, pageSelectors.main.tools, pageSelectors.main.toolsCss, buttonCss);
                }
            }
        }
    });
}