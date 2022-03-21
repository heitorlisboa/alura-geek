type ClassNameListType = (string | undefined)[];

// Function overloads
function classNames(
  classNameList: ClassNameListType,
  returnAsObject?: true
): {
  className: string;
};

function classNames(
  classNameList: ClassNameListType,
  returnAsObject?: false
): string;

// Main function
function classNames(
  classNameList: ClassNameListType,
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
