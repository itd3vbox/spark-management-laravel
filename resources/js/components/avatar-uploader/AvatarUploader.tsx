import React from "react";
import { XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface AvatarUploaderProps 
{

}

interface AvatarUploaderState 
{
    imageUrl: string | null;
}

export default class AvatarUploader extends React.Component<AvatarUploaderProps, AvatarUploaderState> 
{

    fileInputRef: React.RefObject<HTMLInputElement>

    constructor(props: AvatarUploaderProps) 
    {
        super(props)
        this.state = {
            imageUrl: null,
        }
        this.fileInputRef = React.createRef()
    }

    handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        const file = e.target.files && e.target.files[0];
        if (file) 
        {
            const imageUrl = URL.createObjectURL(file)
            this.setState({ imageUrl })
        }
    }

    triggerFileInputClick = () => {
        if (this.fileInputRef.current) 
        {
            this.fileInputRef.current.click()
        }
    }

    render() {
        const { imageUrl } = this.state
        return (
            <div className="avatar-uploader">
                {imageUrl ? (
                    <div className="image" onClick={this.triggerFileInputClick}>
                        <img src={imageUrl} alt="Uploaded" />
                    </div>
                ) : (
                    <div className="image" onClick={this.triggerFileInputClick}>
                        <input
                            type="file"
                            id="fileInput"
                            ref={this.fileInputRef}
                            accept="image/*"
                            onChange={this.handleImageUpload}
                            style={{ display: "none" }}
                        />
                        Click to upload
                    </div>
                )}
            </div>
        );
    }
}
