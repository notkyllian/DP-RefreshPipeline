import app from './app';

app.start((err) => {
  if (err) {
    console.error(`Error=${err}`);
  }
  console.info('app bootstrap finished');
});
