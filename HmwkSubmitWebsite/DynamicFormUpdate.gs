//bonus, gets values from first column of spreadsheet and returns them
function getValues(sheet) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(2, 3, lastRow);
  Logger.log(range)
  var values = range.getValues();
  Logger.log(values)
  var newValues = []
  for (var i=0; i < values.length; i++){
    Logger.log(values[i].toString().length)
    if (values[i].toString().length > 0){
       newValues.push(values[i])
    }
  }
  if ( newValues.length == 0 ){
    newValues.push("No Questions")
  }
  Logger.log(newValues) 
  return newValues;
}

//what you'll need to call initially to create the form, and store id in project properties
function createForm() {
  var values = getValues();
  var form = FormApp.create('Test Form');
  var list = form.addListItem();
  var listItems = list.setChoiceValues(values);
  Logger.log(listItems) 
  var formId = form.getId();

  PropertiesService.getScriptProperties().setProperty('formId', formId);
}

//use this to update on change event. Trigger can be created for this.
function updateForm() {
  
  var formId = PropertiesService.getScriptProperties().getProperty('formId');
  //var form = FormApp.openById(formId);
  var form = FormApp.openById('11KHEEtmaJCxbjGpa3qQtmKZ_5AYQS2TCa_LmIxaPK2g');
  var sheetId = form.getDestinationId();
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheets()[0];

  var values = getValues(sheet);
  var list = form.getItems(FormApp.ItemType.LIST)[0];
  var listItems = list.asListItem().setChoiceValues(values);
  
}