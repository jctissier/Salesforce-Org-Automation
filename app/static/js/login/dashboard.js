$(document).ready(function() {
	/* 		Globals		*/
	var c_list = [];


	$('#dashboard').show();
	$.ajax({
		type: 'POST',
		url: '/dashboard-ajax'
	})
		.done(function (data) {
			if (data.error) {
				console.log(data.error);
				$('#loading-gif').hide();
				$('#errorAlert').show();

			}
			else {
				console.log(data.success);
				$('#loading-gif').hide();
				$('#content').show();													//content div
				$('#nav-tabs').show();

				/* Set Globals */
				c_list = data.c_list;


				/* Create Package.xml */
				$('#panel-users-detail-test').append(create_xml_list_custom(data.c_list, "Custom_Object"));
				$('#custom-object-list').append(create_xml_list_custom(data.c_list, "Custom_Object"));
				$('#apex-classes-list').append(create_xml_list(data.cl_list, "Apex_Class"));
				$('#apex-components-list').append(create_xml_list(data.comp_list, "Apex_Component"));
				$('#apex-pages-list').append(create_xml_list(data.pa_list, "Apex_Page"));
				$('#apex-triggers-list').append(create_xml_list(data.t_list, "Apex_Trigger"));


				/*  AJAX data return  */
				$('#ajax-c_size').text(data.c_size).show();								//main panel
				$('#ajax-c_size_detail').text(data.c_size).show();
				$('#ajax-c_size_preview').text(data.c_size).show();
				$('#panel-custom-object-detail').append(custom_object(data.c_list));	//panel rows

				$('#ajax-u_size').text(data.u_size).show();
				$('#ajax-u_size_detail').text(data.u_size).show();
				$('#panel-users-detail').append(sobjects(data.u_list));

				$('#ajax-p_size').text(data.p_size).show();
				$('#ajax-p_size_detail').text(data.p_size).show();
				$('#panel-profiles-detail').append(sobjects(data.p_list));

				$('#ajax-ur_size').text(data.ur_size).show();
				$('#ajax-ur_size_detail').text(data.ur_size).show();
				$('#panel-roles-detail').append(sobjects(data.ur_list));

				$('#ajax-cl_size').text(data.cl_size).show();
				$('#ajax-cl_size_detail').text(data.cl_size).show();
				$('#ajax-cl_size_preview').text(data.cl_size).show();
				$('#panel-classes-detail').append(sobjects(data.cl_list));

				$('#ajax-pa_size').text(data.pa_size).show();
				$('#ajax-pa_size_detail').text(data.pa_size).show();
				$('#ajax-pa_size_preview').text(data.pa_size).show();
				$('#panel-pages-detail').append(sobjects(data.pa_list));

				$('#ajax-comp_size').text(data.comp_size).show();
				$('#ajax-comp_size_detail').text(data.comp_size).show();
				$('#ajax-comp_size_preview').text(data.comp_size).show();
				$('#panel-components-detail').append(sobjects(data.comp_list));

				$('#ajax-t_size').text(data.t_size).show();
				$('#ajax-t_size_detail').text(data.t_size).show();
				$('#ajax-t_size_preview').text(data.t_size).show();
				$('#panel-triggers-detail').append(sobjects(data.t_list));


				$('#errorAlert').hide();
			}
		});

	// AJAX requests - Preview Button (Generate XML -> code block)
	$('#preview-xml-btn').click(function (event) {
		var apex_classes = remove_empty($("#apex-classes-list").children().map(function() { return this.id; }).get());
		var apex_components = remove_empty($("#apex-components-list").children().map(function() { return this.id; }).get());
		var apex_pages = remove_empty($("#apex-pages-list").children().map(function() { return this.id; }).get());
		var apex_triggers = remove_empty($("#apex-triggers-list").children().map(function() { return this.id; }).get());

		console.log(apex_classes);
		console.log(apex_components);
		console.log(apex_pages);
		console.log(apex_triggers);

		var ids = [];
		$("input:checkbox:checked").each(function(){
			ids.push($(this).attr('value'));
		});
		console.log(ids);

		var json_data={};
		for(i in ids)
		{
			json_data[i] = ids[i];
		}

    	//Stringify this object and send it to the server
    	json_data= JSON.stringify(json_data);

        $.ajax({
            type: 'POST',
            url: '/package-xml-ajax',
            data: {
                list_ids: json_data
            }
        })
            .done(function (data) {
                if (data.error) {
                    console.log(data.error);
                    $('#errorAlert').text(data.error).show();
                }
                else {
                    console.log(data.code);
					var content = '<pre class="language-xml" id="textdata"><span class="pun">&lt;?</span><span class="pln">xml version</span><span class="pun">=</span><span class="str">"1.0"</span><span class="pln"> encoding</span><span class="pun">=</span><span class="str">"UTF-8"</span><span class="pun">?&gt;</span><span class="pln"></span><br><span class="pln"></span><span class="tag">&lt;Package</span><span class="pln"> </span><span class="atn">xmlns</span><span class="pun">=</span><span class="atv">"http://soap.sforce.com/2006/04/metadata"</span><span class="tag">&gt;</span><span class="pln"></span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;types&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Custom_Object_Quarterly_Ops_Excellence_Visit__c</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Custom_Object_Store_Visit__c</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;name&gt;</span><span class="pln">CustomObject</span><span class="tag">&lt;/name&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;/types&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;types&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Page_PCT_SurveyPage</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Page_PCT_TestPage</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;name&gt;</span><span class="pln">ApexPage</span><span class="tag">&lt;/name&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;/types&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;types&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Class_ZVFSignaturePadControllerTest</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Class_PCT_Survey_ReadOnly_SummaryCtrl</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Class_DynamicObjectHandlerTest</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;name&gt;</span><span class="pln">ApexClass</span><span class="tag">&lt;/name&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;/types&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;types&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Component_PCT_CustomerScoresResult</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;members&gt;</span><span class="pln">Apex_Component_PCT_StoreVisitSurveyResult</span><span class="tag">&lt;/members&gt;</span><br><span class="pln">&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="tag">&lt;name&gt;</span><span class="pln">ApexComponent</span><span class="tag">&lt;/name&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;/types&gt;</span><br><span class="pln">&nbsp; &nbsp; </span><span class="tag">&lt;version&gt;</span><span class="pln">34.0</span><span class="tag">&lt;/version&gt;</span><span class="pln"></span><br><span class="tag">&lt;/Package&gt;</span><br>';

					$('#textpredata').next().remove();								// remove the old one
					$('#textpredata').after($(data.code));							// add the content together


                    $('#errorAlert').hide();
                }

            });
        event.preventDefault();
    });


/* Button Clicks Jquery functions */
// TODO - Add second buttons for hiding details

	// Custom Object Panel
	$('#panel-custom-object-btn').click(function() {
		$('#panel-custom-object').fadeIn();
	});
	$('#panel-custom-object-hide-btn').click(function() {
		$('#panel-custom-object').fadeOut();
	});

	// Users Panel
	$('#panel-users-btn').click(function() {
		$('#panel-users').fadeIn();
	});
	$('#panel-users-hide-btn').click(function() {
		$('#panel-users').fadeOut();
	});

	// Profiles Panel
	$('#panel-profiles-btn').click(function() {
		$('#panel-profiles').fadeIn();
	});
	$('#panel-profiles-hide-btn').click(function() {
		$('#panel-profiles').fadeOut();
	});

	// Roles Panel
	$('#panel-roles-btn').click(function() {
		$('#panel-roles').fadeIn();
	});

	$('#panel-roles-hide-btn').click(function() {
		$('#panel-roles').fadeOut();
	});

	// Apex Classes Panel
	$('#panel-classes-btn').click(function() {
		$('#panel-classes').fadeIn();
	});
	$('#panel-classes-hide-btn').click(function() {
		$('#panel-classes').fadeOut();
	});

	// Apex Pages Panel
	$('#panel-pages-btn').click(function() {
		$('#panel-pages').fadeIn();
	});
	$('#panel-pages-hide-btn').click(function() {
		$('#panel-pages').fadeOut();
	});

	// Apex Components Panel
	$('#panel-components-btn').click(function() {
		$('#panel-components').fadeIn();
	});
	$('#panel-components-hide-btn').click(function() {
		$('#panel-components').fadeOut();
	});

	// Apex Triggers Panel
	$('#panel-triggers-btn').click(function() {
		$('#panel-triggers').fadeIn();
	});
	$('#panel-triggers-hide-btn').click(function() {
		$('#panel-triggers').fadeOut();
	});

	//Logout button
	$('#logout-btn').click(function() {
		window.location = "/logout";
	});

	//Switch between Tabs on Dasbhoard
	$('#dashboard-tab').click(function() {
		$('#create-package-xml').hide();
		$('#dashboard').fadeIn();
		$('#create-package-xml').removeClass("active");
	});
	$('#package-xml-tab').click(function() {
		$('#dashboard').hide();
		$('#create-package-xml').fadeIn();
		$('#dashboard').removeClass("active");
	});

	// Preview the Package.xml data
	// $('#preview-xml').click(function() {
	// 	var apex_classes = remove_empty($("#apex-classes-list").children().map(function() { return this.id; }).get());
	// 	var apex_components = remove_empty($("#apex-components-list").children().map(function() { return this.id; }).get());
	// 	var apex_pages = remove_empty($("#apex-pages-list").children().map(function() { return this.id; }).get());
	// 	var apex_triggers = remove_empty($("#apex-triggers-list").children().map(function() { return this.id; }).get());
    //
	// 	console.log(apex_classes);
	// 	console.log(apex_components);
	// 	console.log(apex_pages);
	// 	console.log(apex_triggers);
    //
	// 	var yourArray = [];
	// 	$("input:checkbox:checked").each(function(){
	// 		yourArray.push($(this).attr('value'));
	// 	});
	// 	console.log(yourArray);
    //
	// 	console.log($(apex_classes[0]).is(':checked'));
	// 	console.log($('#Apex_Class0').is(':checked'));
	// 	console.log($(apex_classes[0]).val());
	// });


/**
 * Search Function for Data Tables
*/
(function(){
    'use strict';
	var $ = jQuery;
	$.fn.extend({
		filterTable: function(){
			return this.each(function(){
				$(this).on('keyup', function(e){
					$('.filterTable_no_results').remove();
					var $this = $(this),
                        search = $this.val().toLowerCase(),
                        target = $this.attr('data-filters'),
                        $target = $(target),
                        $rows = $target.find('tbody tr');

					if(search == '') {
						$rows.show();
					} else {
						$rows.each(function(){
							var $this = $(this);
							$this.text().toLowerCase().indexOf(search) === -1 ? $this.hide() : $this.show();
						})
						if($target.find('tbody tr:visible').size() === 0) {
							var col_count = $target.find('tr').first().find('td').size();
							var no_results = $('<tr class="filterTable_no_results"><td colspan="'+col_count+'">No results found</td></tr>')
							$target.find('tbody').append(no_results);
						}
					}
				});
			});
		}
	});
	$('[data-action="filter"]').filterTable();
})(jQuery);
	
});


/* Helper Functions */

function custom_object(c_list) {
	var start = '<tr>';
	var end = '</tr>';
	var col = '';
	console.log(c_list);
	console.log(c_list[0]);
	console.log(c_list.length);
	for(var i=0; i < c_list.length; i++)
		col += start + '<td>' + c_list[i] + '</td>' + end;
	console.log(col);
	return col;
}


function sobjects(list) {
	var start = '<tr>';
	var end = '</tr>';
	var col = '';
	console.log(list);
	console.log(list[0]);
	console.log(list.length);
	for(var i=0; i < list[0].length; i++)
		col += start + '<td>' + list[1][i] + '</td>\n' + '<td>' + list[0][i] + '</td>' + end;
	console.log(col);
	return col;
}

function create_xml_list_custom(list, object) {
	var s1 = '<div class="btn-group" data-toggle="buttons"><label class="btn btn-success active" style="height: 26px;padding-left: 6px;padding-right: 6px;padding-bottom: 3px;padding-top: 3px; ';
	var s2 = '"><input type="checkbox" autocomplete="off" checked="" style="margin-top: 0px; "/><span class="glyphicon glyphicon-ok"></span></label></div>'
	console.log(list);
	console.log(object + [i]);
	var data = '';
	for (var i=0; i < list.length; i++){
		data = data +
			   '<tr>' +
					'<td style="text-align: center;">' + s1 + 'id=\'' + object + [i] + '\' ' + 'value=\'' + object + '_' + list[i] + s2 + '</td>' +
					'<td>' + list[i] + '</td>'
				'</tr>\n' +
				'<br>\n';
	}
	console.log(data);

	return data;
}

function create_xml_list(list, object) {
	var s1 = '<div class="btn-group" data-toggle="buttons"><label class="btn btn-success active" 3style="height: 26px;padding-left: 6px;padding-right: 6px;padding-bottom: 3px;padding-top: 3px; ';
	var s2 = ' "><input type="checkbox" autocomplete="off" checked="" style="margin-top: 0px; "/><span class="glyphicon glyphicon-ok"></span></label></div>'
	var data = '';
	for (var i=0; i < list[0].length; i++){
		data = data +
			'<tr>' +
				'<td>' + s1 + 'id=\'' + object + [i] + '\' ' + 'value=\'' + object + '_' + list[0][i] + s2 + '</td>' +
				'<td>' + list[0][i] + '</td>' +
			'</tr>\n' +
			'<br>\n';
	}
	console.log(data);

	return data;
}

function remove_empty(all_ids){
	var sobjects_ids = [];
	for (var i=0; i < all_ids.length; i++){
		if (all_ids[i].length > 1) {
			console.log(all_ids[i]);
			sobjects_ids.push(all_ids[i]);
		}
	}

	return sobjects_ids;
}


