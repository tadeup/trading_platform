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

// $(".market-form").submit( function(eventObj) {
//     $('<input />').attr('type', 'hidden')
//         .attr('name', "something")
//         .attr('value', "something")
//         .appendTo(this);
//     return true;
// });