$(document).ready(function() {
	$("div#tabs").tabs();
	
	//track the number of rows created to avoid duplicate entries
	var numRows = 1;
	
	//the delete and submit buttons are disabled initially
	$(".deleteRow").prop('disabled', true);
	$(".submit").prop('disabled', true);
	
	//resets the fields of the first row to overwrite cached entries on page refresh
	$(".nameField").val('');
	$(".amountField").val('');
	$(".interestField").val('');
	$(".paymentField").val('');		
	
	//hide the div that will contain the response
	$(".response").hide();
	
	//whenever a key press is detected in a field, check that ALL other fields are filled
	$(".field").keyup(function() {
		var container = $(this).closest(".formContainer").attr('id');
		checkFields(container);
	}).keyup();

	//display the answer in the response div
	$(".calculator").on('ajax:success', function(event, data, status, xhr) {
		var num = $(data).find("div.answerContainer").first().attr('id');
		$("#response" + num).html(data);
		$("#response" + num).show();
	});
	
	$(".submit").click(function() {
		var container = $(this).closest(".formContainer").attr('id');
		$("#" + container).find(".hiddenField").first().val(container.slice(-1));
	});
	
	$(".addRow").click(function() {
		var nextNum = Number(numRows + 1);
		numRows = numRows + 1;
		var newRow = $(".input").first().clone(true).attr('id', 'row' + nextNum);
		
		//give the newly create row unique attributes
		newRow.find(".nameField").attr('id', 'debt' + nextNum + '_name').attr('name', 'debt' + nextNum + '[name]').val('');
		newRow.find(".amountField").attr('id', 'debt' + nextNum + '_amount').attr('name', 'debt' + nextNum + '[amount]').val('');
		newRow.find(".interestField").attr('id', 'debt' + nextNum + '_interest').attr('name', 'debt' + nextNum + '[interest]').val('');
		newRow.find(".paymentField").attr('id', 'debt' + nextNum + '_payment').attr('name', 'debt' + nextNum + '[payment]').val('');
		newRow.insertBefore($(this).closest(".buttonContainer"));		
		
		//now there are at least two rows, so the delete function can be enabled
		$(".deleteRow").prop('disabled', false);
		
		//there is now at least one empty row, so the form cannot be submitted
		$(".submit").prop('disabled', true);
	});
	
	$(".deleteRow").on('click',function(event) {	
		var container = $(this).closest(".formContainer").attr('id');	
		$(this).closest(".input").remove();	
		
		if($("#" + container).find(".input").length === 1) {
			$(".deleteRow").prop('disabled', true);
		}
		//check if submission is now valid (i.e. the deleted row was the only one with an empty field)
		checkFields(container);		
	});
	
	//checks all fields of the form and enables the submit button if they are filled
	function checkFields(container) {
		
		var empty = false;
		$("#" + container).find(".field").each(function() {			
			if ($(this).val().trim().length === 0) {
				empty = true;
			}
		});
		if(empty) {
			$("#" + container).find(".submit").first().prop('disabled', true);
		}
		else {
			$("#" + container).find(".submit").first().prop('disabled', false);
		}
	};
		
});


