/* Filter the internship table by firm type.
 *
 * A firm with several roles spans its Firm and Type cells over the rows that
 * follow, so rows cannot be hidden individually without leaving those spans
 * pointing at rows that are gone. Every row of a firm's block carries the same
 * data-type, so each block is shown or hidden as a whole and the spans stay
 * consistent.
 *
 * The control is hidden in the markup and revealed here, so a reader without
 * JavaScript sees the full table rather than a select that does nothing. */
(function () {
    'use strict';

    var select = document.getElementById('intern-type');
    var table = document.querySelector('table.intern-table');
    if (!select || !table) { return; }

    var wrap = select.closest('.intern-filter');
    var count = document.getElementById('intern-filter-count');
    var rows = Array.prototype.slice.call(table.tBodies[0].rows);

    function apply(type) {
        var firms = 0, roles = 0;
        rows.forEach(function (row) {
            var show = !type || row.getAttribute('data-type') === type;
            row.hidden = !show;
            if (!show) { return; }
            if (!row.classList.contains('intern-cont')) { firms++; }
            if (row.querySelector('.intern-open')) { roles++; }
        });
        if (count) {
            count.textContent = type
                ? firms + (firms === 1 ? ' firm' : ' firms') + ', ' +
                  roles + (roles === 1 ? ' role' : ' roles') + ' open'
                : '';
        }
        try {
            if (type) { localStorage.setItem('intern-type', type); }
            else { localStorage.removeItem('intern-type'); }
        } catch (e) { /* private window, blocked storage: filtering still works */ }
    }

    var saved = '';
    try { saved = localStorage.getItem('intern-type') || ''; } catch (e) { saved = ''; }
    if (saved && select.querySelector('option[value="' + saved.replace(/"/g, '\\"') + '"]')) {
        select.value = saved;
    }

    select.addEventListener('change', function () { apply(select.value); });
    if (wrap) { wrap.hidden = false; }
    apply(select.value);
}());
