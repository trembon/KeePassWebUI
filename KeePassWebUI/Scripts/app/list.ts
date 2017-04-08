namespace list {

    let passwordString = "*********";

    let $list: JQuery;
    let $passwordToggle: JQuery;

    export function init(): void {
        $list = $("#list");
        $passwordToggle = $("#password-toggle");

        $passwordToggle.change(onPasswordShowChange);
    }

    export function populateList(items: KPEntry[]): void {
        let list = $("#list");
        list.html(`<table class="table"><thead><tr><th>Name</th><th>Username</th><th>Url</th><th>Password</th></tr></thead><tbody></tbody></table>`);

        items.forEach(item => {
            list.find("tbody").append(`<tr><td>${item.Name}</td><td>${item.Username}</td><td>${item.Url}</td><td data-password="${item.Password}">********</td></tr>`);
        });

        handlePasswords();
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