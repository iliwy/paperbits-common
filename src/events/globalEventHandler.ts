import { IEventManager } from '../events/IEventManager';
import { Keys } from '../core/keys';

export class GlobalEventHandler {
    private readonly eventManager: IEventManager;
    private readonly documents: Document[]

    constructor(eventManager: IEventManager) {
        this.eventManager = eventManager;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onCtrlS = this.onCtrlS.bind(this);
        this.onEscape = this.onEscape.bind(this);

        this.addDragStartListener = this.addDragStartListener.bind(this);
        this.addDragEnterListener = this.addDragEnterListener.bind(this);
        this.addDragDropListener = this.addDragDropListener.bind(this);
        this.addDragEndListener = this.addDragEndListener.bind(this);
        this.addDragLeaveListener = this.addDragLeaveListener.bind(this);
        this.addDragLeaveScreenListener = this.addDragLeaveScreenListener.bind(this);

        this.documents = [];
    }

    public appendDocument(doc: Document): void {
        if (this.documents.indexOf(doc) > -1) {
            return;
        }

        this.documents.push(doc);

        doc.addEventListener("keydown", this.onKeyDown);
        doc.addEventListener("dragenter", this.onDragEnter.bind(this), true);
        doc.addEventListener("dragstart", this.onDragStart.bind(this), true);
        doc.addEventListener("dragover", this.onDragOver.bind(this), true);
        doc.addEventListener("dragleave", this.onDragLeave.bind(this));
        doc.addEventListener("drop", this.onDragDrop.bind(this), true);
        doc.addEventListener("dragend", this.onDragEnd.bind(this), true);
        doc.addEventListener("paste", this.onPaste.bind(this), true);
        doc.addEventListener("pointermove", this.onPointerMove.bind(this), true);
        doc.addEventListener("pointerdown", this.onPointerDown.bind(this), true);
        doc.addEventListener("pointerup", this.onPointerUp.bind(this), true);
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.keyCode === Keys.S) {
            event.preventDefault();
            this.onCtrlS();
        }

        if (event.ctrlKey && event.keyCode === Keys.P) {
            event.preventDefault();
            this.onCtrlP();
        }

        if (event.keyCode === Keys.Esc) {
            event.preventDefault();
            this.onEscape();
        }
    }

    private onCtrlS(): void {
        this.eventManager.dispatchEvent("onSaveChanges");
    }

    private onCtrlP(): void {
        this.eventManager.dispatchEvent("onPublish");
    }

    private onEscape(): void {
        this.eventManager.dispatchEvent("onEscape");
    }

    private onPointerMove(event: PointerEvent): void {
        this.eventManager.dispatchEvent("onPointerMove", event);
    }

    private onPointerDown(event: PointerEvent): void {
        this.eventManager.dispatchEvent("onPointerDown", event);
    }

    private onPointerUp(event: PointerEvent): void {
        this.eventManager.dispatchEvent("onPointerUp", event);
    }

    private onDragStart(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragStart");
    }

    private onDragEnter(event: DragEvent): void {
        // event.dataTransfer.types ARE available here!

        this.eventManager.dispatchEvent("onDragEnter");
        event.preventDefault();
    }

    private onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.eventManager.dispatchEvent("onDragOver");
    }

    private onDragLeave(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragLeave");

        if (event.screenX === 0 && event.screenY === 0) {
            this.eventManager.dispatchEvent("onDragLeaveScreen");
        }
    }

    private onDragDrop(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragDrop", event);

        event.preventDefault();
    }

    private onDragEnd(): void {
        this.eventManager.dispatchEvent("onDragEnd");
    }

    private onPaste(event: ClipboardEvent): void {
        this.eventManager.dispatchEvent("onPaste", event);
    }

    public addDragStartListener(callback): void {
        this.eventManager.addEventListener("onDragStart", callback);
    }

    public addDragEnterListener(callback): void {
        this.eventManager.addEventListener("onDragEnter", callback);
    }

    public addDragOverListener(callback): void {
        this.eventManager.addEventListener("onDragOver", callback);
    }

    public addDragLeaveListener(callback): void {
        this.eventManager.addEventListener("onDragLeave", callback);
    }

    public addDragLeaveScreenListener(callback): void {
        this.eventManager.addEventListener("onDragLeaveScreen", callback);
    }

    public addDragDropListener(callback): void {
        this.eventManager.addEventListener("onDragDrop", callback);
    }

    public addDragEndListener(callback): void {
        this.eventManager.addEventListener("onDragEnd", callback);
    }

    public addPasteListener(callback): void {
        this.eventManager.addEventListener("onPaste", callback);
    }

    public addPointerMoveEventListener(callback): void {
        this.eventManager.addEventListener("onPointerMove", callback);
    }
}