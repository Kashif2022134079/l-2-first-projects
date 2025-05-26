export const calculateGradeAnPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoint: 0,
  };
  if (totalMarks >= 0 && totalMarks <= 30) {
    result = {
      grade: 'F',
      gradePoint: 0,
    };
  } else if (totalMarks >= 31 && totalMarks <= 40) {
    result = {
      grade: 'D',
      gradePoint: 2.0,
    };
  } else if (totalMarks >= 41 && totalMarks <= 60) {
    result = {
      grade: 'C',
      gradePoint: 2.5,
    };
  } else if (totalMarks >= 61 && totalMarks <= 70) {
    result = {
      grade: 'B',
      gradePoint: 3.0,
    };
  } else if (totalMarks >= 71 && totalMarks <= 80) {
    result = {
      grade: 'A',
      gradePoint: 3.5,
    };
  } else if (totalMarks >= 81 && totalMarks <= 100) {
    result = {
      grade: 'A+',
      gradePoint: 4.0,
    };
  } else {
    result = {
      grade: 'NA',
      gradePoint: 0,
    };
  }

  return result;
};
