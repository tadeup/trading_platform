$(function () {

    function instertIntoBuy(p, q) {
        let markup = `<tr><td class="custom-market-table text-center">${q}</td><td class="custom-market-table text-center">${p}</td></tr>`;
        let elems = $('#buy-table').children('tr');
        let count = elems.length;
        elems.each(function() {
            console.log(count);
            if ($(this).children().eq(1).text() < p) {
                $(this).before(markup);
                return false;
            }
            count--;
        });
        console.log(count);
        if (!count) $('#buy-table').append(markup);
    }

    function instertIntoSell(p, q) {
        let markup = `<tr><td class="custom-market-table text-center">${p}</td><td class="custom-market-table text-center">${q}</td></tr>`;
        let elems = $('#sell-table').children('tr');
        let count = elems.length;
        elems.each(function() {
            console.log(count);
            if ($(this).children().eq(1).text() > p) {
                $(this).before(markup);
                return false;
            }
            count--;
        });
        console.log(count);
        if (!count) $('#sell-table').append(markup);
    }
    var socket = io('/dashboard');

    // $('form').submit(function(){
    //     socket.emit('chat message', $('#m').val());
    //     $('#m').val('');
    //     return false;
    // });

    socket.on('newOffer', function(msg){
        var q = msg.quantity;
        var p = msg.price;
        msg.isBuy
            ? instertIntoBuy(p, q)
            : instertIntoSell(p, q);

        // $('#buy-table').append(markup);
        console.log(p, q);
    });
});
