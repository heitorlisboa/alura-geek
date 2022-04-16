type ClassNameList = (string | undefined)[];

// Function overloads
function classNames(
  classNameList: ClassNameList,
  returnAsObject?: true
): {
  className: string;
};

function classNames(
  classNameList: ClassNameList,
  returnAsObject?: false
): string;

// Main function
function classNames(
  classNameList: ClassNameList,
  returnAsObject: boolean = true
) {
  const reducedClassNames = classNameList
    .filter((value) => Boolean(value))
    .reduce((prev, curr) => {
      return prev + " " + curr;
    });

  return returnAsObject
    ? {
        className: reducedClassNames,
      }
    : reducedClassNames;
}

export { classNames };
