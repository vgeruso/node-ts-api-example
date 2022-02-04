import { App } from './app';

new App().server.listen(3333, () => {
  console.log('SERVER ON IN 3333');
});