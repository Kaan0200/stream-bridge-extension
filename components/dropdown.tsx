import React from 'react';
import { useFloating } from '@floating-ui/react-dom';

export interface DropdownProps {
    children: React.JSX.Element;
}

export default function Dropdown(props: DropdownProps): React.JSX.Element {
    const { refs, floatingStyles } = useFloating({
    });

    return (
        <>
            <div ref={refs.setReference}>
                {props.children}
            </div>
            <div ref={refs.setFloating} style={floatingStyles}>
                <div>
                    TOOLTIP
                </div>
                                <div>
                    TOOLTIP
                </div>
                                <div>
                    TOOLTIP
                </div>
                                <div>
                    TOOLTIP
                </div>
            </div>
        </>
    )
}