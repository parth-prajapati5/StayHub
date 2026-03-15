// class ExpressError extends Error{
//     constructor(statuscode,message){
//         super();
//         this.statuscode=statuscode;
//         this.message=message;
//     }
// }

// module.exports=ExpressError; 


class ExpressError extends Error {
  constructor(statuscode, message) {
    super(message);          // pass message to Error
    this.statuscode = statuscode;
  }
}

module.exports = ExpressError;
