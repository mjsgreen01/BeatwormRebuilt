import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from 'react-redux';

import { ArtistListConnected } from './artist-list/index';
import { store } from './store/index';

function bootStrap() {
    try {
        const App = () => (
            <Provider store={store}>
                <Router>
                    <Route exact path="/" component={ArtistListConnected}/>
                </Router>
            </Provider>
        );
        render(<App/>, document.getElementById('root'));

    } catch (error) {
        console.error(error);
        const {status} = error.response;
        if (status >= 500) {
            console.log(error)
            // const Error = <Error50x code={e.status} text={e.statusText} />;
            // ReactDOM.render(Error, document.getElementById('root'));
        }
        console.error("Bootstrap failed:", error);
    }
}

bootStrap();
