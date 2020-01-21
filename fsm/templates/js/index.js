import {login} from './login'
import {fsm} from './fsm'

String.prototype.title = function() {
	return this.replace(/\w\/|\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

if (window.location.href.includes('login')) {
    login()
}
else {
    fsm()
}
