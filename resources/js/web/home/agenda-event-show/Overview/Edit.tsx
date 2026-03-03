import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import PickerCalendar from "@/components/form/PickerCalendar";

interface EditProps
{
    data: any
    onClose: any
    onUpdate: any
}


interface EditState
{
    formData: {
        [key: string]: any
    }
    data: any
}

export default class Edit extends React.Component<EditProps, EditState>
{

    constructor(props: EditProps)
    {
        super(props)
        this.state = {
            formData: {
                id: 0,
                title: '',
                date: '',
                time: '',
                note: '',
            },
            data: null,
        }
    }

    componentDidMount(): void {
        this.setState({
            data: this.props.data,
            formData: {
                id: this.props.data.id,
                title: this.props.data.title,
                date: this.props.data.date,   // "2026-02-19"
                time: this.props.data.time,    // "14:00:00"
                note: this.props.data.note,
            }
        })
    }

    componentDidUpdate(prevProps: Readonly<EditProps>, prevState: Readonly<EditState>, snapshot?: any): void {
        if (this.props.data && prevProps.data != this.props.data)
        {
            this.setState({
                data: this.props.data,
                formData: {
                    id: this.props.data.id,
                    title: this.props.data.title,
                    date: this.props.data.date,   // "2026-02-19"
                    time: this.props.data.time,    // "14:00:00"
                    note: this.props.data.note,
                },
            })
        }
    }

    async update()
    {
        const url: string = `/agenda/${this.props.data.id}`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'PUT')
        for (const key in formData) 
        {
            multipartFormData.append(key, formData[key])    
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData, //JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)

            this.props.onUpdate()
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleInputOnChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = event.target
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }))
    }

    handleDateTimeOnUpdate(data: any)
    {
        const datetime = data.datetime_format // "2026-02-19 14:00:00"

        const [date, time] = datetime.split(' ')

        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                date: date,   // "2026-02-19"
                time: time    // "14:00:00"
            }
        }))

    }

    handleOnSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.update()
    }

    handleOnClose(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.setState({
            formData: {
                title: '',
                date: '',
                time: '',
                note: '',
            },
            data: null,
        }, () => this.props.onClose())
    }

    render()
    {
        console.log('edit event', this.props.data)
        if (!this.state.data)
            return (<></>)
        return (
            <div className="edit">
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Edit Agenda Event</h4>
                        <p>
                            Update the event details such as the date, time, title, or description.
                        </p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row">
                            <label htmlFor="dc-title">Title</label>
                            <input type="text" name="title" 
                                id="dc-title"
                                value={ this.state.formData.title }
                                placeholder="Ex.: Alpha & Omega"
                                onChange={(e) => this.handleInputOnChange(e)} />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-note">Note</label>
                            <textarea name="note"
                                id="dc-note"
                                value={ this.state.formData.note }
                                placeholder="Ex.: ..."
                                onChange={(e) => this.handleInputOnChange(e)}></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-content">Date</label>
                            <PickerCalendar
                                data={
                                    this.state.formData.date && this.state.formData.time
                                        ? `${this.state.formData.date} ${this.state.formData.time}`
                                        : undefined
                                }
                                onUpdate={(data: any) => this.handleDateTimeOnUpdate(data)}
                                isSelectedDate={true}
                            />

                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row fr-options">
                            <button type="button"
                                onClick={ (event) => this.handleOnSubmit(event) }>Update</button>
                            <button type="button"
                                onClick={ (event) => this.handleOnClose(event) }>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}