export interface IProperties {
    length?: number;
    angle?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class QuickProperty {

    private _props: IProperties = {};

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

    show(props: IProperties) {
        if (document.querySelector('.qck-props-card')) {
            document.querySelector('.qck-props-card')?.remove();
        }
        this._props = props;
        this._qpCard = document.createElement('div');
        this._qpCard.classList.add('qck-props-card');
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

            this._qpCard?.append(qpItem);
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