///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //Go through all of the folders we have for homework submission and put the answers into a concise form in a single spreadsheet for easier grading.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function collectHmwkAnswers() {
    var numHmwk = 11;
    var hmwkPathNames = ["Machine_Learning1", "Student_Homework"];
    var hmwksheet = "SubmittedHmwk"
    var collectedsheet = "CollectedHmwkAnswers"
    
    var hmwkid = 0; //folder handle for "Student_Homework" - Gets set later
  
    var sId = 0; //Id for the spreadsheet where we are collecting answers
    var studentHmwkAnswers = {};
    var studentHmwkLate = {};
    var rowLookup = {};
    
    //Check if we already have a version of the spreadsheet, If we do, don't overwrite it
            //This for loop just walks Drive's tree structure so we are in the folder we want to be in
    var curFolder = DriveApp.getRootFolder();
    for (index = 0; index < hmwkPathNames.length; ++index) {
      Logger.log(hmwkPathNames[index])
      var result = curFolder.getFoldersByName(hmwkPathNames[index])
      Logger.log(result)
      if (result.hasNext()) {
        curFolder = result.next();
        if (hmwkid == 0 && hmwkPathNames[index] == "Student_Homework"){
          hmwkid = curFolder.getId();
          //Open spreadsheet and add the student info
          var files = curFolder.getFilesByName(collectedsheet);
          if (files.hasNext() == false) {
            var ssNew = SpreadsheetApp.create(collectedsheet);
            sId = ssNew.getId();
            var file = DriveApp.getFileById(sId);
            curFolder.addFile(file)
            DriveApp.getRootFolder().removeFile(file)
          }
          else{
            Logger.log("Spreadsheet file already exists. We will NOT overwrite it!!!");
            return "Spreadsheet file already exists. We will NOT overwrite it!!!";
          }
        }
      } 
      else {
        Logger.log("Folder " + tmpPaths[index] + " doesn't exist!!! This is a problem!!")
        return "Folder " + tmpPaths[index] + " doesn't exist!!!"
      }
    }  
    
    
    for (num = 0; num <= numHmwk; ++num) {
        var tmpPaths = hmwkPathNames.slice(0);
        tmpPaths.push(["Hmwk" + num])
        curFolder = DriveApp.getRootFolder();

        //This for loop just walks Drive's tree structure so we are in the folder we want to be in
        for (index = 0; index < tmpPaths.length; ++index) {
            Logger.log(tmpPaths[index])
            var result = curFolder.getFoldersByName(tmpPaths[index])
            Logger.log(result)
            if (result.hasNext()) {
                curFolder = result.next();                
            } 
            else {
                Logger.log("Folder " + tmpPaths[index] + " doesn't exist!!! This is a problem!!")
                return "Folder " + tmpPaths[index] + " doesn't exist!!!"
            }
        }

        //Get the spreadsheet with that weeks homework
        var files = curFolder.getFilesByName(hmwksheet + "_hmwk_" + num);
        if (files.hasNext() == false) {
          Logger.log("spreadsheet file for homework files doesn't exist!!!!! Perhaps you specified the wrong number of homeworks?")
          return "spreadsheet file for homework files doesn't exist!!!!! Perhaps you specified the wrong number of homeworks?"
        }
        else{
          var spreadsheet = SpreadsheetApp.open(files.next());
          var sheet = spreadsheet.getSheets()[0];
          
          //Format of the data in the sheet: [myDate, form.matrikulation, form.university,form.email,form.rateLecture, FileNameURL, form.question1, form.question2,form.question3,form.question4,form.question5, form.question6]
          
          var lastRow = sheet.getLastRow();
          var lastColumn = sheet.getLastColumn();
          
          //Get actual cell values
          var range = sheet.getRange(2, 1, lastRow, lastColumn);
          var data = range.getValues(); //grab all the values so we an iterate over them
          for (var m=0; m < data.length; ++m){
            var row = data[m];
            var matrikulationNum = row[1];
            if (matrikulationNum.length < 2){
              continue; // This row is meaningless without a good matrikulation number, go to the next.
            }
            var email = row[3]
            var hwmkLink = row[5]
            
            var numAnswered = 0;
            var numPrepQues = row.length - 6.0;
            for (var i =6; i < row.length; ++i){
              var text = "";
              try {
                text = (row[i]).toString().toLowerCase();
              }
              catch(err){
                text = (row[i]).toString().toLowerCase();
              }
              var defaultAns = "i don't know"
              if ((text.indexOf(defaultAns) == -1 && text.length > 2) || text == "0" ){
                numAnswered += 1;
              }
            }
            
            if (!( matrikulationNum in studentHmwkAnswers)){
              //If the matrik # isn't already in our dictionary, add it
              studentHmwkAnswers[matrikulationNum] = Array((numHmwk) * 2 + 2 + 1 ); // each hmwk consists of 2 pieces, plus spot for email address and mat num, 
              studentHmwkAnswers[matrikulationNum][0] = matrikulationNum;
              studentHmwkAnswers[matrikulationNum][1] = ""; //spot for emails, setting to a string to keep things easier later if there are multiple email addresses associated with a mat num
              studentHmwkLate[matrikulationNum] = Array((numHmwk) *2 + 1); //don't need to keep track of the email in this dictionary
            }
            if (studentHmwkAnswers[matrikulationNum][1].indexOf(email) == -1){
              if(studentHmwkAnswers[matrikulationNum][1] == ""){
                studentHmwkAnswers[matrikulationNum][1] = email;
              }
              else{
                studentHmwkAnswers[matrikulationNum][1] = studentHmwkAnswers[matrikulationNum][1] + "," + email;
              }
            }
            
            //Offset because we have two hmwk assignments per week, and the first cell is the email addresses ( could be multiple )
            studentHmwkAnswers[matrikulationNum][num * 2 + 2] = hwmkLink;
            if (numAnswered > 0){
              studentHmwkAnswers[matrikulationNum][num * 2 + 3] = numAnswered/numPrepQues;
            }
            else if( numPrepQues == 0 ){
              studentHmwkAnswers[matrikulationNum][num * 2 + 3] = "1.0";
            }
            else{
              studentHmwkAnswers[matrikulationNum][num * 2 + 3] = "0.0";
            }
            
            //Set information about rows that were late ( i.e. red background )
            var cell = sheet.getRange("B" + (m + 2)); //added one because spreadsheet is 1-based, and one because we skipped the first row
            var cell_back = cell.getBackground();
            if (cell.getBackground() == '#ff0000'){
              studentHmwkLate[matrikulationNum][num * 2] = 1;
              studentHmwkLate[matrikulationNum][num * 2 + 1] = 1;
            }
            else{
              studentHmwkLate[matrikulationNum][num * 2] = -1;
              studentHmwkLate[matrikulationNum][num * 2 + 1] = -1;

            }         
          }         
        }
        delete tmpPaths
    }
    //Fill in info about missing submissions and not answering 66%
    var keys = Object.keys(studentHmwkAnswers);
    for(var i=0; i < keys.length; ++i)
    {
      matrikulationNum = keys[i];
      for (num = 0; num <= numHmwk; ++num) {
        var isempty1 = !(studentHmwkAnswers[matrikulationNum][2 + (num *2)]);
        var isempty2 = !(studentHmwkAnswers[matrikulationNum][2 + (num *2) + 1]);
        var val1 = studentHmwkAnswers[matrikulationNum][2 + (num *2)];
        var val2 = studentHmwkAnswers[matrikulationNum][2 + (num *2) + 1];

        if (!(studentHmwkAnswers[matrikulationNum][2 + (num *2)])){
          studentHmwkLate[matrikulationNum][num * 2] = 2;
        }
        else if (studentHmwkAnswers[matrikulationNum][2 + (num *2)] == "NONE Submitted" ){
          studentHmwkLate[matrikulationNum][(num * 2)] = 2; //no submission
        }      
            
        if (!(studentHmwkAnswers[matrikulationNum][2 + (num *2) + 1]) ){
          studentHmwkLate[matrikulationNum][(num * 2) + 1] = 2; //No submission
        }
        else if (studentHmwkAnswers[matrikulationNum][2 + (num *2) + 1] == "0.0" ){
          studentHmwkLate[matrikulationNum][(num * 2) + 1] = 2; //no submission
        }
        else{
          if (parseFloat(studentHmwkAnswers[matrikulationNum][2 + (num *2) + 1])  < .65){
            studentHmwkLate[matrikulationNum][(num * 2) + 1] = 3; //Not sufficient attempt
          }
        }
        
        //Set information about not answering 66% of questions
        
      }
    }
    
    //Insert the data and color the cells for violations
    var sheet = SpreadsheetApp.open(DriveApp.getFileById(sId)).getSheets()[0];
    var headerRow = ["Mat Num", "Email"];
    for (var i = 0; i <= numHmwk; ++i){
      headerRow.push("HW " + i);
      headerRow.push("HW " + i + " Prep");
    }
    sheet.appendRow(headerRow);
    for ( var i=0; i < keys.length; ++i ){
      sheet.appendRow(studentHmwkAnswers[keys[i]])
      var lastRow = sheet.getLastRow();
      rowLookup[keys[i]] = lastRow;
      var numCols = studentHmwkLate[keys[i]].length
      
      for ( var idx = 0; idx <= numCols; idx += 1){  
        var submissionValue = studentHmwkLate[keys[i]][idx];
        if ( submissionValue == 1 ){ //Late submission
          var lateCell = sheet.getRange(lastRow, idx + 1 + 2); //1 b/c spreadsheet is 1-based, 2 b/c first two columns are mat num and email
          lateCell.setBackground("yellow");
          Logger.log("Found a yellow cell in row: " + lastRow + " col: " + idx + " for mat: " + keys[i])

        }
        if ( submissionValue == 2 ){ //Missing
          var lateCell = sheet.getRange(lastRow, idx + 1 + 2);
          lateCell.setBackground("red");
          Logger.log("Found a red cell in row: " + lastRow + " col: " + idx + " for mat: " + keys[i])

        }
        if ( submissionValue == 3 ){ //Not a sufficient attempt at prep questions
          var lateCell = sheet.getRange(lastRow, idx + 1 + 2);
          lateCell.setBackground('#f4aa42'); //orange
          Logger.log("Found a orange cell in row: " + lastRow + " col: " + idx + " for mat: " + keys[i])

        }

      }
    }
}