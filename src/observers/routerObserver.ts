// Get elements through the observer or one element directly through the selector
export const registerRouterObserver = (callback: (element: HTMLElement | null) => 
    MutationObserver | boolean | void, searchParentElement: HTMLElement | null) => {

    if(!searchParentElement){
        console.log("Extension Error: searchParentElement not found");
        return;
    }

    const clb = callback(searchParentElement);
    if(clb === false) return false;
    if(clb instanceof MutationObserver){
        clb.observe(searchParentElement, {
            subtree: true,
            childList: true,
        });
    }
}