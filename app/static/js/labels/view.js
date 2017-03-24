$(document).ready(function() {

	// $('#ajax_login').click(function(event) {
		$.ajax({
			type: 'POST',
			url: '/custom-labels/track'
		})
		.done(function(data) {
			if (data.error) {
				console.log(data.error);
				$('#loading-gif').hide();
				$('#errorAlert').text(data.error).show();
				$('#successAlert').hide();

			}
			else {
				console.log(data.success);
				var message = 'Logged in to ' + data.instance + ": " + data.success;
				$('#loading-gif').hide();
				$('#successAlert').text(message).show();
				$('#display-labels-content').show();
				$('#errorAlert').hide();
			}
		});
		// event.preventDefault();
    // });

});
