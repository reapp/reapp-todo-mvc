import './store';

import '../assets/todomvc/base.css';

import { router, route } from 'reapp-kit';

router(require,
  route('todos', '/',
    route('all', { default: true }),
    route('completed'),
    route('active')
  )
);