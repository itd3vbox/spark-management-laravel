import React from "react";
import Note from "./Note";

interface MasonryProps {
    items: any[];
    onEdit: (data: any) => void
    onDelete: () => void
}

interface MasonryState {
    columns: any[][];
}

export default class Masonry extends React.Component<MasonryProps, MasonryState> {

    constructor(props: MasonryProps) {
        super(props);
        this.state = {
            columns: []
        };
    }

    componentDidMount() {
        this.buildColumns();
        window.addEventListener('resize', this.buildColumns);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.buildColumns);
    }

    componentDidUpdate(prevProps: MasonryProps) {
        if (prevProps.items !== this.props.items) {
            this.buildColumns();
        }
    }

    getColumnCount() {
        const w = window.innerWidth;
        if (w > 1400) return 4;
        if (w > 1000) return 3;
        if (w > 600) return 2;
        return 1;
    }

    buildColumns = () => {
        const { items } = this.props;
        if (!items || !items.length) return;

        const colCount = this.getColumnCount();
        const cols: any[][] = Array.from({ length: colCount }, () => []);
        const heights = new Array(colCount).fill(0);

        items.forEach((item: any) => {
            const idx = heights.indexOf(Math.min(...heights));
            cols[idx].push(item);
            heights[idx] += item.text?.length || 200;
        });

        this.setState({ columns: cols });
    };

    handleOnEdit(data: any)
    {
        this.props.onEdit(data)
    }

    handleOnDelete()
    {
        this.props.onDelete()
    }

    render() {
        return (
            <div className="masonry">
                {this.state.columns.map((col, i) => (
                    <div key={i} className="column">
                        {col.map((item: any) => (
                            <Note key={item.id} data={item}
                                onEdit={ (data: any) => this.handleOnEdit(data) }
                                onDelete={ () => this.handleOnDelete() } />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}