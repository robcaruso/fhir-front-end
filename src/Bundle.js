
import React from 'react';
import Resource from './Resource'
import config from "./config.json";


class Bundle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            data: [],
            token: null,
            next: null,
            url: config.BASE_URL,
            rootURL: config.BASE_URL
        };
    }


    componentDidMount() {
        this.fetchData();
    }
    componentDidUpdate() {
        //  this.fetchData();
    }
    // fetches the data and sets the next url
    fetchData() {
        if (this.state.token)
            fetch(this.state.url)
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json()
                })
                .then(
                    (response) => {
                        var next = null;
                        if (!response.link) {
                        } else {
                            response.link.forEach(element => {
                                if (element.relation === "next") {
                                    if (this.state.url.indexOf("skip") === -1) {
                                        next = this.state.url + "?_skip=" + element.url.substring(element.url.indexOf("=") + 1);
                                    } else {
                                        var skip = element.url.substring(element.url.indexOf("?") + 1)
                                        next = this.state.url.replace(/_skip=[0-9]*/, skip);

                                    }
                                }
                            });
                        }
                        this.setState({
                            data: response.entry,
                            next: next
                        });

                    },
                    (error) => {
                        this.setState({
                            error: error
                        });
                    }
                )
    }
    renderData() {
        return this.state.data.map((resources, index) => {
            return (<Resource key={resources.resource.id} resource={resources.resource} />)


        })
    }
    handleClick = (e) => {
        e.preventDefault();
        let currentState = JSON.parse(JSON.stringify(this.state));

        if (e.target.id === "next") {
            this.setState({ prev: currentState.url, url: currentState.next },
                function () { this.fetchData(); window.scrollTo(0, 0) });
        }

        if (e.target.id === "submit") {

            this.setState({ token: document.querySelector('#token').value, url: this.state.rootURL + document.querySelector('#token').value },
                function () { this.fetchData() });

        }
        this.fetchData();
    };

    render() {

        if (this.state.error && this.state.error.status === 401) {

            return (<div>Error: Invalid token</div>);

        } else if (this.state.error) {
            return (<div>Error: Server Error</div>);
        }
        else {
            return (<div>
                <div>
                    <input id="token" type="text" />
                    <button id="submit" onClick={this.handleClick}>submit</button>
                </div>
                <div>{this.renderData()}</div>
                <a id="next" href={this.state.next} onClick={this.handleClick}>Next</a>
            </div>);
        }
    }

}

export default Bundle;

