class apiResponse{
    constructor(statusCode,data,message="succesfull"){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode<400;
    }
}

export default apiResponse;