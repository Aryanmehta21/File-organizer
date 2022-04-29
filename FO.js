// Taking input in javaScript is done in process.argv[] array.

const fs = require("fs"); //fs module imported
const { dirname } = require("path");
const path = require("path"); //path module imported.

let input = process.argv.slice(2);
let inputArr = input;
let command = inputArr[0];


let types = {
    media: ["mp4", "mkv", "mp3","jpg" ],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: [
      "docx",
      "doc",
      "pdf",
      "xlsx",
      "xls",
      "odt",
      "ods",
      "odp",
      "odg",
      "odf",
      "txt",
      "ps",
      "tex",
    ],
    app: ["exe", "dmg", "pkg", "deb"],
  };

switch (command) {
  case "tree":
    treeFn(inputArr[1])
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    //  help function will list all the ways by which you can run the commands.
    helpFn();
    break;
  default:
    console.log("Please enter a valid command");
    break;
}

function helpFn() {
  console.log(`list of all the commands-> 
                              1)Tree -node FO.js tree <dirPath>
                              2)Organize -node FO.js organize <dirPath> 
                              3)Help -node FO.js help`);
}
// Organize function will organize all your target folder's files in different folders according to thier extensions.
function organizeFn(dirPath) {  //We need a directory path as parameter.
  let destPath;
  if (dirPath == undefined) {
    console.log("please enter a valid Directory Path");
    return;
  } //Check if directory path is passed or not and if not then simply return.

  let doesExist = fs.existsSync(dirPath);
  // This doesExist will tell the target folder exists or not

  // Check whether in a given destPath does a folder exists with the same name.And if does not make a folder.
  if (doesExist == true) {
    destPath = path.join(dirPath, "organized_files");

    if (fs.existsSync(destPath) == false) {
      fs.mkdirSync(destPath);
    } else {
      console.log("Folder Already Exists");
    }
  } else {
    console.log("Please Enter A valid Path");
  }
  organizeHelper(dirPath,destPath)
}


function organizeHelper(src,dest){
    let childNames=fs.readdirSync(src)
    // read all files and folders.
    console.log(childNames)
    for(let i=0;i<childNames.length;i++){
        let childAddress=path.join(src,childNames[i]) //Address of files/folders.
        let isFile=fs.lstatSync(childAddress).isFile() //Check for files and folders.

        if(isFile==true){
        let fileCategory= getCategory(childNames[i])
        console.log(childNames[i]+' belongs to '+ fileCategory)
        sendFiles(childAddress,dest,fileCategory)
        }
    }
}

function getCategory(FileName){
  let ext=path.extname(FileName).slice(1)
//  We extracted the extention name of the target files.
 for(let key in types){
   let cTypeArr=types[key]
  // We took out all the  Category type Arrays here.
  //  console.log(cTypeArr)

   for(let i=0;i<cTypeArr.length;i++){
    if(ext==cTypeArr[i]){
      return key;
    }
     }
 }
return 'others'

}

function sendFiles(srcFilePath,dest,fileCategory){
  // we will create path for each category file encountered to create folders of their names.
 let catPath=path.join(dest,fileCategory)

if(fs.existsSync(catPath)==false){
  fs.mkdirSync(catPath)
}

let fileName= path.basename(srcFilePath)
// We took out the basename of all the files.

let destFilePath= path.join(catPath,fileName)
fs.copyFileSync(srcFilePath,destFilePath)
fs.unlinkSync(srcFilePath)
console.log("Files organized")
}

function treeFn(dirPath){
if(dirPath==undefined){
  console.log("please enter a valid path")
  return;
}
else{
 let doesExist=fs.existsSync(dirPath);
  if (doesExist==true){
    treeHelper(dirPath,' ')
  }
}

}

function treeHelper(targetPath,indent){
  // Now a folder can contain both files as well as folder in it

  let isFile= fs.lstatSync(targetPath).isFile()  //Check for files.


  if(isFile==true){
    let fileName=path.basename(targetPath)
    console.log(indent+ "├──"+fileName)
  }

else{
  let dirName=path.basename(targetPath) //checks for folder name
  console.log(indent+ "└──"+dirName);

  let children= fs.readdirSync(targetPath)
  
  for(let i=0;i<children.length;i++){
    let childpath=path.join(targetPath,children[i])

    treeHelper(childpath , indent +"\t")
  }
}






}
