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
	$(".comparisonTable").hide();
	$(".row").hide();

	
	//whenever a key press is detected in a field, check that ALL other fields are filled
	$(".field").keyup(function() {
		var container = $(this).closest(".formContainer").attr('id');
		checkFields(container);
	}).keyup();

	//display the answer in the response div
	$(".calculator").on('ajax:success', function(event, data, status, xhr) {		
		var response = $(data).find("div.answerContainer").first();		
		var num = response.attr('id');		
		$("#response" + num).html(data);
		$("#response" + num).show();
		
		var tableData = $(data).find("div.tableContents").first();
		$("#row" + num + "> .interest").html(tableData.find("#interest").first());
		$("#row" + num + "> .months").html(tableData.find("#months").first());
		$(".row#row" + num).show();
		
		$(this).find(".paymentField").each( function() {
			$(this).removeClass("errorField");
		});
		
		$(".comparisonTable").show();
		$(".row#header").show();
		
	});
	
	$(".submit").click(function(event) {
		var form = $(this).closest(".formContainer");
		var containerNum = form.attr('id').slice(-1);	
		var invalid = false;
		form.find(".paymentField").each( function() {
			var rowNum = $(this).attr('id').slice(-1);		
			var payment = $(this).val();
			var interest = form.find("#interest" + rowNum).first().val() / 100;
			var amount = form.find("#amount" + rowNum).first().val();
			if ((interest * amount) > payment) {
				$(this).addClass("errorField");
				invalid = true;
			}
		});
		
		if(invalid) {
			event.preventDefault();
			$(this).prop('disabled', true);			
			$("#response" + containerNum).html("One or more of your monthly payments is too low!");
			$("#response" + containerNum).show();
		}
		else {
			form.find(".hiddenField").first().val(containerNum);
		}
	});
	
	$(".addRow").click(function() {
		var nextNum = Number(numRows + 1);
		numRows = numRows + 1;
		var newRow = $(".input").first().clone(true).attr('id', 'row' + nextNum);
		
		//give the newly create row unique attributes
		newRow.find(".nameField").attr('id', 'name' + nextNum).attr('name', 'debt' + nextNum + '[name]').val('');
		newRow.find(".amountField").attr('id', 'amount' + nextNum).attr('name', 'debt' + nextNum + '[amount]').val('');
		newRow.find(".interestField").attr('id', 'interest'+ nextNum).attr('name', 'debt' + nextNum + '[interest]').val('');
		newRow.find(".paymentField").attr('id', 'payment' + nextNum).attr('name', 'debt' + nextNum + '[payment]').removeClass("errorField").val('');
		
		newRow.insertBefore($(this).closest(".buttonContainer"));		
		
		//now there are at least two rows, so the delete function can be enabled
		$(this).closest(".formContainer").find(".deleteRow").each(function() {
			$(this).prop('disabled', false);
		});
		
		
		//there is now at least one empty row, so the form cannot be submitted
		$(this).prev().prop('disabled', true);
	});
	
	$(".deleteRow").on('click',function(event) {	
		var container = $(this).closest(".formContainer").attr('id');	
		$(this).closest(".input").remove();	
		
		if($("#" + container).find(".input").length === 1) {
			$("#" + container).find(".deleteRow").first().prop('disabled', true);
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


