const Debounce = (f, ms) => {
  let lastUpdate = 0;
  let timeout;

  return (args) => {
    const diff = performance.now() - lastUpdate;

    if(diff > ms) {
      lastUpdate = performance.now();
      f(args);
    } else {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        lastUpdate = performance.now();
        f(args);
      }, ms - diff);
    }
  };
};

export default Debounce;
