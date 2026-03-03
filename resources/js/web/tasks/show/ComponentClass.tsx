import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface ComponentClassProps
{
    
}


interface ComponentClassState
{
    
}

export default class ComponentClass extends React.Component<ComponentClassProps, ComponentClassState>
{

    constructor(props: ComponentClassProps)
    {
        super(props)
        this.state = {

        }
    }

    render()
    {
        return (
            <div className="component">
            {/* Reusable Component ... copy this model */}
            </div>
        )
    }
}