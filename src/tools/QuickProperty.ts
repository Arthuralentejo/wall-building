export interface IProperties {
    length?: number;
    angle?: number;
    x?: number;
    y?: number;
}

export class QuickProperty {
    
    private props: IProperties = {};
    private container: HTMLElement | null = document.querySelector('#toolBar');
    private qpCard: HTMLElement | null = null;

    show(props: IProperties) {
        if (document.querySelector('.qck-props-card')) {
            document.querySelector('.qck-props-card')?.remove();
        }
        this.props = props;
        this.qpCard = document.createElement('div');
        this.qpCard.classList.add('qck-props-card');
        Object.keys(this.props).forEach(key => {
            const qpItem = document.createElement('div');
            qpItem.classList.add('qck-prop-item');
            qpItem.id = key;
            qpItem.innerHTML = `<span class="prop">${key}</span> <span class="value">${this.props[key as keyof IProperties]}</span>`;
            this.qpCard?.append(qpItem);
        });
        if(this.container) {
            this.container.append(this.qpCard);
        }
    }

    update(props: IProperties) {
        this.props = props;
        if (this.qpCard) {
            Object.keys(this.props).forEach(key => {
                let qpItem = this.qpCard?.querySelector(`#${key}`);
                let value = qpItem?.querySelector('.value')
                if (value) {
                    value.innerHTML = this.props[key as keyof IProperties]?.toString() || '';
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