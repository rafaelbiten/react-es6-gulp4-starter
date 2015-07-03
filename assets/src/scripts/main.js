import $ from 'jquery';

import Logger from './modules/Logger';
import Mapper from './modules/Mapper';

import React from 'react';
import Hello from './components/hello-from-react';

var logger = new Logger();
var mapper = new Mapper();

logger.log('ES6 Modules are Working');
mapper.toSquare([1, 2, 3, 4]);

$('#jquery-test').html('Hello from jQuery');

React.render(<Hello />, document.getElementById('react-test'));
