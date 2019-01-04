$(function () {

    function instertIntoBuy(p, q, stockName) {
        let markup = `<tr><td class="custom-market-table text-center quantity">${q}</td><td class="custom-market-table text-center price">${p}</td></tr>`;
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
        let markup = `<tr><td class="custom-market-table text-center price">${p}</td><td class="custom-market-table text-center quantity">${q}</td></tr>`;
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

    function removeOffer(stockId) {
        $('[data-id="' + stockId + '"]').parent().parent().remove();
        $('td:contains(' + stockId + ')').parent().remove();
    }

    function updateOffer(stockId, newQuantity) {
        $('[data-id="' + stockId + '"]').parent().parent().find('.quantity').text(newQuantity);
        $('td:contains('+stockId+')').siblings('.quantity').text(newQuantity);
    }

    var socket = io('/dashboard');

    socket.on('newOffer', function(msg){
        var {asset} = msg;
        var q = msg.quantity;
        var p = msg.price;

        msg.isBuy
            ? instertIntoBuy(p, q, asset)
            : instertIntoSell(p, q, asset);

    });

    socket.on('offerCompleted', function(id){
        removeOffer(id);
    });

    socket.on('offerMatched', function(id, q){
        updateOffer(id, q);
    });
});