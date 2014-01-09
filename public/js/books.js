$(document).ready(function(){
	$('#add').click(function(){
		$('#thumb').remove();
		$('#bookTitle, #authors, #ISBN').val('');
		$('.bookInfo').addClass('hide');
	})

	$('#isbnSearch').click(function(){
		$('#thumb').remove();
		var isbn = $('#ISBN').val();		
		var bookdata = {};
		$.ajax({
			url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn,
			dataType: 'json',
			success: function(data) {
				bookdata.title = data.items[0].volumeInfo.title;
				bookdata.authors = data.items[0].volumeInfo.authors;
				bookdata.publisher = data.items[0].volumeInfo.publisher;
				bookdata.publishedDate = data.items[0].volumeInfo.publishedDate;
				bookdata.description = data.items[0].volumeInfo.description;
				bookdata.isbn10 = data.items[0].volumeInfo.industryIdentifiers[0].identifier;
				bookdata.isbn13 = data.items[0].volumeInfo.industryIdentifiers[1].identifier;
				bookdata.smallthumbnail = data.items[0].volumeInfo.imageLinks.smallThumbnail;
				bookdata.thumbnail = data.items[0].volumeInfo.imageLinks.thumbnail;
				bookdata.owner_description = owner_description;
				$('#bookTitle').val(bookdata.title);
				$('#authors').val(bookdata.authors);
				$('#publisher').val(bookdata.publisher);
				$('#publishedDate').val(bookdata.publishedDate);
				$('.bookInfo, #showImage').removeClass('hide');
				$('#thumbnail').prepend('<img id="thumb" style="width:120px;margin-top:10px "src="'+bookdata.thumbnail+'"/>');
			},
			error: function(data) {
				console.log('Book not found');
			}
		})
		$('#save').click(function(event){
			event.preventDefault();
			bookdata.price  = $('#price').val();
			bookdata.condition = $('#condition').val();
			bookdata.owner_description = $('#owner_description').val();
			console.log(bookdata);
			$.ajax({
				url: "/book/new",
				type: "POST",
				data: bookdata,
				success: function(){
					console.log('OK');
					// location.reload(); // puercá.
					window.location = '/account';

				},
				error: function(data){
					console.log(data);
					console.log('ERROR');
				},
				statusCode:{
					409: function(){
						alert('Duplicated Book');
					}
				}

			})
		})
	})

	$('#ISBN').change(function(){
		if($(this).val().length >= 10){
			$('#isbnSearch').removeClass('disabled');
		}
	})

	$('.remove_item').click(function(){
		var _id = $(this).attr('_id');
		var node_to_delte = $(this);
		console.log();

		if(confirm("Are you sure you want to delete this Book?")){
            $.ajax({
                type: "POST",
                url: "/book/delete",
                data: {"_id":_id},
                success: function(data){ 
                	console.log(_id + ' deleted ' + data);
                	node_to_delte.parent().parent().remove();
                }
            });
        }

	})

	$(function(){
      $('.created').each(function(){
        $(this).text(moment(Date.parse($(this).text())).fromNow());
      });
    });
})

