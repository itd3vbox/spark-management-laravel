import React from "react";
import { XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps 
{
    onUpload?: (data: { file: File | null, url: string | null }) => void;
    imageWeight?: number | null;
    placeholder?: string 
    path?: string | null
}

interface ImageUploaderState 
{
    imageFile: File | null;
    imageUrl: string | null;
    error: string | null;
}

export default class ImageUploader extends React.Component<ImageUploaderProps, ImageUploaderState> 
{

    fileInputRef: React.RefObject<HTMLInputElement>

    constructor(props: ImageUploaderProps) 
    {
        super(props)
        this.state = {
            imageFile: null,
            imageUrl: this.props.path || null,
            error: null,

        }
        this.fileInputRef = React.createRef()
    }

    componentDidUpdate(prevProps: Readonly<ImageUploaderProps>, prevState: Readonly<ImageUploaderState>, snapshot?: any): void {
        if (prevProps.path !== this.props.path)
        {
            this.setState({
                imageUrl: this.props.path || null
            })
        }
    }

    getData() {
        return {
            file: this.state.imageFile,
            url: this.state.imageUrl
        };
    }

    triggerFileInputClick = () => {
        if (this.fileInputRef.current) 
        {
            this.fileInputRef.current.click()
        }
    }

    handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        const file = e.target.files && e.target.files[0];
        if (file) 
        {
            if (this.props.imageWeight && file.size > this.props.imageWeight) 
            {
                this.setState({ error: `Le poids maximal est de ${this.props.imageWeight / (1024 * 1024)} Mo` });
                return ;
            }
            const imageUrl = URL.createObjectURL(file);
            this.setState({ imageFile: file, imageUrl }, () => {
                this.props.onUpload?.(this.getData());
            });
        }
    }

    handleImageClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        this.setState({ imageFile: null, imageUrl: null }, () => {
            this.props.onUpload?.(this.getData());
        });
        if (this.fileInputRef.current) {
            this.fileInputRef.current.value = ''
        }
    }

    render() {
        const { imageUrl, error } = this.state
        return (
            <div className="image-uploader">
                {imageUrl ? (
                    <div className="image-preview" onClick={this.triggerFileInputClick}>
                        <img src={imageUrl} alt="Uploaded" />
                        <button className="btn-clear" onClick={ this.handleImageClear }>
                            <XMarkIcon />
                        </button>
                    </div>
                ) : (
                    <div className="image-input" onClick={this.triggerFileInputClick}>
                        <input
                            type="file"
                            id="fileInput"
                            ref={this.fileInputRef}
                            accept="image/*"
                            onChange={this.handleImageUpload}
                            style={{ display: "none" }}
                        />
                        { this.props.placeholder ? this.props.placeholder : 'Click to upload' }
                    </div>
                )}
                { error !== null && (
                        <div className="error">{ error }</div>
                    )
                }
            </div>
        );
    }
}