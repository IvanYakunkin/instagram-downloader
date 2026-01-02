export let progressPanelTag: HTMLElement | null = null;

export const injectProgressContainer = () => {
    const template = document.createElement("div") as HTMLElement;
    template.id="progressPanel";
    template.className="progress-panel";

    template.innerHTML = `
        <button class="close-btn" id="closeProgressBtn" title="Закрыть">&times;</button>
        <div id="progress-bars" class="progress-bars"></div>`;

    document.body.appendChild(template);

    progressPanelTag = template;

    const closeBtn = document.getElementById("closeProgressBtn");
    if(closeBtn){
        closeBtn.addEventListener("click", () => {
            const progressBars = document.getElementById("progress-bars");
            if(progressBars){
                progressBars.innerHTML = "";
            }

            template.style.visibility = "hidden";
        });        
    }
}

export const addProgressBar = (filename: string) => {
    if(progressPanelTag) progressPanelTag.style.visibility = "visible";
    const progressBars = document.getElementById("progress-bars");
    if(!progressBars) return;

    const uniqueId = 'id-' + Date.now();
    const progressContainer = document.createElement("div");
    
    progressContainer.className = "progress-container";
    progressContainer.id = uniqueId;
    progressContainer.innerHTML = `
            <div class="progress-title">${filename}</div>
            <div class="progress-bar">
                <div class="progress-percent" id="progressPercent">0%</div>
                <div class="progress-fill" id="progressFill"></div>
            </div>`;      

    progressBars.appendChild(progressContainer);

    return uniqueId;
}