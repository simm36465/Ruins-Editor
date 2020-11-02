const electron = require('electron');
const {app, BrowserWindow, ipcMain, dialog } = electron
const fs = require('fs')
const path = require('path')

let win
let pathfile = undefined
app.on('ready', ()=>{
    
    win = new BrowserWindow({
        frame: false,
        minHeight: 200,
        minWidth: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
          },
          
    })
    win.loadFile('index.html')
})
//button titlebar
ipcMain.on('minimize', ()=>{
    win.minimize()
})
ipcMain.on('close', ()=>{
    win.close();
})
ipcMain.on('maximize', ()=>{
    if(win.isMaximized()){
        win.unmaximize();
    }else{
        win.maximize();
    }
})
//save text

ipcMain.on('save', (event, text)=>{

    if(pathfile === undefined){
        dialog.showSaveDialog({ 
            //title: 'Select the File Path to save', 
            defaultPath: path.join(__dirname, '../assets/untitle.txt'), 
            // Restricting the user to only Text Files. 
            filters: [ 
                { 
                    name: 'Plain text file', 
                    extensions: ['txt'] 
                },
                { 
                    name: 'Rich Text Format', 
                    extensions: ['rtf'] 
                },
             ], 
            //properties: [] 
        }).then(file => { 
            // Stating whether dialog operation was cancelled or not. 
            if (!file.canceled) { 
                
                pathfile = file.filePath.toString()
                // Creating and Writing to the sample.txt file 
                writeToFile(text)
                const allcontent = {
                    path:pathfile,
                    content: text
                }
                win.webContents.send("openfilecontent", allcontent);
            } 
        }).catch(err => { 
            console.log(err) 
        }); 
    }else{
        writeToFile(text)
    }



})


//open file from computer
ipcMain.on("openfile", ()=>{
    const ofile = dialog.showOpenDialogSync({
        properties: ["openFile"],
    })
    if(ofile != undefined){
        
        const filecontent = fs.readFileSync(ofile.toString(), "utf-8");
        
        const allcontent = {
            path:ofile.toString(),
            content: filecontent
        }
        pathfile = ofile.toString()
        win.webContents.send("openfilecontent", allcontent);
    }else{
        //writeToFile(filecontent)
    }
    
})
function writeToFile(data){
    fs.writeFile(pathfile, 
        data,{encoding: 'utf8'}, function (err) { 
            if (err) throw err; 
            
        }); 
}
// Quit when all windows are closed. 
app.on('window-all-closed', () => { 
    // On macOS it is common for applications and their menu bar 
    // to stay active until the user quits explicitly with Cmd + Q 
    if (process.platform !== 'darwin') { 
      app.quit() 
    } 
  }) 