const asyncHandler=function(handlerFunction){
    return async(req,res,next)=>{
        try {
            await handlerFunction(req,res,next);
            next();
        } catch (error) {
            console.log("error caught in asynchandler: ",error);
            next(error);
        }
    }
}

export default asyncHandler;