//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Simply call this function with the correct number of homeworks. It will create the needed directories
//and will not overwrite any of the files already there. If you have more tutorials than hmwks, then adjust
// accordingly - GWJ
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setupDirectoryStructureForMLHmwkForm() {
    var numHmwk = 11;
    var hmwkPathNames = ["Machine_Learning1", "Student_Homework"];
    var hmwksheet = "SubmittedHmwk"

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //Setup the files and directories for the homework submissions.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for (num = 0; num <= numHmwk; ++num) {
        var tmpPaths = hmwkPathNames.slice(0);
        tmpPaths.push(["Hmwk" + num])
        var curFolder = DriveApp.getRootFolder();

        //This for loop just walks Drive's tree structure so we are in the folder we want to be in, otherwise it creates it.
        for (index = 0; index < tmpPaths.length; ++index) {
            Logger.log(tmpPaths[index])
            var result = curFolder.getFoldersByName(tmpPaths[index])
            Logger.log(result)
            if (result.hasNext()) {
                curFolder = result.next();
            } else {
                Logger.log("Creating folder " + tmpPaths[index])
                if (index == 0) {
                    curFolder = DriveApp.createFolder(tmpPaths[index]);
                } else {
                    curFolder = curFolder.createFolder(tmpPaths[index]);
                }
            }
        }

        //Save Hmwk info spreadsheet
        var files = curFolder.getFilesByName(hmwksheet + "_hmwk_" + num);
        if (files.hasNext() == false) {
            var ssNew = SpreadsheetApp.create(hmwksheet + "_hmwk_" + num);
            var sId = ssNew.getId();
            var sheet = ssNew.getSheets()[0];
          
            //This ordering is pretty fixed, if you change it here you have to change it in the forms on the website. - GWJ
            sheet.appendRow(["Submit Time", "Matriculation #", "School", "Email", "Lecture Rating", "Hmwk Link", "Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9", "Question 10", "Question 11", "Question 12", "Question 13", "Question 14", "Question 15"])
            var file = DriveApp.getFileById(sId);
            curFolder.addFile(file)
            DriveApp.getRootFolder().removeFile(file)
        }
        delete tmpPaths

    }
}

  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Setup the directory for the Lecture files
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setupDirectoryStructureForLectureQuestionsForm() {
    var numHmwk = 11;
    var lecturePathNames = ["Machine_Learning1", "Lecture_Questions"]
    var questionsheet = "QuestionsDuring"
    for (num = 0; num <= numHmwk; ++num) {
        var tmpPaths = lecturePathNames.slice(0);
        tmpPaths.push(["Lecture" + num])
        var curFolder = DriveApp.getRootFolder();
      
        //This for loop just walks Drive's tree structure so we are in the folder we want to be in, otherwise it creates it.
        for (index = 0; index < tmpPaths.length; ++index) {
            Logger.log(tmpPaths[index])
            var result = curFolder.getFoldersByName(tmpPaths[index])
            Logger.log(result)
            if (result.hasNext()) {
                curFolder = result.next();
            } else {
                Logger.log("Creating folder " + tmpPaths[index])
                if (index == 0) {
                    curFolder = DriveApp.createFolder(tmpPaths[index]);
                } else {
                    curFolder = curFolder.createFolder(tmpPaths[index]);
                }
            }
        }

        //Copy Question Spreadsheet Template and Form Template to new directory and rename
        //Then link the form to the spreadsheet, and set up the triggers for the spreadsheet.(not able to do triggers see note below)
        var filename = questionsheet + "Lecture" + "_" + num;
        var files = curFolder.getFilesByName(questionsheet + "Lecture" + "_" + num);
        if (files.hasNext() == false) {
            var sheetPaths = DriveApp.getFilesByName("ClassQuestionsTemplate")
            var sheetPathArray = [];
          
            //Nested Structure to stop construction of files if we have errors.
            //Lets copy the spreadsheet for the form
            while(sheetPaths.hasNext()){
                sheetPathArray.push(sheetPaths.next())  
            }
            if (sheetPathArray.length != 1){
                Logger.log("There are two files names 'ClassQuestionsTemplate' in the drive folder structure. This is not good! Num:" + sheetPaths.length);
            }
            else{
                var templateSheet = sheetPathArray[0];
                var ssNew = templateSheet.makeCopy(filename, curFolder)
                
                Logger.log("Let's copy the form")
                var formPaths = DriveApp.getFilesByName("QuestionsFormTemplate")
                var formPathArray = [];
                while(formPaths.hasNext()){
                    formPathArray.push(formPaths.next())  
                }
                if (formPathArray.length != 1){
                  Logger.log("There are two files names 'QuestionsFormTemplate' in the drive folder structure. This is not good! Num:" + formPaths.length);
                }
                else{
                    templateSheet = formPathArray[0];
                    var formNew = templateSheet.makeCopy("Questions During Lecture " + num, curFolder)
                    
                    Logger.log("Now lets link the form to the spreadsheet.")
                    var form = FormApp.openById(formNew.getId());
                    form.setDestination(FormApp.DestinationType.SPREADSHEET, ssNew.getId());

                    //I wanted to be able to install the triggers for the spreadsheet here as well, but it turns out that is not possible
                    //In order to install the triggers, you have to open the spreadsheet, and in the file menu you will find a Menu called
                    //  "Install Triggers". Click the only option in that menu and you will be prompted for authorizations, accept everything,
                    // and the triggers will be installed correctly. - GWJ
                }
            }
        }
        delete tmpPaths

    }
}
  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    //Setup the directory for the Tutorial files
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setupDirectoryStructureForTutorialQuestionsForm() {
    var numTutorials = 11;
    var tutorialPathNames = ["Machine_Learning1", "Tutorial_Questions"]
    var questionsheet = "QuestionsDuring"
    for (num = 0; num <= numTutorials; ++num) {
        var tmpPaths = tutorialPathNames.slice(0);
        tmpPaths.push(["Tutorial_" + num])
        var curFolder = DriveApp.getRootFolder();
      
        //This for loop just walks Drive's tree structure so we are in the folder we want to be in, otherwise it creates it.
        for (index = 0; index < tmpPaths.length; ++index) {
            Logger.log(tmpPaths[index])
            var result = curFolder.getFoldersByName(tmpPaths[index])
            Logger.log(result)
            if (result.hasNext()) {
                curFolder = result.next();
            } else {
                Logger.log("Creating folder " + tmpPaths[index])
                if (index == 0) {
                    curFolder = DriveApp.createFolder(tmpPaths[index]);
                } else {
                    curFolder = curFolder.createFolder(tmpPaths[index]);
                }
            }
        }

        //Copy Question Spreadsheet Template and Form Template to new directory and rename
        //Then link the form to the spreadsheet, and set up the triggers for the spreadsheet.(not able to do triggers see note below) 
        var filename = questionsheet + "Tutorial" + "_" + num;
        var files = curFolder.getFilesByName(filename)
        if (files.hasNext() == false) {
            var sheetPaths = DriveApp.getFilesByName("ClassQuestionsTemplate")
            var sheetPathArray = [];
          
            //Nested Structure to stop construction of files if we have errors.
            //Lets copy the spreadsheet for the form
            while(sheetPaths.hasNext()){
                sheetPathArray.push(sheetPaths.next())  
            }
            if (sheetPathArray.length != 1){
                Logger.log("There are two files names 'ClassQuestionsTemplate' in the drive folder structure. This is not good! Num:" + sheetPaths.length);
            }
            else{
                var templateSheet = sheetPathArray[0];
                var ssNew = templateSheet.makeCopy(filename, curFolder)
                
                Logger.log("Let's copy the form")
                var formPaths = DriveApp.getFilesByName("QuestionsFormTemplate")
                var formPathArray = [];
                while(formPaths.hasNext()){
                    formPathArray.push(formPaths.next())  
                }
                if (formPathArray.length != 1){
                  Logger.log("There are two files names 'QuestionsFormTemplate' in the drive folder structure. This is not good! Num:" + formPaths.length);
                }
                else{
                    templateSheet = formPathArray[0];
                    var formNew = templateSheet.makeCopy("Questions During Tutorial " + num, curFolder)
                    
                    Logger.log("Now lets link the form to the spreadsheet.")
                    var form = FormApp.openById(formNew.getId());
                    form.setDestination(FormApp.DestinationType.SPREADSHEET, ssNew.getId());

                    //I wanted to be able to install the triggers for the spreadsheet here as well, but it turns out that is not possible
                    //In order to install the triggers, you have to open the spreadsheet, and in the file menu you will find a Menu called
                    //  "Install Triggers". Click the only option in that menu and you will be prompted for authorizations, accept everything,
                    // and the triggers will be installed correctly. - GWJ
                }
            }
        }
        delete tmpPaths

    }
}