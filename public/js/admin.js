$(document).ready(function () {
    $('.delete-stock').on('click', function () {
        const stockId = $(this).attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/admin/stocks',
            data: {stockId},
            success: function (response) {
                location.reload();
            },
            error: function (err) {
                console.log(err)
            }
        })
    });
});