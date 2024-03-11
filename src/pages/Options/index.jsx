import React from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/roboto/400.css';

import { Options } from './Options';

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Options />);
