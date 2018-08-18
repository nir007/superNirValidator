# superNirValidator
jQuery plugin form validator


validFields = {
		Email: {
			type: 'email'
		},
		Password: {
			type: 'password',
			equal: ['ConfirmPassword']
		}
	};


form.superNirValidator(validFields)

returns true or array of errors
