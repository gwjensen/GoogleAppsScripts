
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function submitFormInformation(form) {
  var pathNames = ["Student_Homework", "Machine_Learning1", "Hmwk1"];
  var questionsheet = "LectureQuestions"
  var hmwksheet = "SubmittedHmwk"
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
    var myDate = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    var namesplit = form.myFile.name.split(".")
    var ending = namesplit[namesplit.length -1]
    var mimetype = MimeType.PDF
    if (ending != 'pdf'){
      mimetype = MimeType.ZIP
    }
    var new_name = "Hmwk1_" + form.matrikulation + "_" + myDate.replaceAll(" ","_").replaceAll(":","-").replaceAll("/","_").replaceAll(","," ") + "." + ending
    Logger.log("Uploading " + new_name)
    var file = folder.createFile(blob);
    file.setName(new_name)
    file.setDescription("Uploaded by " + form.email);// + form.myName);
    
    //Save Questions to Spreadsheet
    for (index=0; index < pathNames.length; ++index){
      var result = folder.getFoldersByName(pathNames[index])
      if (result.hasNext()) {
        folder = result.next();
      }
    }
    var files = folder.getFilesByName(questionsheet);
    if (files.hasNext()) {
       var spreadsheet = SpreadsheetApp.open(files.next());
       var sheet = spreadsheet.getSheets()[0];
       sheet.appendRow([form.questions])
       //Logger.log(sheet.getName());
    }
    else{
        return "Error with Question Saving.";
    }
      
    //Save Hmwk info to spreadsheet
    var files = folder.getFilesByName(hmwksheet);
    if (files.hasNext()) {
       var spreadsheet = SpreadsheetApp.open(files.next());
       var sheet = spreadsheet.getSheets()[0];
       sheet.appendRow([myDate, form.matrikulation,form.email,form.tweet,form.rateLecture, file.getUrl()])
    }
    else{
       return "Error with Hmwk form saving...";
    }
    
        
    return "<html><head></head><body><h1>Submission Successful</h1><p></body></html>"
   
  } catch (error) {
    
    return error.toString();
  }
  
}

