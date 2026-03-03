import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";


interface DialogDeleteProps
{
    
}


interface DialogDeleteState
{
    isSelected: boolean
}

export default class DialogDelete extends React.Component<any, DialogDeleteState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {
            isSelected: false,
        }
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    render()
    {
        return (
            <div className={ "dialog-delete" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <img src="https://cdn.dribbble.com/users/1392449/screenshots/17662830/media/0469c6e6dc9f96a2ac4266499f9723ee.png?compress=1&resize=1600x1200&vertical=top" alt="" />
                    <div className="text">
                        <h4>Delete Automate</h4>
                        <p>Be careful, you are going to delete the project.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <div className="confirmation">
                        <h6>Test Unit</h6>
                        <p className="description-short">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor ullam amet velit in numquam, nobis corporis? Beatae possimus fugiat doloribus ducimus voluptatibus quibusdam deleniti eos.
                        </p>
                        <div className="type">
                            <div className="value">Test</div>
                        </div>
                        <button type="button">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}