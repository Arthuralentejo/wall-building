export interface IProperties {
    length?: number;
    angle?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class QuickProperty {

    private _props: IProperties = {};
    private _position : { x: Number, y: Number } | null = null;
    private _toolBar: HTMLElement | null = document.querySelector('#toolBar');
    private _qpCard: HTMLElement | null = null;

    public get props(): IProperties {
        return this._props;
    }

    public set props(value: IProperties) {
        this._props = value;
    }

    public get toolBar(): HTMLElement | null {
        return this._toolBar;
    }

    public get qpCard(): HTMLElement | null {
        return this._qpCard;
    }

    private _drag(e: MouseEvent) {
        if (this._qpCard && this._qpCard?.classList.contains('dragging')) {
            const dragbtnPos = this._qpCard.querySelector('.drag')?.getBoundingClientRect();
            const cardPos = this._qpCard.getBoundingClientRect();
            if (dragbtnPos) {
                const diffX = cardPos.x - (dragbtnPos.x + dragbtnPos.width * .5);
                const diffY = cardPos.y - (dragbtnPos.y + dragbtnPos.height * .5);
                const newPos = { x: e.clientX + diffX, y: e.clientY + diffY };
                this._qpCard.style.left = newPos.x + 'px';
                this._qpCard.style.top = newPos.y + 'px';
                this._position = newPos;
            }

        }
    }
    private _mouseUp() {
        if (this._qpCard) {
            this._qpCard.classList.remove('dragging');
            document.removeEventListener('mousemove', this._drag);
            document.removeEventListener('mouseup', this._mouseUp);
        }
    }

    show(props: IProperties) {
        if (document.querySelector('.qck-props-card')) {
            document.querySelector('.qck-props-card')?.remove();
        }
        this._props = props;
        this._qpCard = document.createElement('div');
        this._qpCard.classList.add('qck-props-card', 'draggable');
        if(this._position) {
            this._qpCard.style.left = this._position.x + 'px';
            this._qpCard.style.top = this._position.y + 'px';
        }
        const controls = document.createElement('div');
        controls.classList.add('controls');
        this._qpCard.appendChild(controls);

        const closebtn = document.createElement('button');
        closebtn.classList.add('close', 'bi', 'bi-eye-slash-fill');
        closebtn.setAttribute('data-toggle', 'collapse');
        closebtn.setAttribute('data-target', '#props');
        closebtn.setAttribute('aria-expanded', 'false');
        closebtn.setAttribute('aria-controls', 'props');
        controls.appendChild(closebtn);

        const dragbtn = document.createElement('button');
        dragbtn.classList.add('drag', 'bi', 'bi-arrows-move');
        controls.appendChild(dragbtn);
        dragbtn.addEventListener('mousedown', () => {
            if (this._qpCard) {
                this._qpCard.classList.add('dragging');
                document.addEventListener('mousemove', this._drag.bind(this));
                document.addEventListener('mouseup', this._mouseUp.bind(this));
            }
        });
        const propsEl = document.createElement('div');
        closebtn.addEventListener('click', (e) => {            
            propsEl.classList.toggle('collapse');
            let btn = e.target as HTMLElement;
            if( propsEl.classList.contains('collapse')) {
                btn.classList.remove('bi-eye-slash-fill');
                btn.classList.add('bi-eye-fill');
            }else {
                btn.classList.remove('bi-eye-fill');
                btn.classList.add('bi-eye-slash-fill');
            }
        });
        propsEl.id = 'props';
        this._qpCard.appendChild(propsEl);
        Object.keys(this._props).forEach(key => {
            const prop = document.createElement('span');
            prop.classList.add('prop');
            prop.innerText = key + ':';

            const value = document.createElement('input');
            value.classList.add('value');
            value.type = 'number';
            value.name = key;
            value.value = this._props[key as keyof IProperties]?.toString() || '';

            const qpItem = document.createElement('div');
            qpItem.classList.add('qck-prop-item');
            qpItem.id = key;
            qpItem.appendChild(prop);
            qpItem.appendChild(value);

            propsEl.append(qpItem);
        });


        if (this._toolBar) {
            this._toolBar.append(this._qpCard);
        }
    }

    update(props: IProperties) {
        this._props = props;
        if (this._qpCard) {
            Object.keys(this._props).forEach(key => {
                let qpItem = this._qpCard?.querySelector(`#${key}`);
                let value = qpItem?.querySelector('.value') as HTMLInputElement;
                if (value) {
                    value.value = this._props[key as keyof IProperties]?.toString() || '';
                }
            });
        }
    }

    hide() {
        if (this._qpCard) {
            this._qpCard.remove();
        }
    }


}