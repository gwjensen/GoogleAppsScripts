//Insert the contents of this file into code associated with a Google Sheets Spreadsheet. 
//Then simply call bavarian_grade() with the correct parameters
//
function round_range(x, lower_bound, upper_bound) {
  //Rounds the input x to the closer of the two bounds, assumes x is between the two bounds and 
  // that the bounds are decimal values

  middle = Math.abs(upper_bound - lower_bound) / 2.0
  //Logger.log("------round_range-start-- x: " + x + " lower: " + lower_bound + " upper: " + upper_bound + " middle: " + middle)
 
  if (x >= middle) {
    if (upper_bound > lower_bound) {
       x = upper_bound
    }
    else{
      x = lower_bound
    }
  }
  else{
    if (upper_bound > lower_bound) {
       x = lower_bound
    }
    else{
      x = upper_bound
    }
  }
  //Logger.log("------round_range-end-- x: " + x)
  return x
}

function tum_grade_rounding(x){
  //Expects a value from the German grading system
  grade = Math.floor(x)
  dec = x % 1
  //Logger.log("--------tum_grade_rounding-start-x: " + x + ", grade: " + grade + ", dec: " + dec)

  if ( dec < .3 ){
    dec = round_range(dec, 0, .3)
  }
  else if ( dec < .7 ){
    dec = round_range(dec, .3, .7)
  }
  else{
    dec = round_range(dec, .7, 1.0)
  }
  grade += dec
  //Logger.log("--------tum_grade_rounding-end-x: " + x + ", grade: " + grade + ", dec: " + dec)

  return grade
}


function bavarian_grade(score, min_passing, max_possible) {
  //calculate the German grade using the bavaria formula
  //https://www.uni-kassel.de/eecs/fileadmin/datas/fb16/ece/documents/Bavarian_formula_ECE_2012-01-24_01.pdf
  
  grade = ((max_possible - score)/(max_possible - min_passing)) * 3 + 1
  return tum_grade_rounding(grade)
}
