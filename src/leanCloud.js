import AV from 'leancloud-storage'
var APP_ID = 'Fon1CyKd3MjxRQpLkRczEln4-gzGzoHsz';
var APP_KEY = 'VfgQ2WKGyj0c8CXvj940qnqi';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

export default AV

export function signUp(username, password, successFn, errorFn){
	var user = new AV.User()
	user.setUsername(username)
	user.setUserPassword(password)
	user.signUp().then(function(loginedUser){
		let user = getUserFromAVUser(loginedUser)
		successFn.call(null, user)
	}, function(error){
		errorFn.call(null, error)
	})
	return undefined
}

function getUserFromAVUser(AVUser){
	console.log(1)
	
	return {
		id: AVUser.id,
		...AVUser.attributes
	}
}