// Overrides the pushState method to enable tracking of navigation events via a custom 'pushstate' event
export const overridePushState = () => {
    const pushState = history.pushState;
    
    history.pushState = function(...args) {
        const result = pushState.apply(this, args);
        const event = new Event('pushstate');
        window.dispatchEvent(event);
        
        return result;
    };
}