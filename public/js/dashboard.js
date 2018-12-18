$(function(){
    // bind change event to select
    $('#assetName').on('change', function () {
        var url = '/dashboard/market/' + $(this).val(); // get selected value
        if (url) { // require a URL
            window.location = url; // redirect
        }
        return false;
    });
});

$(document).ready(function () {
    $('.delete-offer').on('click', function (e) {
        var url;
        const id = $(this).attr('data-id');
        if ($(this).hasClass('sell-offer')) {
            url = '/market/delete/sell/' + id;
        } else if ($(this).hasClass('buy-offer')) {
            url = '/market/delete/buy/' + id;
        }

        $.ajax({
            type: 'DELETE',
            url,
            success: function (response) {
                location.reload();
            },
            error: function (err) {
                console.log(err)
            }
        })
    });
});

// $(".market-form").submit( function(eventObj) {
//     $('<input />').attr('type', 'hidden')
//         .attr('name', "something")
//         .attr('value', "something")
//         .appendTo(this);
//     return true;
// });