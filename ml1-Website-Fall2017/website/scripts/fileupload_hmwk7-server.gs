
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function submitFormInformation(form) {
  var hmwkNum = "7";
  var pathNames = ["Machine_Learning1", "Student_Homework", "Hmwk" + hmwkNum];
  //var questionsheet = "LectureQuestions_hmwk_" + hmwkNum
  var hmwksheet = "SubmittedHmwk_hmwk_" + hmwkNum
  var timeNow = new Date();
  var myDate = timeNow.toLocaleDateString() + " " + timeNow.toLocaleTimeString();

  Logger.log("\n\ntime now: " + timeNow.getTime())
  var dueDate = new Date(Number(form.time));
  Logger.log("due date: " + dueDate.getTime() + "\n\n")

  var late = false;
  
  //This has to be done server side, otherwise it can be spoofed by changing your local computer time. :(
  if ( timeNow.getTime() > dueDate.getTime() ){
     late = true;  
  }
  
  try {
    var folder = DriveApp.getRootFolder();    
    
    for (index=0; index < pathNames.length; ++index){
      var result = folder.getFoldersByName(pathNames[index])
      if (result.hasNext()) {
        folder = result.next();
      } else {
        folder = DriveApp.createFolder(pathNames[index]);
      }
    }
    var FileNameURL = "";
    var file;
    Logger.log("Form No Hmwk:" + form.no_hmwk);
    if (form.no_hmwk == "NONE"){
        FileNameURL = "NONE Submitted";
    }
    else{
        var blob = form.myFile
        var namesplit = form.myFile.name.split(".")
        var ending = namesplit[namesplit.length -1]
        var mimetype = MimeType.PDF
        if (ending != 'pdf'){
          mimetype = MimeType.ZIP
        }
        var new_name = "Hmwk" +hmwkNum +"_" + form.matrikulation + "_" + myDate.replaceAll(" ","_").replaceAll(":","-").replaceAll("/","_").replaceAll(","," ") + "." + ending
        Logger.log("Uploading " + new_name)
        file = folder.createFile(blob);
        file.setName(new_name)
        file.setDescription("Uploaded by " + form.email + "_" + form.matrikulation);// + form.myName);
        FileNameURL = file.getUrl();
    }
    
    //Save Hmwk info to spreadsheet
    var files = folder.getFilesByName(hmwksheet);
    if (files.hasNext()) {
       var spreadsheet = SpreadsheetApp.open(files.next());
       var sheet = spreadsheet.getSheets()[0];
       sheet.appendRow([myDate, form.matrikulation, form.university,form.email,form.rateLecture, FileNameURL, form.question1, form.question2,form.question3,form.question4,form.question5])
       if (late){
          var lastRow = sheet.getDataRange().getLastRow();
          sheet.getRange(lastRow, 1, 1, 20).setBackground("red")
       }
    }
    else{
       return "<h1><font color='red'>Error with Hmwk form saving...</h1>";
    }
    var message = "";
    if (late){
       message = "This homework was submitted after the deadline.\n\n";
    }
    var submittedFileName = "";
    if (form.no_hmwk == "NONE"){
        submittedFileName = FileNameURL;
    }
    else{
        submittedFileName = form.myFile.getName();
    }
    message = message + "Submission time: " + myDate + "\n" +
      "Matriculation #: " + form.matrikulation + "\n" +
        "University: " + form.university + "\n\n" +
          "submitted file: " + submittedFileName + "\n\n" +
            "question1: " + form.question1 + "\n\n" +
              "question2: " + form.question2 + "\n\n" +
                "question3: " + form.question3 + "\n\n" +
                  "question4: " + form.question4 + "\n\n" +
                  "question5: " + form.question5 + "\n\n";
    
    MailApp.sendEmail(form.email, "Homework " + hmwkNum + " Submission", message);
        
    var returnMessage = "<h1> Server Side Error</h1>";
    if (late){
      returnMessage = "<h1><font color='red'>Your submission was received, but it was past the deadline. - A confirmation email will arrive shortly.</h1>"
    }
    else{
      returnMessage = "<h1><font color='green'>Submission Successful - A confirmation email will arrive shortly.</h1>"  
    }
    return returnMessage;
   
  } catch (error) {
    
    return error.toString();
  }
  
}

