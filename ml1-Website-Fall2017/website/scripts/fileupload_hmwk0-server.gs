
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function submitFormInformation(form) {
  var pathNames = ["Machine_Learning1","Student_Homework", "Hmwk0"];
  //var questionsheet = "LectureQuestions_0"
  var hmwksheet = "SubmittedHmwk_hmwk_0"
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
    
    //var blob = form.myFile
    var myDate = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    //var namesplit = form.myFile.name.split(".")
    //var ending = namesplit[namesplit.length -1]
    //var mimetype = MimeType.PDF
    //if (ending != 'pdf'){
    //  mimetype = MimeType.ZIP
    //}
    //var new_name = "Hmwk1_" + form.matrikulation + "_" + myDate.replaceAll(" ","_").replaceAll(":","-").replaceAll("/","_").replaceAll(","," ") + "." + ending
    //Logger.log("Uploading " + new_name)
    //var file = folder.createFile(blob);
    //file.setName(new_name)
    //file.setDescription("Uploaded by " + form.email);// + form.myName);
    
    //Save Questions to Spreadsheet
//    for (index=0; index < pathNames.length; ++index){
//      var result = folder.getFoldersByName(pathNames[index])
//      if (result.hasNext()) {
//        folder = result.next();
//      }
//    }
    //var files = folder.getFilesByName(questionsheet);
    //if (files.hasNext()) {
    //   var spreadsheet = SpreadsheetApp.open(files.next());
    //   var sheet = spreadsheet.getSheets()[0];
    //   sheet.appendRow([form.questions])
    //   //Logger.log(sheet.getName());
    //}
    //else{
    //    return "Error with Question Saving.";
    //}
      
    //Save Hmwk info to spreadsheet
    var files = folder.getFilesByName(hmwksheet);
    if (files.hasNext()) {
       var spreadsheet = SpreadsheetApp.open(files.next());
       var sheet = spreadsheet.getSheets()[0];
       sheet.appendRow([myDate, form.matrikulation, form.university, form.email, form.rateLecture, "No Homework",form.question1, form.question2, form.question3, form.question4,form.question5_1, form.question5_2, form.question5_3, form.question5_4, form.question5_5, form.question5_6, form.question5_7, form.question5_8, form.question6, form.question7])
    }
    else{
       return "Error with Hmwk form saving...";
    }
    
        
    return "<html><head></head><body><h1>Submission Successful</h1><p></body></html>";
   
  } catch (error) {
    
    return error.toString();
  }
  
}

