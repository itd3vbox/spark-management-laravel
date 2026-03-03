import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import PickerCalendar from "@/components/form/PickerCalendar";

interface CreateProps
{
    data: any
    onStore: () => void
}


interface CreateState
{
    formData: {
        [key: string]: any
    }
}

export default class Create extends React.Component<CreateProps, CreateState>
{

    constructor(props: CreateProps)
    {
        super(props)
        this.state = {
            formData: {
                title: '',
                date: '',
                time: '',
                note: '',
            },
        }
    }

    async store() {
        const url: string = `/agenda`;

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : '';
        }

        const { formData } = this.state;

        const multipartFormData = new FormData();
        for (const key in formData) {
            multipartFormData.append(key, formData[key]);
        }

        if (this.props.data.time !== null) {
            const dateObj = this.props.data.date;   // { date, month, year, toText }
            const timeObj = this.props.data.time.hours; // ex: "00h00m"

            // 🔹 Transformation du timeObj "00h00m" -> "HH:MM:SS"
            let hour = '00';
            let minute = '00';

            if (typeof timeObj === 'string') {
                // Cas "00h00m"
                const match = timeObj.match(/^(\d{1,2})h(\d{1,2})m$/);
                if (match) {
                    hour = match[1].padStart(2, '0');
                    minute = match[2].padStart(2, '0');
                }
            } else if (typeof timeObj === 'object') {
                // Cas { hour: 0, minute: 0 }
                hour = String(timeObj.hour || 0).padStart(2, '0');
                minute = String(timeObj.minute || 0).padStart(2, '0');
            }

            const timeString = `${hour}:${minute}:00`; // "HH:MM:SS"

            // Date au format YYYY-MM-DD
            const dateString = dateObj; // ex: "2026-02-28"

            multipartFormData.append('date', dateString);
            multipartFormData.append('time', timeString);
            console.log(dateString , timeString)
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData,
            });

            const result = await response.json();
            console.log(result);

            this.setState({
                formData: {
                    title: '',
                    date: '',
                    time: '',
                    note: '',
                },
            }, () => this.props.onStore());
        } catch (error) {
            console.error('Error', error);
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

        console.log(date, time)

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
        this.store()
    }

    render()
    {
        return (
            <div className="create">
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Create Agenda Event</h4>
                        <p>Schedule a new event by selecting a date, time, and adding relevant details.</p>
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
                        { this.props.data.time === null && (
                            <div className="form-row">
                                <label htmlFor="dc-content">Date</label>
                                <PickerCalendar
                                    gapMinutes={ 30 }                     
                                    onUpdate={ (data: any) => this.handleDateTimeOnUpdate(data) }
                                    isSelectedDate={ false }
                                    />
                                <p className="error">Message error.</p>
                            </div>
                        ) }
                        <div className="form-row">
                            <button type="button"
                                onClick={ (event) => this.handleOnSubmit(event) }>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}