const shortid = require('shortid');
class Utils {
    
	static isEmpty(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	static userDashboradData (req_body){
		if(this.isEmpty(req_body)){
			return
		}
		let { firstname, lastname, email, number } = req_body;
		let fullname = `${firstname[0].toUpperCase()+firstname.slice(1).toLowerCase()} ${lastname[0].toUpperCase()+lastname.slice(1).toLowerCase()}`
		let userCode = shortid.generate();
		let uniqueUrl = `localhost:3000/user/${userCode}`
		return {
			fullname,
			userCode,
			email,
			number,
			uniqueUrl
		}

	}
}
module.exports = Utils;