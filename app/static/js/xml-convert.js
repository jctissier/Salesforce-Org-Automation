$(document).ready(function() {

	$('#upload-file-btn-xml').click(function(event) {
		var form_data = new FormData($('#upload-file-xml')[0]);
		console.log(form_data);
		$.ajax({
			type: 'POST',
			url: '/create-csv',
			data: form_data,
			contentType: false,
			cache: false,
			processData: false,
			async: false,
		})
		.done(function(data) {
			if (data.error) {
				console.log(data.error);
				console.log(data.error2);
				console.log(data.error3);
				$('#errorDiv-xml').show();
				$('#errorAlert-xml').text(data.error).show();
				$('#download-file-btn-xml').hide();
				if (data.error2 == '') {
					$('#errorAlertDetail-xml').hide();
				}
				else {
					$('#errorAlertDetail-xml').text(data.error2).show();
				}
				if (data.error3 == '') {
					$('#err_msg3-xml').hide();
				}
				else {
					$('#err_msg3-xml').text(data.error3).show();
				}

				$('#successAlert-xml').hide();
			}
			else {
				$('#successAlert-xml').text("Success! Created " + data.detail + " Rows. Copy the data or download the CSV file").show();
				$('#textdata-xml').val(data.success);
				$('#download-file-btn-xml').show();
				$('#errorDiv-xml').hide();
			}

		});
		event.preventDefault();
    });

});
