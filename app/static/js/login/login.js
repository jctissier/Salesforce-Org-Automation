$(document).ready(function() {

	$('#login_user_btn').click(function(event) {
		$('#login-button').hide();
		$('#loading-gif').show();
		$.ajax({

			type: 'POST',
			url: '/login',
			data: {
				username: $('#inputUsername').val(),
				password: $('#inputPassword').val(),
				token: $('#inputToken').val()
			}

		})
		.done(function(data) {
			if (data.error) {
				console.log(data.error);
				$('#loading-gif').hide();
				$('#login-button').show();
				$('#errorAlert').text(data.error).show();
				$('#successAlert').hide();
			}
			else {
				$('#loading-gif').hide();
				$('#successAlert').text(data.success).show();
				$('#errorAlert').hide();
				window.location = "/dashboard";
			}

		});
		event.preventDefault();
    });


});
