import { registerRouterObserver } from "../observers/routerObserver";
import { IRouter } from "../types/global";

export const findCurrentRoute = (router: IRouter[]) => {
    const segments = window.location.pathname.split('/').filter(segment => segment !== '');
    if(segments.length === 0) segments[0] = "";
    const currentRouter = router.find(route => route.path === segments[0]);

    return currentRouter;
}

export const useRouterObserver = (currentRouter: IRouter) => {
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const searchParentElement: HTMLElement | null = document.querySelector(currentRouter.targetSelector);
                if(searchParentElement){
                    observer.disconnect();
                    registerRouterObserver(() => currentRouter.callback(searchParentElement), searchParentElement);                    
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}