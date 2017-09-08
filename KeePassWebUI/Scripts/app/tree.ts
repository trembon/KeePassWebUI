namespace tree {

    let jsTree: JSTree;

    export function init(): () => void {
        $.signalR.groupHub.client.groupAdded = event_groupAdded;

        return () => {
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
        };
    }

    export function getSelectedGroup(): string {
        // TODO: findbetter solution?
        let selectedNodes: any[] = $('#catalog-tree').jstree('get_selected');
        if (selectedNodes.length == 1)
            return selectedNodes[0];

        return "";
    }

    function event_groupAdded(item: KPGroup): void {
        console.log("groupAdded_event", item);

        let node = jsTree.get_node(item.ParentID);
        console.log("found node", node);
        if (node === null)
            return;

        if (jsTree.is_open(node) || node.id === getSelectedGroup()) {
            jsTree.create_node(node, { id: item.ID, text: item.Name, children: true, type: "default" });
            jsTree.open_node(node);
        }
    }

    function onChanged(e: JQueryEventObject, data: any): void {
        $.connection.entryHub.server.getEntries(data.node.id).done(list.populateList);
        jsTree.open_node(data.node);
    }

    function onLoadingChildren(obj, callback): void {
        console.log("data loading", obj);
        if (obj.id === "#") {
            $.connection.groupHub.server.getRootNode().done(group => {
                console.log(group);
                callback.call(this, [{ id: group.ID, text: group.Name, children: true, type: "root", state: { opened: true } }]);
            });
        } else {
            $.connection.groupHub.server.getChildren(obj.id).done(groups => {
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