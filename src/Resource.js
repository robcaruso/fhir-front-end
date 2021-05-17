import React from 'react';
//import ReactDOM from 'react-dom';


class Resoruce extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    recurseOject(resource) {
        return (
            Object.entries(resource).map(([key, value]) => {

                if (typeof value === "string") {
                    if (value.startsWith("<div")) {
                        return "";
                    }
                    return <li key={key}>{key}:{value}</li>

                }
                if (typeof value === "object") {
                    return (<li key={key}>
                        {key}:
                        <ul>
                            {this.recurseOject(value)}
                        </ul>
                    </li>)
                }

                return <li key={key}>{key}:{value}</li>;
            }))
    }


    renderData() {

        return (
            <ul className="main" key={this.props.resource.id}>
                { this.recurseOject(this.props.resource)}
            </ul >)

    }
    render() {
        return (<div>{this.renderData()}</div>);
    }
}



export default Resoruce;

