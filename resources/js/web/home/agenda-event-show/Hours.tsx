import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

interface HoursProps
{
    data: any
    onSelect?: (data: any) => void
}

interface HoursState
{
    selected?: string
}

export default class Hours extends React.Component<HoursProps, HoursState>
{
    constructor(props: HoursProps)
    {
        super(props)
        this.state = {
            selected: undefined,

        }
    }

    handleOnSelect(data: any) {
        const { selected } = this.state;

        if (selected === data.label) {
            // Si l'élément est déjà sélectionné, on le désélectionne
            this.setState({ selected: undefined });
            if (this.props.onSelect) this.props.onSelect(null);
        } else {
            // Sinon, on sélectionne le nouvel élément
            this.setState({ selected: data.label });
            if (this.props.onSelect) this.props.onSelect(data.events);
        }
    }

    renderHours()
    {
        const elements: any = []
        const events = Array.isArray(this.props.data) ? this.props.data : []

        let colorIndex = 1

        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 30]) {
                const formattedHour = hour.toString().padStart(2, "0");
                const formattedMinute = minute.toString().padStart(2, "0");

                // 🔹 label pour affichage (avec tiret pour lisibilité)
                const label = `${formattedHour}h - ${formattedMinute}m`;

                // 🔹 label pour comparaison (sans tiret)
                const hourKey = `${formattedHour}h${formattedMinute}m`;

                // console.log('events', events.map((e:any)=> e.hours));
                // console.log('hourKey', hourKey);
                // 🔹 trouver l'objet correspondant
                const matchingData = events.find((event: any) => event.hours === hourKey);

                // 🔹 vérifier si total > 0
                const hasEvents = matchingData && matchingData.total > 0;

                let colorClass = "";
                if (hasEvents) {
                    colorClass = `color-${colorIndex}`;
                    colorIndex++;
                    if (colorIndex > 5) colorIndex = 1;
                }

                elements.push(
                    <div
                        key={label}
                        className={`hour ${this.state.selected === label ? "selected" : ""} ${colorClass}`}
                        onClick={() =>
                            this.handleOnSelect({
                                label: label,
                                events: matchingData,
                            })
                        }
                    >
                        <div className="wrapper">{label}</div>
                    </div>
                );
            }
        }

        return elements
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        return (
            <div className="hours">
                {this.renderHours()}
            </div>
        )
    }
}
