function classNames(classNameList: (string | undefined)[]) {
  const reducedClassNames = classNameList
    .filter((value) => Boolean(value))
    .reduce((prev, curr) => {
      return prev + " " + curr;
    });

  return {
    className: reducedClassNames,
  };
}

export { classNames };
