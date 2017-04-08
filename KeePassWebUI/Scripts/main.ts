$(() => {
    $.connection.hub.start().done(function () {
        list.init();
        tree.init();
    });
});

