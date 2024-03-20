export default class CrossHair {

    public visible: boolean = false;
    private readonly element: HTMLDivElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("crosshair");
        this.element.innerText = "+";
        document.body.appendChild(this.element);
    }

    update() {
        this.element.style.opacity = this.visible ? "1" : "0";
    }

}