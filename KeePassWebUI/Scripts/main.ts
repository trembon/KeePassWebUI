$(() => {
    var triggers: Array<() => void> = [];
    triggers.push(list.init());
    triggers.push(tree.init());
    triggers.push(modals.init());

    $.connection.hub.start().done(() => {
        triggers.forEach(val => val());

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

        $("#add-group-btn").click(e => {
            e.preventDefault();
            let selectedGroup = tree.getSelectedGroup();
            if (selectedGroup !== "") {
                let tempGroup = <KPGroup>{ ParentID: selectedGroup };
                modals.showGroupModal(tempGroup, group => {
                    console.log("modals.showGroupModal - callback", group);
                    $.connection.groupHub.server.addGroup(group).done(res => {
                        console.log("addGroup", res);
                    });
                });
            }
        });
    });
});

