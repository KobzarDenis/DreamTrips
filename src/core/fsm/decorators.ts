export function Options(stateName) {
  function decorator(t, n, desriptor) {
    t.prototype["name"] = stateName;
  }

  return decorator;
}
