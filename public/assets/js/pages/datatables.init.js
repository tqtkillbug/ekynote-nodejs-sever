$(document).ready(function () {
    $("#key-datatable").DataTable({
        keys: !0
    }), $("#selection-datatable").DataTable({
        select: {
            style: "multi"
        }
    }), a.buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)")
});