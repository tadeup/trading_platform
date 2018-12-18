$(function () {

    function instertIntoBuy(p, q, stockName) {
        let markup = `<tr><td class="custom-market-table text-center">${q}</td><td class="custom-market-table text-center">${p}</td></tr>`;
        let tableId = '#buy-table-'+stockName;
        let elems = $(tableId).children('tr');
        let count = elems.length;
        elems.each(function() {
            if ($(this).children().eq(1).text() < p) {
                $(this).before(markup);
                return false;
            }
            count--;
        });
        if (!count) $(tableId).append(markup);
    }

    function instertIntoSell(p, q, stockName) {
        let markup = `<tr><td class="custom-market-table text-center">${p}</td><td class="custom-market-table text-center">${q}</td></tr>`;
        let tableId = '#sell-table-'+stockName;
        let elems = $(tableId).children('tr');
        let count = elems.length;
        elems.each(function() {
            if ($(this).children().eq(1).text() > p) {
                $(this).before(markup);
                return false;
            }
            count--;
        });
        if (!count) $(tableId).append(markup);
    }
    var socket = io('/dashboard');

    // $('form').submit(function(){
    //     socket.emit('chat message', $('#m').val());
    //     $('#m').val('');
    //     return false;
    // });

    socket.on('newOffer', function(msg){
        var {asset} = msg;
        var q = msg.quantity;
        var p = msg.price;

        msg.isBuy
            ? instertIntoBuy(p, q, asset)
            : instertIntoSell(p, q, asset);

    });
});