import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CalendarDaysIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';


interface PickerCalendarProps
{
    onUpdate?: (data: any) => void
    data?: any
    isSelectedDate: boolean
    gapMinutes?: number // nouveau prop optionnel
}


interface PickerCalendarState
{
    isSelected: boolean
    months: any
    days: any
    dateToday: any
    dateCurrent: any
    dateSelected: any
}

interface DateSelected {
    datetime: Date | null;
    day: number | null;
    month: number | null;
    date: number | null;
    year: number | null;
    hour: number | null;
    datetime_format: string;
}

export default class PickerCalendar extends React.Component<PickerCalendarProps, PickerCalendarState>
{

    constructor(props: PickerCalendarProps) {
        super(props);

        const today = new Date();

        // Définition de dateSelected
        let dateSelected: DateSelected = {
            datetime: null,
            day: null,
            month: null,
            date: null,
            year: null,
            hour: null,
            datetime_format: '',
        };

        if (props.data) {
            const datatime = new Date(props.data.replace(' ', 'T'));
            dateSelected = {
                datetime: datatime,
                day: datatime.getDay(),
                month: datatime.getMonth() + 1,
                date: datatime.getDate(),
                year: datatime.getFullYear(),
                hour: datatime.getHours(),
                datetime_format: this.formatDateTime(datatime),
            };
        }

        // dateCurrent = mois de dateSelected si défini, sinon today
        const dateCurrent = dateSelected.datetime
            ? {
                datetime: new Date(dateSelected.year!, dateSelected.month! - 1, 1),
                day: new Date(dateSelected.year!, dateSelected.month! - 1, 1).getDay(),
                month: dateSelected.month,
                date: 1,
                year: dateSelected.year,
                hour: dateSelected.hour,
                datetime_format: this.formatDateTime(new Date(dateSelected.year!, dateSelected.month! - 1, 1)),
            }
            : {
                datetime: today,
                day: today.getDay(),
                month: today.getMonth() + 1,
                date: today.getDate(),
                year: today.getFullYear(),
                hour: today.getHours(),
                datetime_format: this.formatDateTime(today),
            };

        this.state = {
            isSelected: true,
            months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
            days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            dateToday: {
                datetime: today,
                day: today.getDay(),
                month: today.getMonth() + 1,
                date: today.getDate(),
                year: today.getFullYear(),
                hour: today.getHours(),
                datetime_format: this.formatDateTime(today),
            },
            dateSelected,
            dateCurrent,
        };
    }


    componentDidMount(): void {
        this.syncDateFromProps();
    }

    componentDidUpdate(prevProps: PickerCalendarProps) {
        if (prevProps.data !== this.props.data) {
            this.syncDateFromProps();
        }
    }

    syncDateFromProps() {
    const today = new Date();

    let dateSelected: DateSelected = {
        datetime: null,
        day: null,
        month: null,
        date: null,
        year: null,
        hour: null,
        datetime_format: '',
    };

    if (this.props.data) {
        const datatime = new Date(this.props.data.replace(' ', 'T'));
        dateSelected = {
            datetime: datatime,
            day: datatime.getDay(),
            month: datatime.getMonth() + 1,
            date: datatime.getDate(),
            year: datatime.getFullYear(),
            hour: datatime.getHours(),
            datetime_format: this.formatDateTime(datatime),
        };
    }

    const dateCurrent = dateSelected.datetime
        ? {
            datetime: new Date(dateSelected.year!, dateSelected.month! - 1, 1),
            day: new Date(dateSelected.year!, dateSelected.month! - 1, 1).getDay(),
            month: dateSelected.month,
            date: 1,
            year: dateSelected.year,
            hour: dateSelected.hour,
            datetime_format: this.formatDateTime(new Date(dateSelected.year!, dateSelected.month! - 1, 1)),
        }
        : {
            datetime: today,
            day: today.getDay(),
            month: today.getMonth() + 1,
            date: today.getDate(),
            year: today.getFullYear(),
            hour: today.getHours(),
            datetime_format: this.formatDateTime(today),
        };

    this.setState({ dateSelected, dateCurrent });
}




    // formatDate = (date: any) => {
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     const seconds = String(date.getSeconds()).padStart(2, '0');
    //     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    // }

    parseLaravelDate(dateString: string): Date {
        return new Date(dateString)
    }

    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = '00' //String(date.getMinutes()).padStart(2, '0');
        const seconds = '00'//String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    isToday(date: number)
    {
        const { dateToday, dateCurrent } = this.state;
    
        return (
            dateToday.date === date &&
            dateToday.month === dateCurrent.month &&
            dateToday.year === dateCurrent.year
        );
    }

    isTodayDay(day: number)
    {
        const { dateToday, dateCurrent } = this.state;
    
        return (
            dateToday.day === day &&
            dateToday.month === dateCurrent.month &&
            dateToday.year === dateCurrent.year
        );
    }

    isSelectedDate(date: number)
    {
        const { dateSelected, dateCurrent } = this.state;
    
        return (
            dateSelected.date === date &&
            dateSelected.month === dateCurrent.month &&
            dateSelected.year === dateCurrent.year
        );
    }

    isSelectedHour(hour: number)
    {
        const { dateSelected, dateCurrent } = this.state;
    
        return (
            dateSelected.hour === hour &&
            dateSelected.month === dateCurrent.month &&
            dateSelected.year === dateCurrent.year
        );
    }
    
    handleOnSelect()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    handleOnPrev()
    {
        const newDate = new Date(this.state.dateCurrent.datetime)
        newDate.setMonth(newDate.getMonth() - 1)
        this.setState({
            ...this.state,
            dateCurrent: {
                datetime: newDate,
                day: newDate.getDay(),
                month: newDate.getMonth() + 1,
                date: newDate.getDate(),
                year: newDate.getFullYear(),
                hour: newDate.getHours(),
                datetime_format: this.formatDateTime(newDate),
            },
        })
    }

    handleOnNext()
    {
        const newDate = new Date(this.state.dateCurrent.datetime)
        newDate.setMonth(newDate.getMonth() + 1)
        this.setState({
            ...this.state,
            dateCurrent: {
                datetime: newDate,
                day: newDate.getDay(),
                month: newDate.getMonth() + 1,
                date: newDate.getDate(),
                year: newDate.getFullYear(),
                hour: newDate.getHours(),
                datetime_format: this.formatDateTime(newDate),
            },
        })
    }

    handleDateOnSelect(date: any)
    {
        const newDate = new Date(this.state.dateCurrent.year, this.state.dateCurrent.month - 1, date);
        this.setState({
            ...this.state,
            dateSelected: {
                datetime: newDate,
                day: newDate.getDay(),
                month: newDate.getMonth() + 1,
                date: newDate.getDate(),
                year: newDate.getFullYear(),
                hour: this.state.dateSelected.hour || newDate.getHours(), // Utiliser l'heure actuelle si elle n'est pas définie
                datetime_format: this.formatDateTime(newDate),
            },
        }, () => {
            if  (this.props.onUpdate)
                this.props.onUpdate(this.state.dateSelected)
        });
    }

    handleHourOnSelect(hour: any)
    {
        const updatedDate = this.state.dateSelected.datetime ? new Date(this.state.dateSelected.datetime) : new Date();
        updatedDate.setHours(hour);
        this.setState({
            ...this.state,
            dateSelected: {
                datetime: updatedDate,
                day: updatedDate.getDay(),
                month: updatedDate.getMonth() + 1,
                date: updatedDate.getDate(),
                year: updatedDate.getFullYear(),
                hour: hour,
                datetime_format: this.formatDateTime(updatedDate),
            },
        },  () => {
            if  (this.props.onUpdate)
                this.props.onUpdate(this.state.dateSelected)
        });
    }

    renderCurrenDate()
    {
        return `${this.state.dateCurrent.year} ${this.state.months[this.state.dateCurrent.month - 1]}`
    }

    renderDays() {
        const { dateCurrent, days } = this.state;
        const firstDayOfMonth = new Date(dateCurrent.year, dateCurrent.month - 1, 1).getDay();
        const elements: JSX.Element[] = [];
    
        days.forEach((day: any, index: any) => {
            const dayNumber = (index + 7 - firstDayOfMonth) % 7 + 1;
            //console.log(dayNumber, this.state.dateToday.day, index)
            let dayClass = 'day'
            dayClass += `${this.isTodayDay(index) ? ' today' : ''}`

            // const isDayCurrent = this.isCurrentDay(dayNumber);
            // const dayClass = `day ${isDayCurrent ? 'current' : ''}`;
    
            elements.push(
                <div className={dayClass} key={index} onClick={() => this.handleDateOnSelect(dayNumber)}>
                    {day.charAt(0)}
                </div>
            );
        });
    
        return elements;
    }
    

    renderDates()
    {
        const elements: JSX.Element[] = []
        const firstDayOfMonth = new Date(this.state.dateCurrent.year, this.state.dateCurrent.month - 1, 1)
        const lastDateOfMonth = new Date(this.state.dateCurrent.year, this.state.dateCurrent.month, 0).getDate()
        
        // Fill empty slots for the previous month's days
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            elements.push(
                <div className="date empty" key={`prev-${i}`}></div>
            )
        }
    
        // Fill the current month's days
        for (let i = 1; i <= lastDateOfMonth; i++) {

            let dateClass = 'date'
                dateClass += `${this.isToday(i) ? ' today' : ''}`
                dateClass += `${this.isSelectedDate(i) ? ' selected' : ''}`

            // if (i === 16)
            //     console.log(this.state.dateCurrent, this.state.dateSelected)
            
            elements.push(
                <div className={dateClass} key={i}
                    onClick={ () => this.handleDateOnSelect(i) }>
                    {i}
                </div>
            )
        }

        // Fill empty slots for the next month's days
        const totalDays = elements.length
        const remainingDays = totalDays % 7
        if (remainingDays !== 0) {
            for (let i = remainingDays; i < 7; i++) {
                elements.push(
                    <div className="date empty" key={`next-${i}`}></div>
                )
            }
        }

        return elements
    }

    // renderHoursAM() {
    //     const elements: JSX.Element[] = [];
    //     for (let index = 0; index < 12; index++) {
    
    //         let hourClass = 'hour'
    //         hourClass += `${this.isSelectedHour(index) ? ' selected' : ''}`


    //         elements.push(
    //             <div className={hourClass} 
    //                 key={index} 
    //                 onClick={() => this.handleHourOnSelect(index)}>
    //                 {index} : 00 h
    //             </div>
    //         );
    //     }
    //     return elements;
    // }
    
    // renderHoursPM() {
    //     const elements: JSX.Element[] = [];
    //     for (let index = 12; index < 24; index++) {
            
    //         let hourClass = 'hour'
    //         hourClass += `${this.isSelectedHour(index) ? ' selected' : ''}`

    //         elements.push(
    //             <div className={hourClass} 
    //                 key={index} 
    //                 onClick={() => this.handleHourOnSelect(index)}>
    //                 {index} : 00 h
    //             </div>
    //         );
    //     }
    //     return elements;
    // }

    renderHoursAM() {
        const elements: JSX.Element[] = [];
        const gap = this.props.gapMinutes || 60; // si gap non défini, 60 minutes par défaut

        for (let hour = 0; hour < 12; hour++) {
            for (let minute = 0; minute < 60; minute += gap) {
                let hourClass = 'hour';
                // Comparer avec dateSelected si gap existe
                if (this.state.dateSelected.datetime) {
                    const selectedHour = this.state.dateSelected.hour || 0;
                    const selectedMinute = (this.state.dateSelected.minute || 0);
                    if (hour === selectedHour && minute === selectedMinute) hourClass += ' selected';
                }

                const label = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} h`;
                elements.push(
                    <div className={hourClass}
                        key={`${hour}-${minute}`}
                        onClick={() => this.handleHourOnSelectWithMinute(hour, minute)}>
                        {label}
                    </div>
                );
            }
        }

        return elements;
    }

    renderHoursPM() {
        const elements: JSX.Element[] = [];
        const gap = this.props.gapMinutes || 60; // si gap non défini, 60 minutes par défaut

        for (let hour = 12; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += gap) {
                let hourClass = 'hour';
                if (this.state.dateSelected.datetime) {
                    const selectedHour = this.state.dateSelected.hour || 0;
                    const selectedMinute = (this.state.dateSelected.minute || 0);
                    if (hour === selectedHour && minute === selectedMinute) hourClass += ' selected';
                }

                const label = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} h`;
                elements.push(
                    <div className={hourClass}
                        key={`${hour}-${minute}`}
                        onClick={() => this.handleHourOnSelectWithMinute(hour, minute)}>
                        {label}
                    </div>
                );
            }
        }

        return elements;
    }

    // Adapter handleHourOnSelect pour minutes
    handleHourOnSelectWithMinute(hour: number, minute: number) {
        const updatedDate = this.state.dateSelected.datetime ? new Date(this.state.dateSelected.datetime) : new Date();
        updatedDate.setHours(hour, minute, 0, 0);

        this.setState({
            ...this.state,
            dateSelected: {
                datetime: updatedDate,
                day: updatedDate.getDay(),
                month: updatedDate.getMonth() + 1,
                date: updatedDate.getDate(),
                year: updatedDate.getFullYear(),
                hour: hour,
                minute: minute,
                datetime_format: this.formatDateTime(updatedDate),
            },
        }, () => {
            if (this.props.onUpdate) this.props.onUpdate(this.state.dateSelected);
        });
    }
       
    render()
    {
        //console.log(this.state.dateCurrent)
        return (
            <div className={"form-picker-calendar" + (this.state.isSelected ? ' selected' : '')}>
                <div className="pc-top">
                    <button type="button" onClick={ () => this.handleOnSelect() }>
                        <CalendarDaysIcon />
                    </button>
                </div>
                <div className="pc-core">
                    <div className="c-top">
                        <div className="date">{ this.renderCurrenDate() }</div>
                        <div className="options">
                            <button type="button" className="btn-prev"
                                onClick={ () => this.handleOnPrev() }>
                                <ArrowLeftIcon />
                            </button>
                            <button type="button" className="btn-next"
                                onClick={ () => this.handleOnNext() }>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                    <div className="c-days">
                        { this.renderDays() }
                    </div>
                    <div className="c-dates">
                        { this.renderDates() }
                    </div>
                    <div className="c-hours">
                        <div className="h-am">
                            <div className="label">AM</div>
                            { this.renderHoursAM() }
                        </div>
                        <div className="h-pm">
                            <div className="label">PM</div>
                            { this.renderHoursPM() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}