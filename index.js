const createThenable = (val, error, resolve, reject) => {

  const catchThenable = (handleError) => {
    if (error !== null && val === null) {
      try {
        return reject(handleError(error));
      } catch (transformationError) {
        return reject(transformationError);
      }
    } else {
      return reject(new Error("No error was caught"));
    }
  };

  // fn is a transformation function that accepts a value and returns a promise
  const then = (fn) => {
    if (error === null && val !== null) {
      try {
        return resolve(fn(val));
      } catch (transformationError) {
        return reject(transformationError);
      }
    } else if (error !== null) {
      return reject(error);
    }
  };

  return {
    catch: catchThenable,
    then,
    value: val,
    reason: error
  };
};

const createPromise = (someFn) => {
  const resolve = (val) => createThenable(val, null, resolve, reject);
  const reject = (val) => createThenable(null, val, resolve, reject);

  if (typeof someFn !== "function") {
    return {
      resolve,
      reject
    };
  } else {
    return {
      ...someFn(resolve, reject),
      resolve,
      reject
    };
  }
};

createPromise((res, rej) => res(2))
  .then((res) => res * 2)
  .then((res) => res + 10)
  .then((val) => console.log(val));

createPromise()
  .resolve(2)
  .then((res) => res * 2)
  .then((res) => res + 70)
  .then((val) => console.log(val));

createPromise()
  .reject("something is wrong 1")
  .then((res) => res * 2)
  .catch((val) => console.log(val));

createPromise((res, rej) => rej("something is wrong 2"))
  .then((res) => res * 2)
  .then((res) => res * 2)
  .catch((val) => console.log(val));

