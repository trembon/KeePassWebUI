$(() => {
    let jsTree: JSTree;

    $.connection.hub.start().done(function () {

        $("#catalog-tree").on('changed.jstree', (e, data) => {
            $.connection.entryReaderHub.server.getEntries(data.node.id).done(entries => {
                console.log(entries);

                let list = $("#list");
                list.html(`<table class="table"><thead><tr><th>Name</th><th>Username</th><th>Url</th><th>Password</th></tr></thead><tbody></tbody></table>`);

                entries.forEach(entry => {
                    list.find("tbody").append(`<tr><td>${entry.Name}</td><td>${entry.Username}</td><td>${entry.Url}</td><td data-password="${entry.Password}">********</td></tr>`);
                });

                handlePasswords();
            });
            jsTree.open_node(data.node);
        }).jstree({
            core: {
                data: (obj, callback) => {
                    console.log("data loading", obj);
                    if (obj.id === "#") {
                        $.connection.catalogReaderHub.server.getRootNode().done(catalog => {
                            console.log(catalog);
                            callback.call(this, [{ id: catalog.ID, text: catalog.Name, children: true, type: "root", state: { opened: true } }]);
                        });
                    } else {
                        $.connection.catalogReaderHub.server.getChildren(obj.id).done(catalogs => {
                            console.log("children", catalogs);

                            var callbackData = [];
                            for (var i = 0, len = (<any>catalogs).length; i < len; i++) {
                                callbackData.push({ id: (<any>catalogs)[i].ID, text: (<any>catalogs)[i].Name, children: true, type: "default" });
                            }

                            callback.call(this, callbackData);
                        });
                    }
                },
                check_callback: (operation, node, node_parent, node_position, more) => {
                    return true;
                },
                multiple: false,
                error: () => { console.log("jsTree: unexpected error (verify check_callback)"); }
            },
            plugins: ['html_data', 'types', 'changed', 'wholerow', 'dnd'],
            types: {
                "#": {
                    "valid_children": ["root"]
                },
                "root": {
                    "icon": "jstree-folder",
                    "valid_children": ["default"]
                },
                "default": {
                    "icon": "jstree-file",
                    "valid_children": ["default"]
                }
            }
        });

        jsTree = $("#catalog-tree").jstree(true);
    });
});

function handlePasswords(): void {
    console.log($("#password-toggle").val(), $("#password-toggle").val() === "1");
    if ($("#password-toggle").is(":checked")) {
        $("#list tbody td[data-password]").each((i, el) => {
            $(el).html($(el).data("password"));
        });
    } else {
        $("#list tbody td[data-password]").html("******");
    }
}