//Simply call this function with the correct number of homeworks. It will create the needed directories
//and will not overwrite any of the files already there. - GWJ
function setupDirectoryStructureForMLHmwkForm() {
     var numHmwk = 12;
     var pathNames = ["Student_Homework", "Machine_Learning1"];
     var questionsheet = "LectureQuestions"
     var hmwksheet = "SubmittedHmwk"

     for (num=1; num <= numHmwk; ++num){
      var tmpPaths = pathNames.slice(0);
      tmpPaths.push(["Hmwk" + num])
      var curFolder = DriveApp.getRootFolder();
      for (index=0; index < tmpPaths.length; ++index){    
        Logger.log(tmpPaths[index])
        var result = curFolder.getFoldersByName(tmpPaths[index])
        Logger.log(result)
        if (result.hasNext()) {
          curFolder = result.next();
        } else {
          Logger.log("Creating folder " + tmpPaths[index])
          if (index == 0){
             curFolder = DriveApp.createFolder(tmpPaths[index]);
          }
          else{
             curFolder = curFolder.createFolder(tmpPaths[index]);
          }
        }
      }
    
      //Save Questions Spreadsheet
      var files = curFolder.getFilesByName(questionsheet+"_hmwk_"+num);
      if (files.hasNext() == false) {
         var ssNew = SpreadsheetApp.create(questionsheet+"_hmwk_"+num);
         var sId = ssNew.getId();
         var sheet = ssNew.getSheets()[0];
         sheet.appendRow(["Questions from the Lecture:"])
         var file = DriveApp.getFileById(sId);
         curFolder.addFile(file)
         DriveApp.getRootFolder().removeFile(file)
      }

         //Save Hmwk info spreadsheet
      var files = curFolder.getFilesByName(hmwksheet+"_hmwk_" +num);
      if (files.hasNext() == false) {
         var ssNew = SpreadsheetApp.create(hmwksheet+"_hmwk_"+num);
         var sId = ssNew.getId();
         var sheet = ssNew.getSheets()[0];
         sheet.appendRow(["Submit Time",	"Matriculation #",	"Email", "Tweet", "Lecture Rating",	"Hmwk Link"])
         var file = DriveApp.getFileById(sId);
         curFolder.addFile(file)
         DriveApp.getRootFolder().removeFile(file)
      }
      delete tmpPaths
   }
}
