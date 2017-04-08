namespace tree {

    let jsTree: JSTree;

    export function init(): void {
        $("#catalog-tree")
            .on('changed.jstree', onChanged)
            .jstree({
                core: {
                    data: onLoadingChildren,
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
    }

    function onChanged(e: JQueryEventObject, data: any): void {
        $.connection.entryReaderHub.server.getEntries(data.node.id).done(list.populateList);
        jsTree.open_node(data.node);
    }

    function onLoadingChildren(obj, callback): void {
        console.log("data loading", obj);
        if (obj.id === "#") {
            $.connection.groupReaderHub.server.getRootNode().done(group => {
                console.log(group);
                callback.call(this, [{ id: group.ID, text: group.Name, children: true, type: "root", state: { opened: true } }]);
            });
        } else {
            $.connection.groupReaderHub.server.getChildren(obj.id).done(groups => {
                console.log("children", groups);

                var callbackData = [];
                for (var i = 0, len = groups.length; i < len; i++) {
                    callbackData.push({ id: groups[i].ID, text: groups[i].Name, children: true, type: "default" });
                }

                callback.call(this, callbackData);
            });
        }
    }
}