const displayPromise = new Promise((res,rej)=>{
    if (6>3){
        res("Success message")
    }
    else{
        rej("Failed message")
    }
})

displayPromise.then((res)=>{console.log(res)}).catch((rej)=>{console.log(rej)})


const fs = require('fs');

async function createFile() {
  try {
    const content = 'This is the content of the new file!'
    const fileName = 'newFile.txt'

    await fs.promises.writeFile(fileName, content)

    console.log(`File "${fileName}" created successfully.`)
  } catch (error) {
    console.error('Error creating the file:', error.message)
  }
}

createFile();
