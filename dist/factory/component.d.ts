import * as react from 'react';

declare class ComponentFactory {
    static create(element: keyof JSX.IntrinsicElements, children?: undefined): react.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}

export { ComponentFactory };
