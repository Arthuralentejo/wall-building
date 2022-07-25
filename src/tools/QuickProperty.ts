export interface IProperties {
    length?: number;
    angle?: number;
    x?: number;
    y?: number;
}

export class QuickProperty {

    private props: IProperties = {};
    private toolBar: HTMLElement | null = document.querySelector('#toolBar');
    private qpCard: HTMLElement | null = null;

    show(props: IProperties) {
        if (document.querySelector('.qck-props-card')) {
            document.querySelector('.qck-props-card')?.remove();
        }
        this.props = props;
        this.qpCard = document.createElement('div');
        this.qpCard.classList.add('qck-props-card');
        Object.keys(this.props).forEach(key => {
            
            const prop = document.createElement('span');
            prop.classList.add('prop');
            prop.innerText = key;
            
            const value = document.createElement('input');
            value.classList.add('value');
            value.type = 'number';
            value.value = this.props[key as keyof IProperties]?.toString() || '';
            
            const qpItem = document.createElement('div');
            qpItem.classList.add('qck-prop-item');
            qpItem.id = key;
            qpItem.appendChild(prop);
            qpItem.appendChild(value);

            this.qpCard?.append(qpItem);
        });
        if (this.toolBar) {
            this.toolBar.append(this.qpCard);
        }
    }

    update(props: IProperties) {
        this.props = props;
        if (this.qpCard) {
            Object.keys(this.props).forEach(key => {
                let qpItem = this.qpCard?.querySelector(`#${key}`);
                let value = qpItem?.querySelector('.value') as HTMLInputElement;
                if (value) {
                    value.value = this.props[key as keyof IProperties]?.toString() || '';
                }
            });
        }
    }

    hide() {
        if (this.qpCard) {
            this.qpCard.remove();
        }
    }


}