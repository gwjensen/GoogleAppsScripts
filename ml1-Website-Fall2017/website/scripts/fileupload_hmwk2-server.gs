
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function submitFormInformation(form, dueDate) {
  var pathNames = ["Machine_Learning1", "Student_Homework", "Hmwk2"];
  //var questionsheet = "LectureQuestions_hmwk_2"
  var hmwksheet = "SubmittedHmwk_hmwk_2"
  var timeNow = new Date()
  
  //I think using UTC on cthe client side should suffice, but if it doesn't we will have to use this code. -GWJ
  //This has to be done server side, otherwise it can be spoofed by changing your local computer time. :(
  //if ( timeNow.getTime() > dueDate.getTime() ){
  //  return "<font color='red'>Sorry, the due date has past.</font>"
  //}

  
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
    
    var blob = form.myFile
    var myDate = timeNow.toLocaleDateString() + " " + timeNow.toLocaleTimeString();
    var namesplit = form.myFile.name.split(".")
    var ending = namesplit[namesplit.length -1]
    var mimetype = MimeType.PDF
    if (ending != 'pdf'){
      mimetype = MimeType.ZIP
    }
    var new_name = "Hmwk2_" + form.matrikulation + "_" + myDate.replaceAll(" ","_").replaceAll(":","-").replaceAll("/","_").replaceAll(","," ") + "." + ending
    Logger.log("Uploading " + new_name)
    var file = folder.createFile(blob);
    file.setName(new_name)
    file.setDescription("Uploaded by " + form.email + "_" + form.matrikulation);// + form.myName);
    
    //Save Questions to Spreadsheet
//    for (index=0; index < pathNames.length; ++index){
//      var result = folder.getFoldersByName(pathNames[index])
//      if (result.hasNext()) {
//        folder = result.next();
//      }
//    }
//    var files = folder.getFilesByName(questionsheet);
//    if (files.hasNext()) {
//       var spreadsheet = SpreadsheetApp.open(files.next());
//       var sheet = spreadsheet.getSheets()[0];
//       sheet.appendRow([form.questions])
//       //Logger.log(sheet.getName());
//    }
//    else{
//        return "Error with Question Saving.";
//    }
      
    //Save Hmwk info to spreadsheet
    var files = folder.getFilesByName(hmwksheet);
    if (files.hasNext()) {
       var spreadsheet = SpreadsheetApp.open(files.next());
       var sheet = spreadsheet.getSheets()[0];
       sheet.appendRow([myDate, form.matrikulation, form.university,form.email,form.rateLecture, file.getUrl(), form.question1, form.question2,form.question3,form.question4])
    }
    else{
       return "Error with Hmwk form saving...";
    }
    
    message = "Submission time: " + myDate + "\n" +
      "Matriculation #: " + form.matrikulation + "\n" +
        "University: " + form.university + "\n\n" +
          "submitted file: " + form.myFile.getName() + "\n\n" +
            "question1: " + form.question1 + "\n\n" +
              "question2: " + form.question2 + "\n\n" +
                "question3: " + form.question3 + "\n\n" +
                  "question4: " + form.question4 + "\n\n" ;
    
    MailApp.sendEmail(form.email, "Homework 2 Submission", message);
        
    
    return "<h1>Submission Successful - A confirmation email will arrive shortly.</h1>"
   
  } catch (error) {
    
    return error.toString();
  }
  
}

