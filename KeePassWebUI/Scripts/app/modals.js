var modals;
(function (modals) {
    var $entryModal;
    var $groupModal;
    function init() {
        initEntry();
        initGroup();
        return function () { };
    }
    modals.init = init;
    function initEntry() {
        $entryModal = $("#modal-entry");
        $("#modal-entry-show-password").on("change", function (e) {
            var $t = $(e.currentTarget);
            if ($t.is(":checked")) {
                $("#modal-entry-password").attr("type", "text");
            }
            else {
                $("#modal-entry-password").attr("type", "password");
            }
        });
    }
    function initGroup() {
        $groupModal = $("#modal-group");
    }
    function showEntryModal(entry, callback) {
        if (entry === null || entry.GroupID === null) {
            callback(null);
        }
        console.log("showEntryModal");
        $entryModal.find(".ok").one("click", function () {
            $entryModal.modal("hide");
            entry.Name = $entryModal.find("form input[name='name']").val();
            entry.Username = $entryModal.find("form input[name='username']").val();
            entry.Password = $entryModal.find("form input[name='password']").val();
            entry.Url = $entryModal.find("form input[name='url']").val();
            console.log("showEntryModal - done", entry);
            callback(entry);
        });
        $entryModal.find(".cancel").one("click", function () {
            console.log("showEntryModal - cancel");
            callback(null);
        });
        $entryModal.find("form input[name='name']").val(entry.Name);
        $entryModal.find("form input[name='username']").val(entry.Username);
        $entryModal.find("form input[name='password']").val(entry.Password);
        $entryModal.find("form input[name='url']").val(entry.Url);
        $entryModal.modal("show");
    }
    modals.showEntryModal = showEntryModal;
    function showGroupModal(group, callback) {
        if (group === null || group.ParentID === null) {
            callback(null);
        }
        $groupModal.find(".ok").one("click", function () {
            $groupModal.modal("hide");
            group.Name = $groupModal.find("form input[name='name']").val();
            console.log("showGroupModal - done");
            callback(group);
        });
        $groupModal.find(".cancel").one("click", function () {
            console.log("showGroupModal - cancel");
            callback(null);
        });
        $groupModal.find("form input[name='name']").val(group.Name);
        $groupModal.modal("show");
    }
    modals.showGroupModal = showGroupModal;
})(modals || (modals = {}));
//# sourceMappingURL=modals.js.map