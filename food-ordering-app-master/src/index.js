import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Controller from './Controller';

ReactDOM.render(
    <div>
                <Controller/>
    </div>,
    document.getElementById('root')
);

serviceWorker.unregister();
