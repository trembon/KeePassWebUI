namespace list {

    let passwordString = "*********";

    let $list: JQuery;
    let $passwordToggle: JQuery;
    let activeGroup: string;

    export function init(): () => void {
        $list = $("#list");
        $passwordToggle = $("#password-toggle");

        $passwordToggle.change(onPasswordShowChange);

        $.signalR.entryHub.client.entryAdded = event_entryAdded;

        return () => { };
    }

    export function populateList(items: KPEntry[]): void {
        $list.html(`<table class="table"><thead><tr><th>Name</th><th>Username</th><th>Url</th><th>Password</th></tr></thead><tbody></tbody></table>`);

        let tbody = $list.find("tbody");
        items.forEach(item => {
            tbody.append(itemToListRow(item));
        });

        handlePasswords();
    }

    function itemToListRow(item: KPEntry): string {
        return `<tr><td>${item.Name}</td><td>${item.Username}</td><td>${item.Url}</td><td data-password="${item.Password}">********</td></tr>`;
    }

    function event_entryAdded(item: KPEntry): void {
        console.log("entryAdded_event", item);

        if (tree.getSelectedGroup() === item.GroupID) {
            $list.find("tbody").append(itemToListRow(item));
        }
    }

    function onPasswordShowChange(e: JQueryEventObject): void {
        handlePasswords();
    }

    function handlePasswords(): void {
        console.log($("#password-toggle").val(), $("#password-toggle").val() === "1");
        if ($passwordToggle.is(":checked")) {
            $list.find("tbody td[data-password]").each((i, el) => {
                let $el = $(el);
                $el.html($el.data("password"));
            });
        } else {
            $list.find("tbody td[data-password]").html(passwordString);
        }
    }
}