namespace modals {
    
    let $entryModal: JQuery;

    export function init(): void {
        initEntry();
    }

    function initEntry(): void {
        $entryModal = $("#modal-entry");

        $("#modal-entry-show-password").on("change", (e) => {
            let $t = $(e.currentTarget);
            if ($t.is(":checked")) {
                $("#modal-entry-password").attr("type", "text");
            } else {
                $("#modal-entry-password").attr("type", "password");
            }
        });
    }

    export function showEntryModal(entry: KPEntry, callback: (entry: KPEntry) => void): void {
        if (entry === null || entry.GroupID === null) {
            callback(null);
        }
        console.log(`showEntryModal`);

        $entryModal.find(".ok").one("click", () => {
            $entryModal.modal("hide");

            entry.Name = $entryModal.find("form input[name='name']").val();
            entry.Username = $entryModal.find("form input[name='username']").val();
            entry.Password = $entryModal.find("form input[name='password']").val();
            entry.Url = $entryModal.find("form input[name='url']").val();

            console.log(`showEntryModal - done`, entry);
            callback(entry);
        });

        $entryModal.find(".cancel").one("click", () => {
            console.log(`showEntryModal - cancel`);
            callback(null);
        });

        $entryModal.find("form input[name='name']").val(entry.Name);
        $entryModal.find("form input[name='username']").val(entry.Username);
        $entryModal.find("form input[name='password']").val(entry.Password);
        $entryModal.find("form input[name='url']").val(entry.Url);

        $entryModal.modal("show");
    }
}