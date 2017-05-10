var modals;
(function (modals) {
    var $entryModal;
    function init() {
        initEntry();
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
})(modals || (modals = {}));
//# sourceMappingURL=modals.js.map