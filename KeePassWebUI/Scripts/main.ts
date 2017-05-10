$(() => {
    $.connection.hub.start().done(function () {
        list.init();
        tree.init();
        modals.init();

        $("#add-entry-btn").click(e => {
            e.preventDefault();
            let selectedGroup = tree.getSelectedGroup();
            if (selectedGroup !== "") {
                let tempEntry = <KPEntry>{ GroupID: selectedGroup };
                modals.showEntryModal(tempEntry, entry => {
                    console.log("modals.showEntryModal - callback", entry);
                    $.connection.entryHub.server.addEntry(entry).done(res => {
                        console.log("addEntry", res);
                    });
                });


                //$("#modal-add-entry .btn-primary").one("click", () => {
                //    console.log(`add new entry! (${$("#modal-add-entry").find("input[name='name']").val()})`);
                //    $("#modal-add-entry").modal("hide");
                //});

                //$("#modal-add-entry").modal("show");

                //$.connection.entryReaderHub.server.addEntry(selectedGroup, "demo item").done(() => {
                //    console.log("item added!");
                //});
            }
        });
    });
});

