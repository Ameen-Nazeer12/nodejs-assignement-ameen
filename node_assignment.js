const displayPromise = new Promise((res,rej)=>{
    if (6>3){
        res("Success message")
    }
    else{
        rej("Failed message")
    }
})

displayPromise.then((res)=>{console.log(res)}).catch((rej)=>{console.log(rej)})
