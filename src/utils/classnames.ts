const hasOwn = {}.hasOwnProperty;

export type ArgType =
  string |
  number |
  boolean |
  {
    [className: string]: any;
  } |
  any[] |
  null |
  undefined;

export function classNames (...args: ArgType[]) {
  const classes: (string | number)[] = [];

  for (let arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner: string = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (typeof arg === 'object') {
      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
