$(() => {
    $.connection.hub.start().done(function () {
        list.init();
        tree.init();

        $("#add-entry-btn").click(e => {
            e.preventDefault();
            let selectedGroup = tree.getSelectedGroup();
            if (selectedGroup !== "") {
                $.connection.entryReaderHub.server.addEntry(selectedGroup, "demo item").done(() => {
                    console.log("item added!");
                });
            }
        });
    });
});

