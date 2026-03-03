import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface PickerTimeProps
{
    onTime?: (time: any) => void
}


interface PickerTimeState
{
    pickerOption: number // 1 = Hours, 2 = Minutes =, 3 = Seconds
    data: {
        hours: any,
        minutes: any,
        seconds: any,
    }
}

export default class PickerTime extends React.Component<PickerTimeProps, PickerTimeState>
{
    refHours: any
    refMinutes: any
    refSeconds: any

    constructor(props: PickerTimeProps)
    {
        super(props)
        this.state = {
            pickerOption: 1,
            data: {
                hours: '',
                minutes: '',
                seconds: '',
            },
        }
        this.refHours = React.createRef()
        this.refMinutes = React.createRef()
        this.refSeconds = React.createRef()
    }

    isHours(hours: string): boolean 
    {
        const parsedHours = parseInt(hours, 10);
        if (this.state.pickerOption === 1) {
            return parsedHours >= 0 && parsedHours <= 23;
        } else if (this.state.pickerOption === 2) {
            return parsedHours >= 0 && parsedHours <= 12;
        }
        return false;
    } 
    
    callOnTime()
    {
        const { hours, minutes, seconds } = this.state.data

        const formattedHours = hours.padStart(2, '0')
        const formattedMinutes = minutes.padStart(2, '0')
        const formattedSeconds = seconds.padStart(2, '0')

        const timeObject = {
            hours: formattedHours,
            minutes: formattedMinutes,
            seconds: formattedSeconds,
            toText: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
        }

        if (this.props.onTime) {
            this.props.onTime(timeObject)
        }
    }

    handleOnClear()
    {
        this.setState({
            data: {
                hours: '',
                minutes: '',
                seconds: '',
            }
        })
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = event.target
    
        const numericValue = value.replace(/\D/g, '')

        if (name === "hours") 
        {
            if (numericValue === '') 
            {
                this.setState(prevState => ({
                    data: {
                        ...prevState.data,
                        hours: ''
                    }
                }), () => this.callOnTime())
                return
            }
    
            if (this.isHours(numericValue)) 
            {
                this.setState(prevState => ({
                    data: {
                        ...prevState.data,
                        hours: numericValue,
                    }
                }), () => this.callOnTime())
            }
        }
    
        if (name === "minutes" || name === "seconds") 
        {
            if (numericValue === '') 
            {
                this.setState(prevState => ({
                    data: {
                        ...prevState.data,
                        [name]: ''
                    }
                }), () => this.callOnTime())
                return
            }
    
            const timeValue = parseInt(numericValue, 10)
            if (timeValue >= 0 && timeValue <= 59) 
            {
                this.setState(prevState => ({
                    data: {
                        ...prevState.data,
                        [name]: numericValue,
                    }
                }), () => this.callOnTime())
            }
        }
    }    
        
    handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) 
    {
        const { name, value } = event.currentTarget

        if (event.key === "Backspace" || event.key === "Delete") 
        {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    [name]: value.slice(0, -1)
                }
            }), () => this.callOnTime())
        }
    }
    
    handleOnHours() 
    {
        this.refHours.current.focus()
        this.setState({
            pickerOption: 1,
        })
    }
    
    handleOnMinutes() 
    {
        this.refMinutes.current.focus()
        this.setState({
            pickerOption: 2,
        })
    }
    
    handleOnSeconds() 
    {
        this.refSeconds.current.focus()
        this.setState({
            pickerOption: 3,
        })
    }

    handleOnFocus(option: number)
    {
        this.setState({
            pickerOption: option,
        })
    }

    handleOnTime(digit: number) {

        const activeElement = document.activeElement;
        const digitString = digit.toString();
    
        if (this.state.pickerOption === 1) {
            this.setState((prevState: any) => {
                const newHours = prevState.data.hours.length < 2 ? prevState.data.hours + digitString : prevState.data.hours
    
                const parsedHours = parseInt(newHours, 10);
                if (parsedHours >= 0 && parsedHours <= 23) {
                    return {
                        data: {
                            ...prevState.data,
                            hours: newHours,
                        }
                    };
                }
                return prevState;
            }, () => this.callOnTime())
        } 
        else if (this.state.pickerOption === 2) 
        {
            this.setState((prevState: any) => {
                const newMinutes = prevState.data.minutes.length < 2 ? prevState.data.minutes + digitString : prevState.data.minutes

                const parsedMinutes = parseInt(newMinutes, 10)
                if (parsedMinutes >= 0 && parsedMinutes <= 59) 
                {
                    return {
                        data: {
                            ...prevState.data,
                            minutes: newMinutes,
                        }
                    }
                }
                return prevState
            }, () => this.callOnTime())
        } 
        else if (this.state.pickerOption === 3) 
        { 
            this.setState((prevState: any) => {
                const newSeconds = prevState.data.seconds.length < 2 ? prevState.data.seconds + digitString : prevState.data.seconds
    
                const parsedSeconds = parseInt(newSeconds, 10)
                if (parsedSeconds >= 0 && parsedSeconds <= 59) 
                {
                    return {
                        data: {
                            ...prevState.data,
                            seconds: newSeconds,
                        }
                    }
                }
                return prevState
            }, () => this.callOnTime())
        }
    }
    

    // --- RENDER ---

    renderPickerValues()
    {
        let elements: any = []
        for (let index = 0; index < 10; index++)
        {
            elements.push(<button type="button" 
                    className="btn-value" 
                    key={ index }
                    onClick={ () => this.handleOnTime(index) }>{ index }</button>)
        }
        return (elements)
    }

    render()
    {
        return (
            <div className="picker-time">
                <div className="values">
                    <input type="text"
                        className={ this.state.pickerOption === 1 ? ' focused' : '' }
                        ref={ this.refHours }
                        name="hours" maxLength={2}
                        value={ this.state.data.hours }
                        onChange={(e) => this.handleInputChange(e)}
                        onKeyDown={(e) => this.handleKeyDown(e) }
                        onFocus={() => this.handleOnFocus(1)}  />
                    <span className="seperator">:</span>
                    <input type="text"
                        className={ this.state.pickerOption === 2 ? ' focused' : '' }
                        ref={ this.refMinutes }
                        name="minutes" 
                        maxLength={2}
                        value={ this.state.data.minutes }
                        onChange={(e) => this.handleInputChange(e)}
                        onFocus={() => this.handleOnFocus(2)}  />
                    <span className="seperator">:</span>
                    <input type="text" 
                        className={ this.state.pickerOption === 3 ? ' focused' : '' }
                        ref={ this.refSeconds }
                        name="seconds" maxLength={2}
                        value={ this.state.data.seconds }
                        onChange={(e) => this.handleInputChange(e)}
                        onFocus={() => this.handleOnFocus(3)}  />
                </div>
                <div className="picker">
                    <div className="p-options">
                        <div className="time">
                            <button type="button" className="btn-hours"
                                onClick={ () => this.handleOnHours() }>H</button>
                            <button type="button" className="btn-minutes"
                                onClick={ () => this.handleOnMinutes() }>M</button>
                            <button type="button" className="btn-seconds"
                                onClick={ () => this.handleOnSeconds() }>S</button>
                        </div>
                        <div className="others">
                            <button type="button" className="btn-reset"
                                onClick={  () => this.handleOnClear() }>
                                <XMarkIcon />
                            </button>
                        </div>
                    </div>
                    <div className="p-values">
                        { this.renderPickerValues() }
                    </div>
                </div>
            </div>
        )
    }
}