$(function () {
    var jsTree;
    $.connection.hub.start().done(function () {
        var _this = this;
        $("#catalog-tree").on('changed.jstree', function (e, data) {
            $.connection.entryReaderHub.server.getEntries(data.node.id).done(function (entries) {
                console.log(entries);
                var list = $("#list");
                list.html("<table class=\"table\"><thead><tr><th>Name</th><th>Username</th><th>Url</th><th>Password</th></tr></thead><tbody></tbody></table>");
                entries.forEach(function (entry) {
                    list.find("tbody").append("<tr><td>" + entry.Name + "</td><td>" + entry.Username + "</td><td>" + entry.Url + "</td><td data-password=\"" + entry.Password + "\">********</td></tr>");
                });
                handlePasswords();
            });
            jsTree.open_node(data.node);
        }).jstree({
            core: {
                data: function (obj, callback) {
                    console.log("data loading", obj);
                    if (obj.id === "#") {
                        $.connection.catalogReaderHub.server.getRootNode().done(function (catalog) {
                            console.log(catalog);
                            callback.call(_this, [{ id: catalog.ID, text: catalog.Name, children: true, type: "root", state: { opened: true } }]);
                        });
                    }
                    else {
                        $.connection.catalogReaderHub.server.getChildren(obj.id).done(function (catalogs) {
                            console.log("children", catalogs);
                            var callbackData = [];
                            for (var i = 0, len = catalogs.length; i < len; i++) {
                                callbackData.push({ id: catalogs[i].ID, text: catalogs[i].Name, children: true, type: "default" });
                            }
                            callback.call(_this, callbackData);
                        });
                    }
                },
                check_callback: function (operation, node, node_parent, node_position, more) {
                    return true;
                },
                multiple: false,
                error: function () { console.log("jsTree: unexpected error (verify check_callback)"); }
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
function handlePasswords() {
    console.log($("#password-toggle").val(), $("#password-toggle").val() === "1");
    if ($("#password-toggle").is(":checked")) {
        $("#list tbody td[data-password]").each(function (i, el) {
            $(el).html($(el).data("password"));
        });
    }
    else {
        $("#list tbody td[data-password]").html("******");
    }
}
//# sourceMappingURL=main.js.map